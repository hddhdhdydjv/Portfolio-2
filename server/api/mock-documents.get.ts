import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

// Serves content/.mock/documents.json for `npm run dev:mock` (built by `npm run seed:mock`).
// Image URLs are made absolute because Prismic's image helpers expect full URLs.
export default defineEventHandler(async () => {
  if (useRuntimeConfig().public.contentSource !== 'mock') throw createError({ statusCode: 404 })
  const origin = process.env.MOCK_ORIGIN || `http://localhost:${process.env.PORT || process.env.NUXT_PORT || 3000}`
  const json = await readFile(resolve(process.cwd(), 'content/.mock/documents.json'), 'utf8')
  return JSON.parse(json.replaceAll('"/_content/', `"${origin}/_content/`))
})
