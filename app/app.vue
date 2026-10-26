<script setup lang="ts">
import { animate } from 'animejs'
import { savedScroll } from '~/router.options'

const { data: settings } = await useSettings()
const { isEs } = useLang()

useHead(() => ({
  htmlAttrs: { lang: isEs.value ? 'es' : 'en' },
  titleTemplate: (title) => title || settings.value?.data.site_title || 'Alejandro Arab',
}))
useSeoMeta({
  description: () => settings.value?.data.site_description,
  ogSiteName: () => settings.value?.data.site_title,
  twitterCard: 'summary_large_image',
})

// Page transitions: the outgoing page and footer drift up and fade, the scroll
// resets while nothing is visible, then the new page rises in.
const footer = () => document.querySelector<HTMLElement>('.site-footer')

const transition = {
  mode: 'out-in' as const,
  css: false,
  onLeave(el: Element, done: () => void) {
    if (prefersReducedMotion()) return done()
    const f = footer()
    if (f) animate(f, { opacity: 0, duration: 300, ease: 'in(2)' })
    animate(el, {
      opacity: [1, 0], y: [0, -20], duration: 420, ease: 'in(3)',
      onComplete: () => { scrollToInstant(0); done() },
    })
  },
  onEnter(el: Element, done: () => void) {
    if (savedScroll.top) { scrollToInstant(savedScroll.top); savedScroll.top = 0 }
    if (prefersReducedMotion()) return done()
    const f = footer()
    animate(el, {
      opacity: [0, 1], y: [32, 0], duration: 900, ease: 'out(4)',
      onComplete: () => { (el as HTMLElement).style.transform = ''; done() },
    })
    if (f) animate(f, { opacity: [0, 1], duration: 700, delay: 400, ease: 'out(2)' })
  },
}
</script>

<template>
  <NuxtLayout>
    <NuxtPage :transition="transition" />
  </NuxtLayout>
</template>
