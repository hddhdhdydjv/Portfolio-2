// Serves the seed documents for mock mode (`npm run dev:mock`, or a build with
// NUXT_PUBLIC_CONTENT_SOURCE=mock). They're bundled as Nitro server assets from
// content/.mock, built by `npm run seed:mock`. Image URLs are made absolute
// because Prismic's image helpers expect full URLs.
export default defineEventHandler(async () => {
  if (useRuntimeConfig().public.contentSource !== 'mock') throw createError({ statusCode: 404 })
  const json = await useStorage('assets:mock').getItem<string | object>('documents.json')
  if (!json) throw createError({ statusCode: 500, statusMessage: 'Run `npm run seed:mock` first' })
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  const origin = process.env.MOCK_ORIGIN || (host ? `https://${host}` : `http://localhost:${process.env.PORT || process.env.NUXT_PORT || 3000}`)
  const text = typeof json === 'string' ? json : JSON.stringify(json)
  return JSON.parse(text.replaceAll('"/_content/', `"${origin}/_content/`))
})
