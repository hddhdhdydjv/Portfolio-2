<script setup lang="ts">
import type { PrismicDocument } from '@prismicio/client'
import { animate, scrambleText, stagger } from 'animejs'

const props = defineProps<{ settings: PrismicDocument | null | undefined }>()
const s = computed(() => props.settings?.data ?? {})

const route = useRoute()
const { to, alternatePath, isEs } = useLang()

const tabs = computed(() => [
  { key: 'home', label: s.value.nav_home || 'Home', href: to('/') },
  { key: 'projects', label: s.value.nav_projects || 'Projects', href: to('/projects') },
  { key: 'about', label: s.value.nav_about || 'About', href: to('/about') },
])
const activeKey = computed(() => {
  const path = route.path.replace(/^\/es(?=\/|$)/, '') || '/'
  return path.startsWith('/projects') ? 'projects' : path.startsWith('/about') ? 'about' : 'home'
})
const email = computed(() => (s.value.email ? `mailto:${s.value.email}` : undefined))
const linkedin = computed(() => s.value.linkedin?.url as string | undefined)

// --- Sliding pill behind the active tab ------------------------------------
const nav = ref<HTMLElement>()
const pill = ref<HTMLElement>()
let pillReady = false

function movePill(instant = false) {
  const el = nav.value?.querySelector<HTMLElement>(`[data-tab="${activeKey.value}"]`)
  if (!el || !pill.value) return
  const x = `${el.offsetLeft}px`
  const width = `${el.offsetWidth}px`
  const height = `${el.offsetHeight}px`
  if (instant || !pillReady || prefersReducedMotion()) {
    Object.assign(pill.value.style, { transform: `translateX(${x})`, width, height, opacity: '1' })
    pillReady = true
    return
  }
  animate(pill.value, { x, width, height, duration: 700, ease: 'out(5)' })
}

// --- Pixel scramble on hover -------------------------------------------------
function scramble(e: MouseEvent) {
  if (prefersReducedMotion()) return
  const label = (e.currentTarget as HTMLElement).querySelector<HTMLElement>('[data-scramble]')
  if (!label || label.dataset.busy) return
  label.dataset.busy = '1'
  const text = label.textContent ?? ''
  animate(label, {
    innerHTML: scrambleText({ text, chars: 'blocks', settleDuration: 220, revealRate: 40 }),
    onComplete: () => { label.textContent = text; delete label.dataset.busy },
  })
}

// --- Display heading swap -----------------------------------------------------
const { data: headingData } = await useSidebarHeading()
const heading = ref<string>(headingData.value ?? '')
const headingEl = ref<HTMLElement>()
let swapping: Promise<void> = Promise.resolve()

function swapHeading(next: string) {
  swapping = swapping.then(async () => {
    const el = headingEl.value
    if (!el || next === heading.value) return
    if (prefersReducedMotion()) { heading.value = next; return }
    // Split by rendered lines so the balanced line breaks stay exactly as they are.
    const out = await splitLines(el)
    await animate(out.lines, { y: ['0%', '-105%'], duration: 420, delay: stagger(40), ease: 'in(3)' }).then(() => {})
    out.revert()
    heading.value = next
    await nextTick()
    const inn = await splitLines(el)
    await animate(inn.lines, { y: ['105%', '0%'], duration: 1000, delay: stagger(70), ease: 'out(4)' }).then(() => {})
    inn.revert()
  })
}
watch(headingData, (v) => { if (v) swapHeading(v) })

let navObserver: ResizeObserver | null = null
onMounted(() => {
  movePill(true)
  // Tab widths change once the pixel font loads, and with the viewport.
  navObserver = new ResizeObserver(() => movePill(true))
  if (nav.value) navObserver.observe(nav.value)
  document.fonts.ready.then(() => movePill(true))
  if (prefersReducedMotion() || !headingEl.value) return
  document.fonts.ready.then(async () => {
    const el = headingEl.value!
    const intro = await splitLines(el)
    el.style.opacity = '1'
    animate(intro.lines, { y: ['105%', '0%'], duration: 1200, delay: stagger(90, { start: 150 }), ease: 'out(4)', onComplete: () => intro.revert() })
  })
})
onBeforeUnmount(() => navObserver?.disconnect())
watch(activeKey, () => nextTick(() => movePill()))
watch(tabs, () => nextTick(() => movePill(true)))
</script>

