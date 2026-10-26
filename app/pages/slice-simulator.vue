<script setup lang="ts">
import { SliceSimulator } from '@slicemachine/adapter-nuxt/simulator'
import { components } from '~/slices'

definePageMeta({ layout: false })
</script>

<template>
  <SliceSimulator #default="{ slices }">
    <SliceZone :slices="slices" :components="components" />
  </SliceSimulator>
</template>
