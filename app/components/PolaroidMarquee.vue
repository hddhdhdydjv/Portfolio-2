<script setup lang="ts">
import type { ImageField } from '@prismicio/client'
import { animate, createSpring } from 'animejs'

const props = defineProps<{ items: Array<{ photo: ImageField, caption?: string | null }> }>()
const track = ref<HTMLElement>()
// Rotations from the original layout, cycled.
const tilts = [-2, -5.2, 1.8, -3.3, -4.2, 2, -4.5, -3]
const loop = computed(() => [...props.items, ...props.items])

let marquee: ReturnType<typeof animate> | null = null
const spring = createSpring({ stiffness: 160, damping: 14 })

onMounted(() => {
  if (!track.value || prefersReducedMotion()) return
  const half = track.value.scrollWidth / 2
  // ~50px per second, like the original.
  marquee = animate(track.value, { x: [0, -half], duration: (half / 50) * 1000, ease: 'linear', loop: true })
})
onBeforeUnmount(() => marquee?.revert())

function hover(e: PointerEvent, i: number, on: boolean) {
  if (prefersReducedMotion()) return
  const card = e.currentTarget as HTMLElement
  animate(card, on
    ? { rotate: 0, y: -10, scale: 1.05, ease: spring }
    : { rotate: tilts[i % tilts.length] ?? 0, y: 0, scale: 1, ease: spring })
  if (marquee) animate(marquee, { speed: on ? 0.15 : 1, duration: 600, ease: 'out(3)' })
}
</script>

<template>
  <div class="polaroids">
    <div ref="track" class="polaroids__track">
      <figure
        v-for="(item, i) in loop" :key="i" class="polaroid"
        :style="{ transform: `rotate(${tilts[i % tilts.length]}deg)` }"
        :aria-hidden="i >= items.length ? 'true' : undefined"
        @pointerenter="hover($event, i, true)" @pointerleave="hover($event, i, false)"
      >
        <PrismicImage :field="item.photo" :widths="[300, 600]" sizes="234px" class="polaroid__img" />
        <figcaption v-if="item.caption" class="polaroid__caption">{{ item.caption }}</figcaption>
      </figure>
    </div>
  </div>
</template>

<style scoped>
.polaroids {
  padding: 40px 0;
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent 0%, #000 22%, rgb(0 0 0 / 0.72) 87%, transparent 100%);
}
.polaroids__track { display: flex; gap: 8px; width: max-content; padding: 0 12px; }
.polaroid {
  flex: none; width: 250px; padding: 8px 8px 56px;
  background: #fff; border-radius: 4px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
  position: relative;
}
.polaroid__img { width: 234px; height: 234px; object-fit: cover; background: #f0f0f0; }
.polaroid__caption {
  position: absolute; left: 8px; right: 8px; bottom: 18px;
  font-family: var(--font-hand); font-size: 17px; line-height: 1.2; letter-spacing: -0.01em;
  color: #000; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
@media (max-width: 809.98px) {
  .polaroid { width: 200px; }
  .polaroid__img { width: 184px; height: 184px; }
}
</style>
