// Pushes the slice and custom type models in this repo to Prismic
// (the same thing Slice Machine's "Push" button does).
import fs from 'node:fs'
import path from 'node:path'
import { ROOT } from './lib/build-content.mjs'
import { prismicEnv } from './lib/env.mjs'

const { repositoryName, writeToken } = prismicEnv()
const API = 'https://customtypes.prismic.io'
const headers = { 'repository': repositoryName, 'Authorization': `Bearer ${writeToken}`, 'Content-Type': 'application/json' }

async function upsert(kind, model) {
  const insert = await fetch(`${API}/${kind}/insert`, { method: 'POST', headers, body: JSON.stringify(model) })
  if (insert.ok) return 'created'
  if (insert.status !== 409) throw new Error(`${kind} ${model.id}: ${insert.status} ${await insert.text()}`)
  const update = await fetch(`${API}/${kind}/update`, { method: 'POST', headers, body: JSON.stringify(model) })
  if (!update.ok) throw new Error(`${kind} ${model.id}: ${update.status} ${await update.text()}`)
  return 'updated'
}

const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'))
const slicesDir = path.join(ROOT, 'app/slices')
const typesDir = path.join(ROOT, 'customtypes')

for (const dir of fs.readdirSync(slicesDir)) {
  const file = path.join(slicesDir, dir, 'model.json')
  if (!fs.existsSync(file)) continue
  const model = read(file)
  console.log(`slice ${model.id}: ${await upsert('slices', model)}`)
}
for (const dir of fs.readdirSync(typesDir)) {
  const model = read(path.join(typesDir, dir, 'index.json'))
  console.log(`type ${model.id}: ${await upsert('customtypes', model)}`)
}
console.log(`Models are in "${repositoryName}".`)
