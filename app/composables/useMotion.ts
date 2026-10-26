import { splitText } from 'animejs'

export function prefersReducedMotion() {
  return import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Jump to a scroll position, keeping Lenis in sync with the native scroll. */
export function scrollToInstant(top = 0) {
  if (!import.meta.client) return
  const { $lenis } = useNuxtApp()
  window.scrollTo(0, top)
  $lenis?.scrollTo(top, { immediate: true, force: true })
  $lenis?.resize()
}

/**
 * Splits an element into clipped lines. Line splitting needs layout, so anime.js
 * fills `lines` in an effect; this resolves once they exist.
 */
export function splitLines(el: HTMLElement): Promise<{ lines: HTMLElement[], revert: () => void }> {
  return new Promise((resolve) => {
    let done = false
    const split = splitText(el, { lines: { wrap: 'clip' } })
    split.addEffect((self: { lines: HTMLElement[] }) => {
      if (done || !self.lines.length) return
      done = true
      resolve({ lines: self.lines, revert: () => split.revert() })
    })
  })
}
