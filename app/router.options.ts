import type { RouterConfig } from '@nuxt/schema'

// Scrolling is handled by the page transition (app.vue) so it happens while the page is hidden.
export const savedScroll = { top: 0 }

export default <RouterConfig>{
  scrollBehavior(_to, _from, savedPosition) {
    savedScroll.top = savedPosition?.top ?? 0
    return false
  },
}
