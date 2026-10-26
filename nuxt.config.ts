import { fileURLToPath } from 'node:url'
import { repositoryName } from './slicemachine.config.json'

// `npm run dev:mock` serves the seed content in /content instead of Prismic.
const contentSource = process.env.NUXT_PUBLIC_CONTENT_SOURCE === 'mock' ? 'mock' : 'prismic'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/prismic'],
  css: ['~/assets/css/main.css'],

  prismic: {
    endpoint: process.env.NUXT_PUBLIC_PRISMIC_REPOSITORY || repositoryName,
    linkResolver: '~/prismic/linkResolver',
    preview: '/preview',
    toolbar: contentSource === 'prismic',
  },

  runtimeConfig: {
    public: { contentSource },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#1c1c1c' },
      ],
      link: [
        { rel: 'preload', href: '/fonts/pp-mondwest-regular.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
        { rel: 'preload', href: '/fonts/geist-pixel.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
      ],
      // Marks JS as available so reveal states only hide content when animations can run.
      script: [{ innerHTML: "document.documentElement.classList.add('js')", tagPosition: 'head' }],
    },
  },

  nitro: {
    publicAssets: contentSource === 'mock'
      ? [{ dir: fileURLToPath(new URL('./content/images', import.meta.url)), baseURL: '/_content/images', maxAge: 0 }]
      : [],
  },

  // On Vercel, pages are cached and refreshed in the background every minute,
  // so publishing in Prismic shows up on the site without a redeploy.
  routeRules: {
    '/**': { isr: 60 },
    '/preview': { isr: false },
    '/slice-simulator': { isr: false },
  },

  vite: {
    optimizeDeps: { include: ['animejs', 'lenis', '@slicemachine/adapter-nuxt/simulator'] },
  },

  typescript: { strict: true },
})
