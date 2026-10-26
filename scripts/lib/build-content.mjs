// Turns the seed content in /content (Markdown cases + site JSON) into
// Prismic-shaped documents. Used by both the local mock and the migration.
import fs from 'node:fs'
import path from 'node:path'
import { Lexer } from 'marked'

export const ROOT = path.resolve(import.meta.dirname, '../..')
export const CONTENT_DIR = path.join(ROOT, 'content')
export const IMAGES_DIR = path.join(CONTENT_DIR, 'images')
export const LOCALES = { en: 'en-us', es: 'es-es' }

let keySeed = 0
const key = () => `k${(++keySeed).toString(36)}${Math.random().toString(36).slice(2, 8)}`

// ---------------------------------------------------------------------------
// Frontmatter: a small YAML subset (scalars and lists of scalars).

function parseFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) return { data: {}, body: source }
  const data = {}
  let listKey = null
  for (const line of match[1].split('\n')) {
    const item = line.match(/^\s+-\s+(.*)$/)
    if (item && listKey) {
      data[listKey].push(item[1].trim())
      continue
    }
    const pair = line.match(/^([a-z_]+):\s*(.*)$/)
    if (!pair) continue
    const [, k, v] = pair
    if (v === '') {
      data[k] = []
      listKey = k
    } else {
      listKey = null
      data[k] = v === 'true' ? true : v === 'false' ? false : /^-?\d+(\.\d+)?$/.test(v) ? Number(v) : v
    }
  }
  return { data, body: source.slice(match[0].length) }
}

// "path/to.webp | Alt text"
function parseImageRef(ref) {
  if (!ref) return null
  const [file, ...alt] = String(ref).split('|')
  return { file: file.trim(), alt: alt.join('|').trim() || null }
}

// ---------------------------------------------------------------------------
// Inline markdown → Prismic { text, spans }

function inlineToRich(tokens) {
  let text = ''
  const spans = []
  const walk = (list, marks) => {
    for (const t of list) {
      if (t.type === 'strong' || t.type === 'em') {
        const start = text.length
        walk(t.tokens, marks)
        spans.push({ type: t.type, start, end: text.length })
      } else if (t.type === 'link') {
        const start = text.length
        walk(t.tokens, marks)
        spans.push({ type: 'hyperlink', start, end: text.length, data: { link_type: 'Web', url: t.href, target: '_blank' } })
      } else if (t.type === 'br') {
        text += '\n'
      } else if (t.tokens) {
        walk(t.tokens, marks)
      } else {
        text += decode(t.text ?? t.raw ?? '')
      }
    }
  }
  walk(tokens, [])
  return { text, spans: spans.sort((a, b) => a.start - b.start) }
}

function decode(s) {
  return s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}

export function richFromMarkdown(md) {
  const blocks = []
  for (const t of new Lexer().lex(md)) appendRichBlock(blocks, t)
  return blocks
}

function appendRichBlock(blocks, t) {
  if (t.type === 'paragraph') blocks.push({ type: 'paragraph', ...inlineToRich(t.tokens) })
  else if (t.type === 'heading') blocks.push({ type: `heading${Math.min(Math.max(t.depth, 3), 6)}`, ...inlineToRich(t.tokens) })
  else if (t.type === 'list') {
    for (const item of t.items) {
      const inner = item.tokens.flatMap((x) => (x.type === 'text' && x.tokens ? x.tokens : x.tokens ?? [x]))
      blocks.push({ type: t.ordered ? 'o-list-item' : 'list-item', ...inlineToRich(inner) })
    }
  }
}

function cellRich(cell) {
  const rich = inlineToRich(cell.tokens)
  return rich.text.trim() ? [{ type: 'paragraph', ...rich }] : []
}

function tableField(t) {
  return {
    head: { rows: [{ key: key(), cells: t.header.map((c) => ({ key: key(), type: 'header', content: cellRich(c) })) }] },
    body: { rows: t.rows.map((row) => ({ key: key(), cells: row.map((c) => ({ key: key(), type: 'data', content: cellRich(c) })) })) },
  }
}

// ---------------------------------------------------------------------------
// Case study Markdown → document data

function slice(type, primary) {
  return { slice_type: type, variation: 'default', version: 'initial', primary, items: [] }
}

