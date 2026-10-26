<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
const ui = useUi()
const { to } = useLang()
</script>

<template>
  <div class="error">
    <p class="t-display">{{ error.statusCode }}</p>
    <p class="t-lead">{{ error.statusCode === 404 ? ui.notFound : error.statusMessage }}</p>
    <button class="error__home" @click="clearError({ redirect: to('/') })">{{ ui.backHome }}</button>
  </div>
</template>

<style scoped>
.error { min-height: 100vh; display: grid; place-content: center; justify-items: center; gap: 16px; padding: 24px; text-align: center; }
.error__home { margin-top: 16px; padding: 4px 16px; border-radius: 55px; background: var(--light); color: var(--ink); }
</style>
