<script setup lang="ts">
import { animate, stagger } from 'animejs'

// First-load loader: a pixel grid covers the screen while fonts load, then
// clears in a diagonal wave (inspired by morphin.dev's pixel wave animation).
const props = defineProps<{ label?: string }>()
const visible = ref(true)
const grid = ref<HTMLElement>()
const cells = ref<{ cols: number, rows: number, size: number }>({ cols: 0, rows: 0, size: 0 })
const progress = ref(0)

onMounted(async () => {
  let seen = false
  try { seen = document.documentElement.classList.contains('loader-seen'); sessionStorage.setItem('pixel-loader', '1') } catch {}
  if (prefersReducedMotion() || seen) { visible.value = false; finishIntro(); return }

  const size = window.innerWidth < 810 ? 32 : 48
  cells.value = { cols: Math.ceil(window.innerWidth / size), rows: Math.ceil(window.innerHeight / size), size }
  const counter = animate(progress, { value: [0, 100], duration: 900, ease: 'out(3)', modifier: (v: number) => Math.round(v) })
  await Promise.all([document.fonts.ready, counter.then(() => {})])
  await nextTick()

  const { cols, rows } = cells.value
  const nodes = grid.value!.children
  const wave = animate(nodes, {
    opacity: [{ to: 1, duration: 0 }, { to: 0, duration: 380, ease: 'in(2)' }],
    backgroundColor: ['#474747', '#1c1c1c'],
    delay: stagger(22, { grid: [cols, rows], from: 'last' }),
  })
  window.setTimeout(finishIntro, 350)
  wave.then(() => { visible.value = false })
})
</script>

<template>
  <div v-if="visible" class="loader" aria-hidden="true">
    <div
      ref="grid" class="loader__grid"
      :style="{ gridTemplateColumns: `repeat(${cells.cols}, ${cells.size}px)`, gridAutoRows: `${cells.size}px` }"
    >
      <span v-for="n in cells.cols * cells.rows" :key="n" class="loader__cell" />
    </div>
    <div class="loader__label">
      <span>{{ props.label }}</span>
      <span class="loader__count">{{ String(progress).padStart(3, '0') }}</span>
    </div>
  </div>
</template>

<style scoped>
.loader { position: fixed; inset: 0; z-index: 100; background: transparent; pointer-events: none; }
.loader__grid { position: absolute; inset: 0; display: grid; overflow: hidden; }
.loader__cell { background: var(--bg); }
/* Before hydration builds the grid, the loader is a solid sheet. */
.loader:has(.loader__grid:empty) { background: var(--bg); }
/* Never block the page without JS, on repeat visits or with reduced motion. */
:global(html:not(.js) .loader), :global(html.loader-seen .loader) { display: none; }
@media (prefers-reduced-motion: reduce) { .loader { display: none; } }
.loader__label {
  position: absolute; left: var(--pad); bottom: var(--pad);
  display: flex; gap: 16px; color: var(--muted); font-size: 1rem; text-transform: uppercase;
}
.loader__count { color: var(--text); font-variant-numeric: tabular-nums; }
</style>
