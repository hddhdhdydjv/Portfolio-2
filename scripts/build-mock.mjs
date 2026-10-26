// Builds content/.mock/documents.json so the site can run without Prismic
// (`npm run dev:mock`). Images are served from content/images.
import fs from 'node:fs'
import path from 'node:path'
import { imageSize } from 'image-size'
import { buildDocuments, CONTENT_DIR, IMAGES_DIR } from './lib/build-content.mjs'

const asset = (ref) => {
  if (!ref?.file) return {}
  const { width, height } = imageSize(fs.readFileSync(path.join(IMAGES_DIR, ref.file)))
  return {
    id: ref.file, url: `/_content/images/${ref.file}`, alt: ref.alt, copyright: null,
    dimensions: { width, height }, edit: { x: 0, y: 0, zoom: 1, background: 'transparent' },
  }
}

const docs = buildDocuments(asset).map((d, i) => ({
  id: `mock-${d.type}-${d.uid ?? 'single'}-${d.lang}`,
  uid: d.uid ?? null, type: d.type, lang: d.lang, url: null, tags: [],
  first_publication_date: '2026-01-01T00:00:00+0000', last_publication_date: '2026-01-01T00:00:00+0000',
  alternate_languages: [], data: d.data,
}))
for (const d of docs) {
  d.alternate_languages = docs
    .filter((o) => o.type === d.type && o.uid === d.uid && o.lang !== d.lang)
    .map((o) => ({ id: o.id, uid: o.uid, type: o.type, lang: o.lang }))
  d.data.slices?.forEach((s, i) => { s.id = `${s.slice_type}$${d.id}-${i}`; s.slice_label = null })
}
const out = path.join(CONTENT_DIR, '.mock')
fs.mkdirSync(out, { recursive: true })
fs.writeFileSync(path.join(out, 'documents.json'), JSON.stringify(docs))
console.log(`${docs.length} mock documents → content/.mock/documents.json`)