function parseCase(source, asset) {
  const { data: fm, body } = parseFrontmatter(source)

  // Pull "::images" / "::ticker" directive blocks out before lexing.
  const directives = []
  const lines = body.split('\n')
  const out = []
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^::(images|ticker)\s*$/)
    if (!m) { out.push(lines[i]); continue }
    const block = []
    while (i + 1 < lines.length && lines[i + 1].trim() !== '') block.push(lines[++i])
    directives.push({ kind: m[1], lines: block })
    out.push(`<!--directive:${directives.length - 1}-->`)
  }

  const summary = []
  const slices = []
  let section = null
  const flush = () => {
    if (section && (section.heading || section.body.length)) slices.push(slice('text_section', { heading: section.heading, body: section.body }))
    section = null
  }
  const ensureSection = () => (section ??= { heading: null, body: [] })

  for (const t of new Lexer().lex(out.join('\n'))) {
    if (t.type === 'space' || t.type === 'hr') continue
    if (t.type === 'heading' && t.depth === 2) { flush(); section = { heading: t.text, body: [] }; continue }
    if (t.type === 'html') {
      const m = t.raw.match(/directive:(\d+)/)
      if (!m) continue
      flush()
      const d = directives[Number(m[1])]
      if (d.kind === 'images') {
        slices.push(slice('image_stack', { images: d.lines.map((l) => ({ image: asset(parseImageRef(l.replace(/^-\s*/, ''))) })) }))
      } else {
        const col = (name) => (d.lines.find((l) => l.startsWith(name + ':')) ?? '').split(':')[1].split(',').map((s) => s.trim()).filter(Boolean)
        slices.push(slice('image_ticker', {
          left_images: col('left').map((f) => ({ image: asset({ file: f, alt: null }) })),
          right_images: col('right').map((f) => ({ image: asset({ file: f, alt: null }) })),
        }))
      }
      continue
    }
    if (t.type === 'table') { flush(); slices.push(slice('table_block', { heading: null, table: tableField(t) })); continue }
    if (t.type === 'blockquote') {
      flush()
      const quote = []
      for (const inner of t.tokens) appendRichBlock(quote, inner)
      slices.push(slice('quote', { quote }))
      continue
    }
    if (!section && slices.length === 0 && t.type === 'paragraph') { appendRichBlock(summary, t); continue }
    appendRichBlock(ensureSection().body, t)
  }
  flush()

  const cover = parseImageRef(fm.cover)
  const thumbnail = parseImageRef(fm.thumbnail)
  return {
    uid: fm.uid,
    title: fm.title,
    data: {
      title: fm.title,
      summary,
      cover: asset(cover),
      thumbnail: asset(thumbnail),
      role: fm.role ?? null,
      problem: fm.problem ? richFromMarkdown(fm.problem) : [],
      results: (fm.results ?? []).map((item) => ({ item })),
      featured: fm.featured ?? true,
      order: fm.order ?? 99,
      sidebar_heading: fm.sidebar_heading ?? null,
      slices,
      meta_title: `${fm.title} — Alejandro Arab`,
      meta_description: fm.meta_description ?? null,
      meta_image: asset(cover),
    },
  }
}

// ---------------------------------------------------------------------------
// Site JSON → singleton documents

const web = (url) => (url ? { link_type: 'Web', url, ...(url.startsWith('mailto:') ? {} : { target: '_blank' }) } : { link_type: 'Any' })
const paragraphs = (list) => (list ?? []).flatMap((p) => richFromMarkdown(p))

function deepDefaults(target, fallback) {
  for (const [k, v] of Object.entries(fallback)) {
    if (!(k in target)) target[k] = v
    else if (v && typeof v === 'object' && !Array.isArray(v)) deepDefaults(target[k], v)
  }
  return target
}

function buildSite(site, asset) {
  const { settings: s, home: h, projects: p, about: a } = site
  return [
    { type: 'settings', title: 'Settings', data: {
      site_title: s.site_title, site_description: s.site_description, name: s.name, role_line: s.role_line,
      experience_line: s.experience_line, avatar: asset(parseImageRef(s.avatar)), email: s.email, linkedin: web(s.linkedin),
      nav_home: s.nav_home, nav_projects: s.nav_projects, nav_about: s.nav_about, nav_email: s.nav_email,
      language_switch: s.language_switch, footer_heading: s.footer_heading, footer_cta: s.footer_cta,
      footer_cat: asset(parseImageRef(s.footer_cat)),
      social_links: (s.social_links ?? []).map((x) => ({ platform: x.platform, label: x.label, link: web(x.url) })),
    } },
    { type: 'home', title: 'Home', data: {
      heading: h.heading, featured_heading: h.featured_heading, see_all_label: h.see_all_label,
      skills_heading: h.skills_heading, skills: h.skills.map((label) => ({ label })),
      stack_heading: h.stack_heading,
      stack: h.stack.map((x) => ({ name: x.name, icon: asset({ file: x.icon, alt: `${x.name} logo` }), link: web(x.url) })),
      experience_heading: h.experience_heading,
      experience: h.experience.map((x) => ({ ...x, description: richFromMarkdown(x.description) })),
      meta_title: h.meta_title, meta_description: h.meta_description, meta_image: asset(null),
    } },
    { type: 'projects_page', title: 'Projects page', data: {
      heading: p.heading, meta_title: p.meta_title, meta_description: p.meta_description, meta_image: asset(null),
    } },
    { type: 'about', title: 'About', data: {
      heading: a.heading, intro: paragraphs(a.intro),
      polaroids: a.polaroids.map((x) => ({ photo: asset(parseImageRef(x.image)), caption: x.caption || null })),
      outro: paragraphs(a.outro), resume_label: a.resume_label, resume_link: web(a.resume_url),
      slices: a.scroll_scramble ? [slice('scroll_scramble', { center_word: a.scroll_scramble.center_word, lines: a.scroll_scramble.lines })] : [],
      meta_title: a.meta_title, meta_description: a.meta_description, meta_image: asset(null),
    } },
  ]
}

// ---------------------------------------------------------------------------

/**
 * Builds every document for every locale.
 * @param {(ref: {file: string, alt: string|null} | null) => any} asset maps an image reference to a Prismic image field value
 * @returns {Array<{ type: string, uid?: string, lang: string, title: string, data: object }>}
 */
export function buildDocuments(asset) {
  const docs = []
  const siteEn = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'site.en.json'), 'utf8'))
  for (const [short, lang] of Object.entries(LOCALES)) {
    const file = path.join(CONTENT_DIR, `site.${short}.json`)
    const site = fs.existsSync(file) ? deepDefaults(JSON.parse(fs.readFileSync(file, 'utf8')), siteEn) : siteEn
    for (const doc of buildSite(site, asset)) docs.push({ ...doc, lang })

    const casesDir = path.join(CONTENT_DIR, 'cases')
    for (const f of fs.readdirSync(casesDir).filter((f) => f.endsWith(`.${short}.md`)).sort()) {
      const c = parseCase(fs.readFileSync(path.join(casesDir, f), 'utf8'), asset)
      docs.push({ type: 'case_study', uid: c.uid, lang, title: c.title, data: c.data })
    }
  }
  return docs
}
