<script setup lang="ts">
import type { RichTextField } from '@prismicio/client'

// PrismicRichText renders a fragment; this gives it a root element for classes and directives.
defineProps<{ field: RichTextField | null | undefined }>()
</script>

<template>
  <div><PrismicRichText :field="field" /></div>
</template>
