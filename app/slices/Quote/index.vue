<script setup lang="ts">
import type { Content } from '@prismicio/client'

defineProps(getSliceComponentProps<Content.QuoteSlice>(['slice', 'index', 'slices', 'context']))
</script>

<template>
  <blockquote class="slice-quote" :data-slice-type="slice.slice_type" :data-slice-variation="slice.variation">
    <RichText v-reveal="'lines'" :field="slice.primary.quote" />
  </blockquote>
</template>

<style scoped>
.slice-quote {
  margin-top: 48px; padding: 32px; border-radius: var(--radius);
  background: var(--surface);
  font-family: var(--font-display); font-size: 2.2rem; line-height: 1.1; letter-spacing: -0.01em; color: var(--text);
}
.slice-quote :deep(strong) { font-weight: 400; color: var(--muted); }
</style>
