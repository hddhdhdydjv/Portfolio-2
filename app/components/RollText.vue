<script setup lang="ts">
// Text whose letters roll up to a copy of themselves on hover, one after another
// (the "animated menu text" effect). The parent decides when: `.roll-trigger:hover`.
const props = defineProps<{ text: string }>()
const chars = computed(() => Array.from(props.text))
</script>

<template>
  <span class="roll" :aria-label="text">
    <span v-for="(c, i) in chars" :key="i" class="roll__char" :style="{ '--i': i }" aria-hidden="true">
      <span class="roll__face">{{ c === ' ' ? ' ' : c }}</span>
      <span class="roll__face roll__face--copy">{{ c === ' ' ? ' ' : c }}</span>
    </span>
  </span>
</template>

<style scoped>
.roll { display: inline-flex; overflow: hidden; vertical-align: top; }
.roll__char { position: relative; display: inline-block; }
.roll__face {
  display: block;
  transition: transform 0.6s var(--ease-out);
  transition-delay: calc(var(--i) * 22ms);
}
.roll__face--copy { position: absolute; inset: 100% 0 auto; }
@media (prefers-reduced-motion: reduce) { .roll__face { transition: none; } }
</style>

<style>
/* Unscoped: the hover lives on whichever parent carries .roll-trigger. */
.roll-trigger:hover .roll__face,
.roll-trigger:focus-visible .roll__face { transform: translateY(-100%); }
</style>
