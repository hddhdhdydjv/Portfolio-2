<script setup lang="ts">
import type { ImageField } from '@prismicio/client'
import { isFilled } from '@prismicio/client'
import { animate, onScroll } from 'animejs'

const props = defineProps<{ title: string, image: ImageField, href: string, label?: string }>()
const card = ref<{ $el: HTMLElement }>()
const media = ref<HTMLElement>()
const hasImage = computed(() => isFilled.image(props.image))

let cleanup = () => {}
onMounted(() => {
  if (prefersReducedMotion() || !media.value || !card.value) return
  // Gentle parallax inside the frame while the card crosses the viewport.
  const anim = animate(media.value, {
    y: ['-4%', '4%'], ease: 'linear',
    autoplay: onScroll({ target: card.value.$el, enter: 'bottom top', leave: 'top bottom', sync: true }),
  })
  cleanup = () => anim.revert()
})
onBeforeUnmount(() => cleanup())
</script>

<template>
  <NuxtLink ref="card" v-reveal="'image'" :to="href" class="card" :aria-label="title">
    <div ref="media" class="card__media">
      <PrismicImage
        v-if="hasImage" :field="image" :widths="[640, 960, 1280, 1800]"
        sizes="(max-width: 809px) 100vw, 62vw" class="card__img"
      />
      <div v-else class="card__placeholder">
        <span class="t-display">{{ title }}</span>
      </div>
    </div>
    <span class="card__label">
      <span>{{ title }}</span>
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 10 10 2M4 2h6v6" stroke="currentColor" fill="none" stroke-width="1.4" /></svg>
    </span>
  </NuxtLink>
</template>

<style scoped>
.card {
  position: relative; display: block;
  aspect-ratio: 892 / 502;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--surface);
  transform: translateZ(0);
}
.card__media { position: absolute; inset: -5% 0; }
.card__img, .card__placeholder { width: 100%; height: 100%; object-fit: cover; }
.card__img { transition: transform 1.2s var(--ease-out); }
.card:hover .card__img { transform: scale(1.035); }
.card__placeholder {
  display: grid; place-items: center; padding: 24px; text-align: center;
  background: radial-gradient(120% 90% at 30% 20%, #555 0%, #2a2a2a 70%);
}
.card__label {
  position: absolute; left: 16px; bottom: 16px;
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 10px; border-radius: 10px;
  background: rgb(28 28 28 / 0.72); backdrop-filter: blur(10px);
  color: var(--text);
  opacity: 0; transform: translateY(8px);
  transition: opacity 0.5s var(--ease-out), transform 0.6s var(--ease-out);
}
.card:hover .card__label, .card:focus-visible .card__label { opacity: 1; transform: none; }
@media (hover: none) { .card__label { opacity: 1; transform: none; } }
</style>
