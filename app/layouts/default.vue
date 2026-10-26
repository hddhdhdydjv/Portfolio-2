<script setup lang="ts">
const { data: settings } = await useSettings()
</script>

<template>
  <div class="shell">
    <SiteSidebar :settings="settings" />
    <main class="shell__main">
      <slot />
      <SiteFooter :settings="settings" />
    </main>
  </div>
</template>

<style scoped>
.shell__main {
  margin-left: var(--main-x);
  padding: var(--pad) var(--pad) var(--pad) 0;
  min-height: 100vh;
}
@media (max-width: 809.98px) {
  .shell__main { margin-left: 0; padding: 0 var(--pad) var(--pad); }
}
</style>
