import type { Directive } from 'vue'
import { animate, splitText, stagger } from 'animejs'

// v-reveal="'up' | 'fade' | 'image' | 'stagger' | 'lines' | 'chars'"
// v-reveal="{ type: 'up', delay: 120 }"
type RevealType = 'up' | 'fade' | 'image' | 'stagger' | 'lines' | 'chars'
type RevealValue = RevealType | { type?: RevealType, delay?: number } | undefined

const EASE = 'out(4)'
const pending = new WeakMap<Element, () => void>()
const cleanups = new WeakMap<Element, () => void>()
let observer: IntersectionObserver | null = null

function getObserver() {
  observer ??= new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      observer!.unobserve(entry.target)
      pending.get(entry.target)?.()
      pending.delete(entry.target)
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 })
  return observer
}

function run(el: HTMLElement, type: RevealType, delay: number) {
  el.setAttribute('data-revealed', '')
  switch (type) {
    case 'fade':
      animate(el, { opacity: [0, 1], duration: 900, delay, ease: 'out(2)' })
      break
    case 'image': {
      const media = el.querySelector('img, video, canvas')
      animate(el, {
        opacity: [0, 1],
        clipPath: ['inset(10% 6% 0% 6% round 12px)', 'inset(0% 0% 0% 0% round 12px)'],
        duration: 1200, delay, ease: EASE,
        onComplete: () => { el.style.clipPath = '' },
      })
      if (media) animate(media, { scale: [1.14, 1], duration: 1600, delay, ease: EASE })
      break
    }
    case 'stagger': {
      el.style.opacity = '1'
      animate(Array.from(el.children), { opacity: [0, 1], y: [18, 0], duration: 800, delay: stagger(45, { start: delay }), ease: EASE })
      break
    }
    case 'lines': {
      splitLines(el).then(({ lines, revert }) => {
        el.style.opacity = '1'
        animate(lines, { y: ['105%', '0%'], duration: 1000, delay: stagger(80, { start: delay }), ease: EASE, onComplete: revert })
        cleanups.set(el, revert)
      })
      break
    }
    case 'chars': {
      el.style.opacity = '1'
      const split = splitText(el, { words: { wrap: 'clip' }, chars: true })
      animate(split.chars, { y: ['105%', '0%'], duration: 900, delay: stagger(16, { start: delay }), ease: EASE, onComplete: () => split.revert() })
      cleanups.set(el, () => split.revert())
      break
    }
    default:
      animate(el, { opacity: [0, 1], y: [28, 0], duration: 1000, delay, ease: EASE })
  }
}

function normalize(value: RevealValue): { type: RevealType, delay: number } {
  if (typeof value === 'string') return { type: value, delay: 0 }
  return { type: value?.type ?? 'up', delay: value?.delay ?? 0 }
}

const reveal: Directive<HTMLElement, RevealValue> = {
  getSSRProps: () => ({ 'data-reveal': '' }),
  mounted(el, binding) {
    el.setAttribute('data-reveal', '')
    if (prefersReducedMotion()) { el.setAttribute('data-revealed', ''); return }
    const { type, delay } = normalize(binding.value)
    const start = () => (document.fonts?.ready ?? Promise.resolve()).then(() => run(el, type, delay))
    pending.set(el, start)
    getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
    pending.delete(el)
    cleanups.get(el)?.()
    cleanups.delete(el)
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', reveal)
})
