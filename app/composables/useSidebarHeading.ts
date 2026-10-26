/** The big display heading in the sidebar changes with the page. */
export function useSidebarHeading() {
  const route = useRoute()
  const source = useContentSource()
  const { lang } = useLang()
  return useAsyncData(
    () => `sidebar-heading:${route.path}`,
    async () => {
      const path = route.path.replace(/^\/es(?=\/|$)/, '') || '/'
      const caseMatch = path.match(/^\/projects\/([^/]+)/)
      if (caseMatch) {
        const doc = await source.caseStudy(caseMatch[1]!, lang.value)
        return (doc?.data.sidebar_heading as string) || (lang.value === 'es-es' ? 'Una de esas cosas digitales' : 'One of those digital things')
      }
      const type = path.startsWith('/projects') ? 'projects_page' : path.startsWith('/about') ? 'about' : 'home'
      const doc = await source.single(type, lang.value)
      return (doc?.data.heading as string) ?? ''
    },
  )
}
