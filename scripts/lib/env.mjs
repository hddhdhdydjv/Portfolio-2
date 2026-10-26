import fs from 'node:fs'
import path from 'node:path'
import { ROOT } from './build-content.mjs'

// Loads .env without a dependency, then reads the Prismic settings the scripts need.
export function prismicEnv() {
  const envFile = path.join(ROOT, '.env')
  if (fs.existsSync(envFile)) {
    for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/)
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
  const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'slicemachine.config.json'), 'utf8'))
  const repositoryName = process.env.NUXT_PUBLIC_PRISMIC_REPOSITORY || config.repositoryName
  const writeToken = process.env.PRISMIC_WRITE_TOKEN
  if (!writeToken) {
    console.error('Missing PRISMIC_WRITE_TOKEN. Create one in Prismic → Settings → API & Security → Write APIs.')
    process.exit(1)
  }
  return { repositoryName, writeToken }
}
