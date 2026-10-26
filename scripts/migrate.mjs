// Uploads the seed content (/content) to Prismic with the Migration API:
// every image goes to the media library and every page/case is created in
// English and Spanish. Documents land in a "Migration" release as drafts so
// you can review and publish them from the Prismic dashboard.
import fs from 'node:fs'
import path from 'node:path'
import * as prismic from '@prismicio/client'
import { buildDocuments, IMAGES_DIR } from './lib/build-content.mjs'
import { prismicEnv } from './lib/env.mjs'

const { repositoryName, writeToken } = prismicEnv()
const writeClient = prismic.createWriteClient(repositoryName, { writeToken })

const dryRun = process.argv.includes('--dry-run')

// Re-running would duplicate documents, so stop if content already exists.
const existing = dryRun ? 0 : await writeClient.get({ pageSize: 1 }).then((r) => r.total_results_size).catch(() => 0)
if (existing && !process.argv.includes('--force')) {
  console.error(`"${repositoryName}" already has published documents. Run with --force to migrate anyway.`)
  process.exit(1)
}

const migration = prismic.createMigration()
const assets = new Map()
const asset = (ref) => {
  if (!ref?.file) return undefined
  if (!assets.has(ref.file)) {
    const file = fs.readFileSync(path.join(IMAGES_DIR, ref.file))
    const filename = ref.file.replaceAll('/', '-')
    assets.set(ref.file, migration.createAsset(file, filename, { alt: ref.alt ?? undefined }))
  }
  return assets.get(ref.file)
}

const masters = new Map()
for (const d of buildDocuments(asset)) {
  const key = `${d.type}:${d.uid ?? ''}`
  const doc = { type: d.type, lang: d.lang, data: d.data, ...(d.uid ? { uid: d.uid } : {}) }
  const master = d.lang === 'en-us' ? undefined : masters.get(key)
  const title = d.lang === 'en-us' ? d.title : `${d.title} (ES)`
  const created = migration.createDocument(doc, title, master ? { masterLanguageDocument: master } : undefined)
  if (d.lang === 'en-us') masters.set(key, created)
}

if (dryRun) {
  console.log(`Dry run: ${migration._documents.length} documents and ${assets.size} images ready to migrate.`)
  process.exit(0)
}

await writeClient.migrate(migration, {
  reporter: (event) => {
    if (event.type === 'assets:creating') console.log(`asset ${event.data.current}/${event.data.total}`)
    else if (event.type === 'documents:creating') console.log(`document ${event.data.current}/${event.data.total}: ${event.data.document.title}`)
    else if (event.type === 'end') console.log(`Done: ${event.data.migrated.documents} documents, ${event.data.migrated.assets} images.`)
  },
})
console.log('Open Prismic → Releases → "Migration release" to review and publish.')
