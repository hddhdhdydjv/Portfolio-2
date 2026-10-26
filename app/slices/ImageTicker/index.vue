<script setup lang="ts">
import type { Content } from '@prismicio/client'
import { animate } from 'animejs'

const props = defineProps(getSliceComponentProps<Content.ImageTickerSlice>(['slice', 'index', 'slices', 'context']))
const columns = computed(() => [props.slice.primary.left_images, props.slice.primary.right_images])
const tracks = ref<HTMLElement[]>([])
const anims: ReturnType<typeof animate>[] = []

onMounted(() => {
  if (prefersReducedMotion()) return
  tracks.value.forEach((track, i) => {
    const half = track.scrollHeight / 2
    // Columns drift in opposite directions at ~36px per second.
    anims.push(animate(track, {
      y: i === 0 ? [0, -half] : [-half, 0],
      duration: (half / 36) * 1000, ease: 'linear', loop: true,
    }))
  })
})
onBeforeUnmount(() => anims.forEach((a) => a.revert()))

function slow(on: boolean) {
  anims.forEach((a) => animate(a, { speed: on ? 0.2 : 1, duration: 600, ease: 'out(3)' }))
}
</script>

<template>
  <section
    v-reveal="'fade'" class="slice-ticker" :data-slice-type="slice.slice_type" :data-slice-variation="slice.variation"
    @pointerenter="slow(true)" @pointerleave="slow(false)"
  >
    <div v-for="(col, c) in columns" :key="c" class="slice-ticker__col">
      <div ref="tracks" class="slice-ticker__track">
        <figure v-for="(item, i) in [...col, ...col]" :key="i" class="slice-ticker__item" :aria-hidden="i >= col.length ? 'true' : undefined">
          <PrismicImage :field="item.image" :widths="[480, 900]" sizes="(max-width: 809px) 50vw, 31vw" />
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped>
.slice-ticker {
  margin-top: 64px;
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  height: 500px; overflow: hidden;
  mask-image: linear-gradient(transparent 0%, #000 12.5%, #000 87.5%, transparent 100%);
}
.slice-ticker__col { overflow: hidden; }
.slice-ticker__track { display: grid; gap: 12px; padding-bottom: 12px; }
.slice-ticker__item { border-radius: var(--radius); overflow: hidden; aspect-ratio: 440 / 330; background: var(--surface); }
.slice-ticker__item :deep(img) { width: 100%; height: 100%; object-fit: cover; }
@media (max-width: 809.98px) { .slice-ticker { height: 360px; } }
</style>
