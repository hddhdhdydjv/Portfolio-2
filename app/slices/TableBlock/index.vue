<script setup lang="ts">
import type { Content } from '@prismicio/client'

defineProps(getSliceComponentProps<Content.TableBlockSlice>(['slice', 'index', 'slices', 'context']))
</script>

<template>
  <section class="slice-table" :data-slice-type="slice.slice_type" :data-slice-variation="slice.variation">
    <h3 v-if="slice.primary.heading" v-reveal="'up'" class="t-section">{{ slice.primary.heading }}</h3>
    <div v-reveal="'up'" class="slice-table__scroll">
      <PrismicTable :field="slice.primary.table" />
    </div>
  </section>
</template>

<style scoped>
.slice-table { margin-top: 48px; }
.slice-table h3 { margin-bottom: 16px; }
.slice-table__scroll { overflow-x: auto; border: 1px solid var(--line); border-radius: var(--radius); }
.slice-table :deep(table) { width: 100%; border-collapse: collapse; font-size: 1rem; line-height: 1.25; }
.slice-table :deep(th), .slice-table :deep(td) { text-align: left; vertical-align: top; padding: 14px 16px; }
.slice-table :deep(th) { color: var(--muted); font-weight: 400; background: rgb(71 71 71 / 0.35); }
.slice-table :deep(tr + tr td), .slice-table :deep(tbody tr:first-child td) { border-top: 1px solid var(--line); }
.slice-table :deep(td:first-child) { color: var(--text-2); }
.slice-table :deep(th p), .slice-table :deep(td p) { margin: 0; }
.slice-table :deep(em) { font-style: italic; }
.slice-table :deep(strong) { font-weight: 700; }
@media (max-width: 809.98px) { .slice-table :deep(table) { min-width: 560px; } }
</style>
