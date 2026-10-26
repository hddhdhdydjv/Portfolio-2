import type { PrismicDocument } from '@prismicio/client'
import type { Lang } from './useLang'

const FALLBACK: Lang = 'en-us'
let mockDocs: Promise<PrismicDocument[]> | null = null

/**
 * Reads content from Prismic, or from the local seed when running `npm run dev:mock`.
 * Spanish falls back to English for anything not translated yet.
 */
export function useContentSource() {
  const { contentSource } = useRuntimeConfig().public
  const client = contentSource === 'prismic' ? usePrismic().client : null
  const all = () => (mockDocs ??= $fetch<PrismicDocument[]>('/api/mock-documents'))

  async function single<T = PrismicDocument>(type: string, lang: Lang): Promise<T | null> {
    if (!client) {
      const docs = await all()
      return (docs.find((d) => d.type === type && d.lang === lang) ?? docs.find((d) => d.type === type && d.lang === FALLBACK) ?? null) as T | null
    }
    const get = (l: Lang) => client.getSingle(type as never, { lang: l }).catch(() => null)
    return ((await get(lang)) ?? (lang !== FALLBACK ? await get(FALLBACK) : null)) as T | null
  }

  async function caseStudy<T = PrismicDocument>(uid: string, lang: Lang): Promise<T | null> {
    if (!client) {
      const docs = await all()
      const match = (l: Lang) => docs.find((d) => d.type === 'case_study' && d.uid === uid && d.lang === l)
      return (match(lang) ?? match(FALLBACK) ?? null) as T | null
    }
    const get = (l: Lang) => client.getByUID('case_study' as never, uid, { lang: l }).catch(() => null)
    return ((await get(lang)) ?? (lang !== FALLBACK ? await get(FALLBACK) : null)) as T | null
  }

  async function caseStudies<T = PrismicDocument>(lang: Lang): Promise<T[]> {
    const sort = (docs: PrismicDocument[]) => docs.sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
    if (!client) {
      const docs = await all()
      const pick = (l: Lang) => docs.filter((d) => d.type === 'case_study' && d.lang === l)
      const list = pick(lang)
      return sort(list.length ? list : pick(FALLBACK)) as T[]
    }
    const get = (l: Lang) => client.getAllByType('case_study' as never, { lang: l }).catch(() => [])
    const list = await get(lang)
    return sort(list.length ? list : await get(FALLBACK)) as T[]
  }

  return { single, caseStudy, caseStudies }
}

/** Keyed, language-aware `useAsyncData`. */
export function useContent<T>(name: string, fetcher: (lang: Lang) => Promise<T>) {
  const { lang } = useLang()
  return useAsyncData(() => `${name}:${lang.value}`, () => fetcher(lang.value))
}

/** Site-wide settings document, shared by the layout. */
export function useSettings() {
  const source = useContentSource()
  return useContent('settings', (lang) => source.single('settings', lang))
}
