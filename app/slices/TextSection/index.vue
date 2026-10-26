<script setup lang="ts">
import type { Content } from '@prismicio/client'

defineProps(getSliceComponentProps<Content.TextSectionSlice>(['slice', 'index', 'slices', 'context']))
</script>

<template>
  <section class="slice-text" :data-slice-type="slice.slice_type" :data-slice-variation="slice.variation">
    <h2 v-if="slice.primary.heading" v-reveal="'lines'" class="t-title">{{ slice.primary.heading }}</h2>
    <RichText v-reveal="'up'" :field="slice.primary.body" class="prose" />
  </section>
</template>

<style scoped>
.slice-text { margin-top: 64px; }
.slice-text h2 { margin-bottom: 24px; }
.slice-text .prose:empty { display: none; }
</style>
