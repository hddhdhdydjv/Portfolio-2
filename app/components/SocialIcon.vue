<script setup lang="ts">
// 16px outline icons, drawn to match the pixel UI.
defineProps<{ platform?: string | null }>()
</script>

<template>
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true">
    <template v-if="platform === 'Email'"><rect x="1.5" y="3" width="13" height="10" rx="1.5" /><path d="m2 4 6 5 6-5" /></template>
    <template v-else-if="platform === 'LinkedIn'"><rect x="1.5" y="1.5" width="13" height="13" rx="1.5" /><path d="M5 7v4.5M5 4.6v.1M7.6 11.5V7m0 2c0-1.2.8-2 1.8-2s1.6.7 1.6 1.9v2.6" stroke-linecap="round" /></template>
    <template v-else-if="platform === 'Instagram'"><rect x="1.5" y="1.5" width="13" height="13" rx="4" /><circle cx="8" cy="8" r="3" /><path d="M11.8 4.2v.1" stroke-linecap="round" /></template>
    <template v-else-if="platform === 'Behance'"><path d="M1.5 4h3.3a1.8 1.8 0 0 1 0 3.6H1.5zm0 3.6h3.8a2 2 0 0 1 0 4H1.5zM9.5 9.3h5a2.5 2.5 0 1 0-.6 1.7M10 4.5h3.5" /></template>
    <template v-else-if="platform === 'Dribbble'"><circle cx="8" cy="8" r="6.5" /><path d="M3.3 3.8C6 6 7.7 9 8.6 14.3M1.6 7.2c4 .3 8.2-.8 11-3.7M5.5 13.9c1.6-3 4.6-4.6 8.9-3.9" /></template>
    <template v-else-if="platform === 'GitHub'"><path d="M6 14c-3 .9-3-1.5-4.2-1.8M10 15.5v-2.3c0-.7.1-1.2-.4-1.6 2-.2 4-1 4-4.4 0-.9-.3-1.7-.9-2.4.1-.7.1-1.5-.1-2.3 0 0-.8-.2-2.4.9a8.3 8.3 0 0 0-4.4 0C4.2 2.3 3.4 2.5 3.4 2.5c-.2.8-.2 1.6-.1 2.3-.6.7-.9 1.5-.9 2.4 0 3.4 2 4.2 4 4.4-.4.4-.5.9-.4 1.6v2.3" stroke-linecap="round" /></template>
    <template v-else-if="platform === 'X'"><path d="m2 2 12 12M14 2 2 14" /></template>
    <template v-else-if="platform === 'Read.cv'"><rect x="3" y="1.5" width="10" height="13" rx="1.5" /><path d="M5.5 5h5M5.5 8h5M5.5 11h3" /></template>
    <template v-else><circle cx="8" cy="8" r="6.5" /><path d="M1.5 8h13M8 1.5c2 2 2.6 4.2 2.6 6.5S10 12.5 8 14.5C6 12.5 5.4 10.3 5.4 8S6 3.5 8 1.5" /></template>
  </svg>
</template>
