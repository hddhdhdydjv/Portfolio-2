// Small interface labels that don't live in Prismic.
const strings = {
  'en-us': { role: 'Role', problem: 'Problem', results: 'Results', next: 'Next project', view: 'View case', notFound: 'This page doesn’t exist.', backHome: 'Back home' },
  'es-es': { role: 'Rol', problem: 'Problema', results: 'Resultados', next: 'Siguiente proyecto', view: 'Ver caso', notFound: 'Esta página no existe.', backHome: 'Volver al inicio' },
} as const

export function useUi() {
  const { lang } = useLang()
  return computed(() => strings[lang.value])
}
