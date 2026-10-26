<script setup lang="ts">
import type { PrismicDocument } from '@prismicio/client'
import { isFilled } from '@prismicio/client'
import { components } from '~/slices'

const route = useRoute()
const source = useContentSource()
const { to } = useLang()
const ui = useUi()
const uid = computed(() => String(route.params.uid))

const { data: doc } = await useContent(`case:${uid.value}`, (lang) => source.caseStudy(uid.value, lang))
if (!doc.value) throw createError({ statusCode: 404, statusMessage: 'Case study not found', fatal: true })
const { data: cases } = await useContent('cases', (lang) => source.caseStudies(lang))

const d = computed(() => doc.value!.data)
const next = computed<PrismicDocument | undefined>(() => {
  const list = cases.value ?? []
  if (list.length < 2) return undefined
  const i = list.findIndex((c: PrismicDocument) => c.uid === uid.value)
  return list[(i + 1) % list.length]
})

useSeoMeta({
  title: () => d.value.meta_title || d.value.title,
  description: () => d.value.meta_description,
  ogTitle: () => d.value.meta_title || d.value.title,
  ogDescription: () => d.value.meta_description,
  ogImage: () => d.value.meta_image?.url || d.value.cover?.url,
})
</script>

<template>
  <article class="case">
    <header class="case__head">
      <h2 v-reveal="'chars'" class="t-title case__title">{{ d.title }}</h2>
      <RichText v-reveal="{ type: 'up', delay: 150 }" :field="d.summary" class="t-lead case__summary" />
    </header>

    <figure v-if="isFilled.image(d.cover)" v-reveal="'image'" class="case__cover">
      <PrismicImage :field="d.cover" :widths="[640, 960, 1280, 1800]" sizes="(max-width: 809px) 100vw, 62vw" />
    </figure>

    <dl class="case__facts">
      <div v-if="d.role" v-reveal="'up'">
        <dt class="t-label">{{ ui.role.toUpperCase() }}</dt>
        <dd class="t-lead">{{ d.role }}</dd>
      </div>
      <div v-if="isFilled.richText(d.problem)" v-reveal="'up'">
        <dt class="t-label">{{ ui.problem.toUpperCase() }}</dt>
        <dd><RichText :field="d.problem" class="t-lead" /></dd>
      </div>
      <div v-if="d.results?.length" v-reveal="'up'">
        <dt class="t-label">{{ ui.results.toUpperCase() }}</dt>
        <dd>
          <ul v-reveal="'stagger'" class="case__results">
            <li v-for="(r, i) in d.results" :key="i" class="t-lead">{{ r.item }}</li>
          </ul>
        </dd>
      </div>
    </dl>

    <SliceZone :slices="d.slices" :components="components" />

    <NuxtLink v-if="next" v-reveal="'up'" :to="to(`/projects/${next.uid}`)" class="case__next">
      <span class="t-label">{{ ui.next }}</span>
      <span class="t-title case__next-title">{{ next.data.title }}
        <svg width="28" height="28" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 10 10 2M4 2h6v6" stroke="currentColor" fill="none" stroke-width="1.2" /></svg>
      </span>
    </NuxtLink>
  </article>
</template>

<style scoped>
.case__title { color: var(--text); }
.case__summary { margin-top: 24px; }
.case__cover { margin-top: 64px; border-radius: var(--radius); overflow: hidden; aspect-ratio: 892 / 558; background: var(--surface); }
.case__cover :deep(img) { width: 100%; height: 100%; object-fit: cover; }
.case__facts { margin: 64px 0 0; display: grid; gap: 32px; }
.case__facts dd { margin: 8px 0 0; }
.case__results { list-style: none; display: grid; gap: 8px; }
.case__next {
  display: grid; gap: 8px; margin-top: 128px; padding-top: 32px;
  border-top: 1px solid var(--line);
}
.case__next-title { display: inline-flex; align-items: center; gap: 16px; color: var(--text); }
.case__next-title svg { transition: transform 0.6s var(--ease-out); }
.case__next:hover .case__next-title svg { transform: translate(6px, -6px); }
</style>
