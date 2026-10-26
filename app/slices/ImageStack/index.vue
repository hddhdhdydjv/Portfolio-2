<script setup lang="ts">
import type { Content } from '@prismicio/client'

defineProps(getSliceComponentProps<Content.ImageStackSlice>(['slice', 'index', 'slices', 'context']))
</script>

<template>
  <section class="slice-images" :data-slice-type="slice.slice_type" :data-slice-variation="slice.variation">
    <figure v-for="(item, i) in slice.primary.images" :key="i" v-reveal="'image'" class="slice-images__item">
      <PrismicImage :field="item.image" :widths="[640, 960, 1280, 1800]" sizes="(max-width: 809px) 100vw, 62vw" />
    </figure>
  </section>
</template>

<style scoped>
.slice-images { margin-top: 64px; display: grid; gap: 12px; }
.slice-images__item { border-radius: var(--radius); overflow: hidden; aspect-ratio: 892 / 558; background: var(--surface); }
.slice-images__item :deep(img) { width: 100%; height: 100%; object-fit: cover; }
</style>
