<script setup lang="ts">
import { animate, stagger } from 'animejs'

const props = defineProps<{
  links: Array<{ key: string, label: string, href: string, external?: boolean }>
  socials: Array<{ platform: string, label: string, url: string }>
  langHref: string
  langLabel: string
}>()

const ui = useUi()
const open = ref(false)
const panel = ref<HTMLElement>()
const route = useRoute()
const { $lenis } = useNuxtApp()
let busy = false

async function toggle(next = !open.value) {
  if (busy || next === open.value) return
  busy = true
  if (next) {
    open.value = true
    $lenis?.stop()
    await nextTick()
    if (!prefersReducedMotion() && panel.value) {
      animate(panel.value, { clipPath: ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)'], duration: 700, ease: 'out(4)' })
      await animate(panel.value.querySelectorAll('.roll__face:not(.roll__face--copy)'), {
        y: ['110%', '0%'], duration: 750, delay: stagger(8, { start: 160 }), ease: 'out(4)',
      }).then(() => {})
    }
  } else {
    if (!prefersReducedMotion() && panel.value) {
      await animate(panel.value, { clipPath: ['inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)'], duration: 500, ease: 'in(3)' }).then(() => {})
    }
    open.value = false
    $lenis?.start()
  }
  busy = false
}

watch(() => route.fullPath, () => { if (open.value) toggle(false) })
const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') toggle(false) }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => { window.removeEventListener('keydown', onKey); $lenis?.start() })
</script>

<template>
  <Teleport to="#teleports">
    <button class="mm__toggle roll-trigger" :aria-expanded="open" aria-controls="mobile-menu" @click="toggle()">
      <RollText :text="open ? ui.close : ui.menu" />
    </button>
    <div v-if="open" id="mobile-menu" ref="panel" class="mm" role="dialog" aria-modal="true">
      <nav class="mm__links">
        <template v-for="link in props.links" :key="link.key">
          <a v-if="link.external" :href="link.href" class="mm__link roll-trigger"><RollText :text="link.label" /></a>
          <NuxtLink v-else :to="link.href" class="mm__link roll-trigger"><RollText :text="link.label" /></NuxtLink>
        </template>
      </nav>
      <div class="mm__foot">
        <a v-for="s in props.socials" :key="s.url" :href="s.url" target="_blank" rel="noopener" class="roll-trigger">
          <RollText :text="s.label" />
        </a>
        <NuxtLink :to="props.langHref" class="mm__lang roll-trigger"><RollText :text="props.langLabel" /></NuxtLink>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.mm__toggle {
  display: none;
  position: fixed; top: 16px; right: 16px; z-index: 95;
  padding: 6px 12px; border-radius: 12px;
  background: rgb(71 71 71 / 0.7); backdrop-filter: blur(12px);
  color: var(--text); font-size: 1.2rem;
}
@media (max-width: 809.98px) { .mm__toggle { display: block; } }
.mm {
  position: fixed; inset: 0; z-index: 90;
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 88px 16px 32px; background: var(--bg);
}
.mm__links { display: grid; gap: 4px; }
.mm__link { font-family: var(--font-display); font-size: 4.6rem; line-height: 1.05; letter-spacing: -0.01em; color: var(--text); }
.mm__link.router-link-exact-active { color: var(--muted); }
.mm__foot { display: flex; flex-wrap: wrap; gap: 16px; font-size: 1.2rem; color: var(--text-2); }
.mm__lang { margin-left: auto; color: var(--muted); }
</style>
