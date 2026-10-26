import Lenis from 'lenis'

export default defineNuxtPlugin(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lenis = reduced ? null : new Lenis({ autoRaf: true, lerp: 0.09, anchors: true })
  return { provide: { lenis } }
})
