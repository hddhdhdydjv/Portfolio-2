<script setup lang="ts">
import type { PrismicDocument } from '@prismicio/client'
import { animate, onScroll } from 'animejs'

const props = defineProps<{ settings: PrismicDocument | null | undefined }>()
const s = computed(() => props.settings?.data ?? {})
const { to } = useLang()
const email = computed(() => (s.value.email ? `mailto:${s.value.email}` : undefined))

const root = ref<HTMLElement>()
const cat = ref<HTMLElement>()
const video = ref<HTMLVideoElement>()

let cleanup = () => {}
onMounted(() => {
  if (prefersReducedMotion()) { video.value?.pause(); return }
  // The cat climbs into frame as the footer scrolls in.
  if (cat.value && root.value) {
    const anim = animate(cat.value, {
      y: ['38%', '0%'], rotate: [-4, 0], ease: 'linear',
      autoplay: onScroll({ target: root.value, enter: 'bottom top', leave: 'bottom bottom', sync: 0.18 }),
    })
    cleanup = () => anim.revert()
  }
})
onBeforeUnmount(() => cleanup())
</script>

<template>
  <footer ref="root" class="site-footer">
    <video
      ref="video" class="site-footer__video" src="/media/footer-sea.mp4"
      autoplay muted loop playsinline preload="metadata" aria-hidden="true"
    />
    <div class="site-footer__content">
      <h2 v-reveal="'chars'" class="site-footer__heading">{{ s.footer_heading || 'Let’s get in touch' }}</h2>
      <a v-if="email" :href="email" class="site-footer__cta">{{ s.footer_cta || 'Email me' }}</a>
      <nav class="site-footer__links" aria-label="Footer">
        <NuxtLink :to="to('/')">{{ s.nav_home || 'Home' }}</NuxtLink>
        <NuxtLink :to="to('/projects')">{{ s.nav_projects || 'Projects' }}</NuxtLink>
        <NuxtLink :to="to('/about')">{{ s.nav_about || 'About' }}</NuxtLink>
      </nav>
    </div>
    <div v-if="s.footer_cat?.url" ref="cat" class="site-footer__cat">
      <PrismicImage :field="s.footer_cat" :imgix-params="{ w: 720 }" alt="" />
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  margin-top: 96px;
  border-radius: var(--radius);
  background: var(--light);
  overflow: hidden;
  padding: 24px;
  color: var(--ink);
  isolation: isolate;
}
.site-footer__video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: fill; z-index: -1; }
.site-footer__content { display: grid; justify-items: start; gap: 24px; position: relative; z-index: 1; }
.site-footer__heading {
  font-family: var(--font-display); font-weight: 400;
  font-size: 2.5rem; line-height: 1.1; letter-spacing: -0.04em; color: var(--ink);
}
.site-footer__cta {
  background: var(--ink); color: var(--text);
  border-radius: 55px; padding: 4px 16px;
  transition: transform 0.5s var(--ease-out), background-color 0.3s;
}
.site-footer__cta:hover { transform: translateY(-2px) scale(1.04); background: #000; }
.site-footer__links { display: grid; gap: 4px; justify-items: start; margin-top: 8px; }
.site-footer__links a {
  padding: 2px 4px; border-radius: 8px; color: var(--ink);
  transition: background-color 0.3s var(--ease-out), padding 0.4s var(--ease-out);
}
.site-footer__links a:hover { background: rgb(84 84 84 / 0.12); padding-left: 10px; }
.site-footer__cat {
  position: absolute; left: calc(100% - 217px); bottom: -179px;
  width: 360px; height: 400px; pointer-events: none; z-index: 0;
}
.site-footer__cat :deep(img) { width: 100%; height: 100%; object-fit: cover; }
</style>
