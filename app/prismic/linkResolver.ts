import type { LinkResolverFunction } from '@prismicio/client'

const paths: Record<string, (uid?: string) => string> = {
  home: () => '/',
  projects_page: () => '/projects',
  about: () => '/about',
  case_study: (uid) => `/projects/${uid}`,
}

const linkResolver: LinkResolverFunction = (doc) => {
  const path = paths[doc.type]?.(doc.uid ?? undefined)
  if (!path) return null
  const prefix = doc.lang?.startsWith('es') ? '/es' : ''
  return prefix + (path === '/' && prefix ? '' : path)
}

export default linkResolver
