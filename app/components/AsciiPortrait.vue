<script setup lang="ts">
import { animate } from 'animejs'

// Renders an image as a fine "block character" texture (░▒▓█) with a soft glow,
// a static flicker, a materialize intro and a glitch that follows the pointer.
const props = withDefaults(defineProps<{
  src: string
  alt?: string | null
  color?: [number, number, number]
  brightness?: number
  contrast?: number
}>(), { color: () => [176, 176, 176], brightness: -0.04, contrast: 2.3 })

const root = ref<HTMLElement>()
const canvas = ref<HTMLCanvasElement>()
const glow = ref<HTMLCanvasElement>()
const failed = ref(false)

// 3×3 sub-pixel masks for 5 density levels, like · ░ ▒ ▓ █. The bottom row stays
// empty so the texture reads as lines of characters.
const MASKS = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 1, 0, 0, 0, 0],
  [1, 1, 1, 0, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 0, 0, 0],
]

let cleanup = () => {}

onMounted(async () => {
  const el = canvas.value!
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = props.src.includes('?') ? props.src : `${props.src}?w=256`
  try { await img.decode() } catch { failed.value = true; return }

  const cssW = root.value!.clientWidth || 143
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const cols = Math.round((cssW * dpr) / 3)
  const rows = Math.round(cols * (img.height / img.width))
  el.width = glow.value!.width = cols * 3
  el.height = glow.value!.height = rows * 3

  // Sample the image at one pixel per cell.
  const sample = document.createElement('canvas')
  sample.width = cols
  sample.height = rows
  const sctx = sample.getContext('2d', { willReadFrequently: true })!
  sctx.drawImage(img, 0, 0, cols, rows)
  let pixels: Uint8ClampedArray
  try { pixels = sctx.getImageData(0, 0, cols, rows).data } catch { failed.value = true; return }

  const base = new Int8Array(cols * rows).fill(-1)
  for (let i = 0; i < cols * rows; i++) {
    const a = pixels[i * 4 + 3]! / 255
    if (a < 0.15) continue
    const lum = (0.299 * pixels[i * 4]! + 0.587 * pixels[i * 4 + 1]! + 0.114 * pixels[i * 4 + 2]!) / 255
    const v = (lum - 0.5) * props.contrast + 0.5 + props.brightness
    base[i] = Math.max(0, Math.min(4, Math.round(v * 4)))
  }
  // Each cell gets a reveal threshold: top to bottom with noise.
  const threshold = new Float32Array(cols * rows)
  for (let i = 0; i < threshold.length; i++) threshold[i] = 0.75 * (Math.floor(i / cols) / rows) + 0.25 * Math.random()

  const ctx = el.getContext('2d')!
  const gctx = glow.value!.getContext('2d')!
  const image = ctx.createImageData(el.width, el.height)
  const [r, g, b] = props.color
  const state = { progress: prefersReducedMotion() ? 1 : 0, pointer: null as null | { x: number, y: number } }

  function draw() {
    const data = image.data
    data.fill(0)
    const p = state.progress
    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const i = cy * cols + cx
        let level = base[i]!
        if (level < 0 || threshold[i]! > p) continue
        // Freshly revealed cells and cells near the pointer are scrambled.
        const fresh = p < 1 && threshold[i]! > p - 0.08
        let near = false
        if (state.pointer) {
          const dx = cx - state.pointer.x, dy = cy - state.pointer.y
          near = dx * dx + dy * dy < 42
        }
        if (fresh || near) level = Math.floor(Math.random() * 5)
        else if (Math.random() < 0.035) level = Math.max(0, Math.min(4, level + (Math.random() < 0.5 ? -1 : 1)))
        const mask = MASKS[level]!
        for (let k = 0; k < 9; k++) {
          if (!mask[k]) continue
          const px = cx * 3 + (k % 3), py = cy * 3 + ((k / 3) | 0)
          const o = (py * el.width + px) * 4
          data[o] = r; data[o + 1] = g; data[o + 2] = b; data[o + 3] = 255
        }
      }
    }
    ctx.putImageData(image, 0, 0)
    gctx.clearRect(0, 0, el.width, el.height)
    gctx.drawImage(el, 0, 0)
  }

  draw()
  const intro = prefersReducedMotion() ? null : animate(state, { progress: [0, 1], duration: 1800, delay: 300, ease: 'out(2)', onUpdate: draw })
  // Static flicker, like the original's 140ms interval.
  const flicker = prefersReducedMotion() ? 0 : window.setInterval(() => { if (state.progress >= 1) draw() }, 140)

  const onMove = (e: PointerEvent) => {
    const rect = el.getBoundingClientRect()
    state.pointer = { x: ((e.clientX - rect.left) / rect.width) * cols, y: ((e.clientY - rect.top) / rect.height) * rows }
    draw()
  }
  const onLeave = () => { state.pointer = null }
  root.value!.addEventListener('pointermove', onMove)
  root.value!.addEventListener('pointerleave', onLeave)
  cleanup = () => {
    intro?.pause()
    window.clearInterval(flicker)
    root.value?.removeEventListener('pointermove', onMove)
    root.value?.removeEventListener('pointerleave', onLeave)
  }
})
onBeforeUnmount(() => cleanup())
</script>

<template>
  <div ref="root" class="ascii" role="img" :aria-label="alt || undefined">
    <img v-if="failed" :src="src" alt="" class="ascii__fallback">
    <template v-else>
      <canvas ref="glow" class="ascii__glow" aria-hidden="true" />
      <canvas ref="canvas" class="ascii__canvas" aria-hidden="true" />
    </template>
  </div>
</template>

<style scoped>
.ascii { position: relative; aspect-ratio: 143 / 139; border-radius: 201px; overflow: hidden; }
.ascii canvas, .ascii__fallback { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; }
.ascii__glow { filter: blur(4px); opacity: 0.45; }
.ascii__fallback { image-rendering: pixelated; filter: grayscale(1) brightness(0.8); }
</style>
