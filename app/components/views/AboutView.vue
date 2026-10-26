<script setup lang="ts">
import { components } from '~/slices'

const source = useContentSource()
const { data: about } = await useContent('about', (lang) => source.single('about', lang))
const a = computed(() => about.value?.data ?? {})

useSeoMeta({
  title: () => a.value.meta_title,
  description: () => a.value.meta_description,
  ogTitle: () => a.value.meta_title,
  ogDescription: () => a.value.meta_description,
})
</script>

<template>
  <div class="about">
    <RichText v-reveal="'up'" :field="a.intro" class="about__text" />
    <PolaroidMarquee v-if="a.polaroids?.length" v-reveal="'fade'" :items="a.polaroids" class="about__polaroids" />
    <RichText v-reveal="'up'" :field="a.outro" class="about__text" />
    <PrismicLink v-if="a.resume_link?.url" v-reveal="'up'" :field="a.resume_link" class="about__resume">
      {{ a.resume_label }}
    </PrismicLink>
    <SliceZone v-if="a.slices?.length" :slices="a.slices" :components="components" />
  </div>
</template>

<style scoped>
.about__text { font-size: 1.2rem; line-height: 1.2; display: grid; gap: 1.25em; }
.about__text :deep(strong) { font-weight: 700; }
.about__polaroids { margin: 40px 0 28px; }
.about__resume {
  display: inline-block; margin-top: 48px; padding: 4px 16px; border-radius: 55px;
  background: var(--light); color: var(--ink);
  transition: transform 0.5s var(--ease-out);
}
.about__resume:hover { transform: translateY(-2px) rotate(-2deg) scale(1.04); }
</style>
