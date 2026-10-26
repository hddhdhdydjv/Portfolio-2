export const LANGS = { en: 'en-us', es: 'es-es' } as const
export type Lang = (typeof LANGS)[keyof typeof LANGS]

export function useLang() {
  const route = useRoute()
  const isEs = computed(() => route.path === '/es' || route.path.startsWith('/es/'))
  const lang = computed<Lang>(() => (isEs.value ? LANGS.es : LANGS.en))
  const prefix = computed(() => (isEs.value ? '/es' : ''))
  /** Same page in the other language. */
  const alternatePath = computed(() => {
    if (isEs.value) return route.path.replace(/^\/es(?=\/|$)/, '') || '/'
    return route.path === '/' ? '/es' : `/es${route.path}`
  })
  const to = (path: string) => `${prefix.value}${path}` || '/'
  return { lang, isEs, prefix, alternatePath, to }
}
