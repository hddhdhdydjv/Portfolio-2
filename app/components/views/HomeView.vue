<script setup lang="ts">
import type { PrismicDocument } from '@prismicio/client'

const source = useContentSource()
const { to } = useLang()
const { data: home } = await useContent('home', (lang) => source.single('home', lang))
const { data: cases } = await useContent('cases', (lang) => source.caseStudies(lang))
const featured = computed(() => (cases.value ?? []).filter((c: PrismicDocument) => c.data.featured !== false))
const h = computed(() => home.value?.data ?? {})

useSeoMeta({
  title: () => h.value.meta_title,
  description: () => h.value.meta_description,
  ogTitle: () => h.value.meta_title,
  ogDescription: () => h.value.meta_description,
  ogImage: () => h.value.meta_image?.url,
})
</script>

<template>
  <div class="home">
    <section class="block">
      <h2 v-reveal="'up'" class="t-section">{{ h.featured_heading }}</h2>
      <div class="cards">
        <ProjectCard
          v-for="c in featured" :key="c.id" :title="c.data.title" :image="c.data.thumbnail"
          :href="to(`/projects/${c.uid}`)"
        />
      </div>
      <NuxtLink v-reveal="'up'" :to="to('/projects')" class="btn-light">{{ h.see_all_label }}</NuxtLink>
    </section>

    <section class="block">
      <h2 v-reveal="'up'" class="t-section">{{ h.skills_heading }}</h2>
      <ul v-reveal="'stagger'" class="chips">
        <li v-for="(skill, i) in h.skills" :key="i" class="chip">{{ skill.label }}</li>
      </ul>
    </section>

    <section class="block">
      <h2 v-reveal="'up'" class="t-section">{{ h.stack_heading }}</h2>
      <ul v-reveal="'stagger'" class="chips chips--stack">
        <li v-for="(tool, i) in h.stack" :key="i">
          <PrismicLink :field="tool.link" class="chip chip--tool">
            <PrismicImage :field="tool.icon" :imgix-params="{ w: 40, h: 40, fit: 'crop' }" class="chip__icon" />
            <span>{{ tool.name }}</span>
          </PrismicLink>
        </li>
      </ul>
    </section>

    <section class="block">
      <h2 v-reveal="'up'" class="t-section">{{ h.experience_heading }}</h2>
      <ol class="exp">
        <li v-for="(job, i) in h.experience" :key="i" v-reveal="'up'" class="exp__item">
          <span v-if="Number(i) > 0" class="exp__line" aria-hidden="true" />
          <p class="t-lead">{{ job.role }}</p>
          <p class="t-label">{{ job.period }}</p>
          <RichText :field="job.description" class="exp__desc" />
          <p class="exp__company">{{ job.company }}</p>
          <p class="t-label">{{ job.location }}</p>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.block + .block { margin-top: 96px; }
.block > .t-section { margin-bottom: 24px; }
.cards { display: grid; gap: 12px; }
.btn-light {
  display: block; margin-top: 12px; padding: 15px 20px;
  border-radius: 10px; background: var(--light); color: var(--ink); text-align: center;
  transition: background-color 0.3s var(--ease-out), letter-spacing 0.5s var(--ease-out);
}
.btn-light:hover { background: #fff; letter-spacing: 0.04em; }
.chips { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; }
.chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 8px; border-radius: 8px; background: var(--surface); color: var(--text-2);
}
.chip--tool {
  padding: 6px 8px 6px 6px; color: var(--text);
  transition: background-color 0.3s var(--ease-out), transform 0.4s var(--ease-out);
}
.chip--tool:hover { background: #5a5a5a; transform: translateY(-2px); }
.chip__icon { width: 20px; height: 20px; border-radius: 4px; object-fit: cover; }
.exp { list-style: none; }
.exp__item { position: relative; display: grid; gap: 4px; }
.exp__item + .exp__item { margin-top: 48px; padding-top: 48px; }
.exp__line {
  position: absolute; top: 0; left: 0; right: 0; height: 1px; background: var(--line);
  transform-origin: left; animation: draw 1.4s var(--ease-out) both; animation-play-state: paused;
}
.exp__item[data-revealed] .exp__line { animation-play-state: running; }
@keyframes draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.exp__desc { margin: 12px 0; color: var(--text); }
.exp__company { margin-top: 4px; }
</style>
