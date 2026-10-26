<script setup lang="ts">
const source = useContentSource()
const { to } = useLang()
const { data: page } = await useContent('projects_page', (lang) => source.single('projects_page', lang))
const { data: cases } = await useContent('cases', (lang) => source.caseStudies(lang))
const p = computed(() => page.value?.data ?? {})

useSeoMeta({
  title: () => p.value.meta_title,
  description: () => p.value.meta_description,
  ogTitle: () => p.value.meta_title,
  ogDescription: () => p.value.meta_description,
})
</script>

<template>
  <div class="cards">
    <ProjectCard
      v-for="c in cases" :key="c.id" :title="c.data.title" :image="c.data.thumbnail"
      :href="to(`/projects/${c.uid}`)"
    />
  </div>
</template>

<style scoped>
.cards { display: grid; gap: 12px; }
</style>