<template>
  <aside class="side">
    <div class="side__top">
      <nav ref="nav" class="side__nav" aria-label="Main">
        <span ref="pill" class="side__pill" aria-hidden="true" />
        <NuxtLink
          v-for="tab in tabs" :key="tab.key" :to="tab.href" :data-tab="tab.key"
          class="side__tab" :aria-current="activeKey === tab.key ? 'page' : undefined"
          @mouseenter="scramble"
        >
          <span data-scramble>{{ tab.label }}</span>
        </NuxtLink>
        <a v-if="email" :href="email" class="side__tab" @mouseenter="scramble">
          <span data-scramble>{{ s.nav_email || 'Email me' }}</span>
        </a>
      </nav>
      <h1 ref="headingEl" class="side__heading t-display" :class="{ 'is-intro': true }">{{ heading }}</h1>
    </div>

    <div class="side__bottom">
      <AsciiPortrait v-if="s.avatar?.url" :src="s.avatar.url" :alt="s.avatar.alt" class="side__portrait" />
      <div class="side__links">
        <a v-if="email" :href="email" class="side__icon" aria-label="Email">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" /><path d="m2 4 6 5 6-5" stroke="currentColor" /></svg>
        </a>
        <a v-if="linkedin" :href="linkedin" target="_blank" rel="noopener" class="side__icon" aria-label="LinkedIn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="1.5" y="1.5" width="13" height="13" rx="1.5" stroke="currentColor" /><path d="M5 7v4.5M5 4.6v.1M7.6 11.5V7m0 2c0-1.2.8-2 1.8-2s1.6.7 1.6 1.9v2.6" stroke="currentColor" stroke-linecap="round" /></svg>
        </a>
        <NuxtLink
          :to="alternatePath" class="side__icon side__lang" :hreflang="isEs ? 'en' : 'es'"
          :aria-label="isEs ? 'View in English' : 'Ver en español'" @mouseenter="scramble"
        >
          <span data-scramble>{{ s.language_switch || (isEs ? 'EN' : 'ES') }}</span>
        </NuxtLink>
      </div>
      <div class="side__id">
        <p class="side__name">{{ s.name }}</p>
        <p class="side__meta">{{ s.role_line }}</p>
        <p class="side__meta">{{ s.experience_line }}</p>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.side {
  position: fixed;
  top: var(--pad);
  left: var(--pad);
  bottom: var(--pad);
  width: var(--side-w);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 10;
}
.side__top { display: grid; gap: 48px; }
.side__nav { position: relative; display: flex; flex-wrap: wrap; gap: 8px; }
.side__pill {
  position: absolute; top: 0; left: 0;
  background: var(--surface); border-radius: 12px;
  opacity: 0; pointer-events: none;
}
.side__tab {
  position: relative;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 1rem;
  line-height: 1.2;
  color: var(--text);
  white-space: nowrap;
  transition: background-color 0.3s var(--ease-out);
}
.side__tab:not([aria-current]):hover { background: rgb(71 71 71 / 0.45); }
.side__lang { width: auto; padding: 0 6px; font-size: 0.85rem; letter-spacing: 0.02em; }
.side__heading { max-width: 328px; }
html.js .side__heading.is-intro { opacity: 0; }
@media (prefers-reduced-motion: reduce) { html.js .side__heading.is-intro { opacity: 1; } }

.side__bottom { display: grid; justify-items: start; }
.side__portrait { width: 143px; }
.side__links { display: flex; gap: 8px; margin-top: 24px; }
.side__icon {
  width: 28px; height: 28px; display: grid; place-items: center;
  border-radius: 8px; color: var(--text-2);
  transition: background-color 0.3s var(--ease-out), color 0.3s;
}
.side__icon:hover { background: var(--surface); color: var(--text); }
.side__id { margin-top: 24px; display: grid; gap: 4px; }
.side__name { font-size: 1.7rem; line-height: 1.1; letter-spacing: -0.02em; color: var(--text); margin-bottom: 4px; }
.side__meta { color: var(--text-2); }

@media (max-width: 809.98px) {
  .side {
    position: relative; inset: auto; width: auto;
    padding: 24px var(--pad) 0;
    gap: 40px;
    margin-bottom: 64px;
  }
  .side__top { gap: 40px; }
  .side__heading { max-width: 328px; }
}
</style>
