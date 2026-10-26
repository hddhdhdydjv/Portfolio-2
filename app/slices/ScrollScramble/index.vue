<script setup lang="ts">
import type { Content } from '@prismicio/client'
import { animate, onScroll, scrambleText } from 'animejs'

// Scroll typography inspired by morphin.dev's "scroll scramble section":
// each line slides from one column to another while it crosses the viewport,
// scrambles when it enters, and a word stays fixed in the middle.
const props = defineProps(getSliceComponentProps<Content.ScrollScrambleSlice>(['slice', 'index', 'slices', 'context']))

type Line = { text: string, from: string, to: string, big: boolean }
const blocks = computed(() => {
  const out: Line[][] = []
  for (const l of props.slice.primary.lines) {
    if (!l.text) continue
    if (l.new_block || !out.length) out.push([])
    out.at(-1)!.push({ text: l.text, from: l.from ?? 'Left', to: l.to ?? 'Right', big: !!l.big })
  }
  return out
})

const root = ref<HTMLElement>()
const center = ref<HTMLElement>()
let teardown: Array<() => void> = []

function columnX(name: string, width: number, itemWidth: number) {
  const max = Math.max(0, width - itemWidth)
  const x = { 'Left': 0, 'Quarter': 0.25 * width, 'Right': 0.6 * width, 'Far right': max }[name] ?? 0
  return Math.min(x, max)
}

function scramble(el: HTMLElement, duration: number) {
  const text = el.dataset.text ?? ''
  animate(el, { innerHTML: scrambleText({ text, chars: 'A-Z0-9', duration, settleDuration: duration * 0.4 }) })
}

function build() {
  teardown.forEach((fn) => fn())
  teardown = []
  const el = root.value
  if (!el) return
  const width = el.clientWidth
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const target = entry.target as HTMLElement
      scramble(target, target.dataset.big ? 2200 : 900)
    }
  }, { threshold: 0.1 })
  teardown.push(() => observer.disconnect())

  el.querySelectorAll<HTMLElement>('[data-line]').forEach((line) => {
    const inner = line.firstElementChild as HTMLElement
    const a = columnX(line.dataset.from!, width, inner.offsetWidth)
    const b = columnX(line.dataset.to!, width, inner.offsetWidth)
    inner.style.transform = `translateX(${a}px)`
    observer.observe(inner)
    const anim = animate(inner, {
      x: [{ from: a, to: b, ease: 'inOutExpo' }, { to: a, ease: 'inOutExpo' }],
      autoplay: onScroll({ target: line, enter: 'bottom top', leave: 'top bottom', sync: true }),
    })
    teardown.push(() => anim.revert())
  })
}

let resizeTimer = 0
const onResize = () => { window.clearTimeout(resizeTimer); resizeTimer = window.setTimeout(build, 200) }

onMounted(() => {
  if (prefersReducedMotion()) return
  document.fonts.ready.then(() => {
    build()
    if (center.value) {
      const io = new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting) scramble(center.value!, 1400)
      }, { threshold: 0.5 })
      io.observe(center.value)
      teardown.push(() => io.disconnect())
    }
  })
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  teardown.forEach((fn) => fn())
})
</script>

<template>
  <section ref="root" class="ss" :data-slice-type="slice.slice_type" :data-slice-variation="slice.variation">
    <div v-if="slice.primary.center_word" class="ss__sticky" aria-hidden="true">
      <span ref="center" class="ss__center" :data-text="slice.primary.center_word">{{ slice.primary.center_word }}</span>
    </div>
    <div class="ss__content">
      <div v-for="(block, b) in blocks" :key="b" class="ss__block">
        <div
          v-for="(line, i) in block" :key="i" data-line :data-from="line.from" :data-to="line.to"
          class="ss__line" :class="{ 'ss__line--big': line.big }"
        >
          <span :data-text="line.text" :data-big="line.big ? '1' : undefined">{{ line.text }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ss { position: relative; margin-top: 96px; text-transform: uppercase; }
.ss__sticky {
  position: sticky; top: 0; height: 100vh; margin-bottom: -100vh;
  display: grid; place-items: center; pointer-events: none; z-index: 0;
}
.ss__center { font-family: var(--font-display); font-size: clamp(2rem, 5vw, 4rem); text-transform: none; color: var(--text); white-space: nowrap; }
.ss__content { position: relative; z-index: 1; padding: 70vh 0 30vh; }
.ss__block { display: flex; flex-direction: column; margin-bottom: 12vh; }
.ss__line { white-space: nowrap; color: var(--text-2); opacity: 0.6; font-size: 1rem; line-height: 1.35; overflow: visible; }
.ss__line > span { display: inline-block; will-change: transform; }
.ss__line--big { opacity: 1; color: var(--text); font-size: clamp(6rem, 20vw, 15rem); line-height: 1; }
@media (prefers-reduced-motion: reduce) {
  .ss__content { padding: 48px 0; }
  .ss__sticky { position: relative; height: auto; margin: 0 0 32px; }
}
</style>
