// Composes product screens into browser and phone mockups at the exact sizes
// the site uses (2x): thumbnails 1784×1004, cover and gallery images 1784×1116.
// Missing screens render as labelled grey placeholders with the same layout,
// so the case looks finished before the real exports exist.
//
//   npm run mockups                        → every spec in content/figma/*.json
//   npm run mockups -- ven-con-alex        → one spec
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { CONTENT_DIR, IMAGES_DIR } from './lib/build-content.mjs'

const FIGMA_DIR = path.join(CONTENT_DIR, 'figma')
const SCREENS_DIR = path.join(FIGMA_DIR, 'screens')
const BG = ['#2b2b2b', '#1c1c1c']

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

const background = (w, h) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs><radialGradient id="g" cx="30%" cy="20%" r="95%"><stop offset="0" stop-color="${BG[0]}"/><stop offset="1" stop-color="${BG[1]}"/></radialGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/></svg>`)

/** The screen image fitted to w×h (top-aligned), or a placeholder. */
async function screen(name, label, w, h, radius) {
  const file = path.join(SCREENS_DIR, `${name}.png`)
  const mask = Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${radius}" fill="#fff"/></svg>`)
  let img
  if (fs.existsSync(file)) {
    img = await sharp(file).resize(w, h, { fit: 'cover', position: 'top' }).png().toBuffer()
  } else {
    const size = Math.round(Math.min(Math.min(w, h) / 14, (w * 0.86) / (label.length * 0.6)))
    img = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <rect width="100%" height="100%" fill="#3a3a3a"/>
      <g stroke="#474747" stroke-width="2">${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="${(i + 1) * h / 13}" x2="${w}" y2="${(i + 1) * h / 13}"/>`).join('')}</g>
      <text x="50%" y="48%" text-anchor="middle" font-family="monospace" font-size="${size}" fill="#d4d4d4">${esc(label)}</text>
      <text x="50%" y="${48 + 100 * size * 1.6 / h}%" text-anchor="middle" font-family="monospace" font-size="${Math.round(size * 0.6)}" fill="#a1a1a1">placeholder</text>
    </svg>`)).png().toBuffer()
  }
  return sharp(img).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer()
}

async function browser(name, label, w) {
  const bar = Math.round(w * 0.035)
  const h = Math.round(w * 0.62)
  const r = Math.round(w * 0.012)
  const dots = [0, 1, 2].map((i) => `<circle cx="${bar * (0.7 + i * 0.55)}" cy="${bar / 2}" r="${bar * 0.16}" fill="#5a5a5a"/>`).join('')
  const frame = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h + bar}">
    <rect width="100%" height="100%" rx="${r}" fill="#2f2f2f"/>${dots}
    <rect x="${w * 0.3}" y="${bar * 0.22}" width="${w * 0.4}" height="${bar * 0.56}" rx="${bar * 0.28}" fill="#3a3a3a"/></svg>`)
  const content = await screen(name, label, w, h, 0)
  return sharp(frame).composite([{ input: content, top: bar, left: 0 }]).png().toBuffer()
}

async function phone(name, label, w) {
  const h = Math.round(w * 2.16)
  const bezel = Math.round(w * 0.035)
  const r = Math.round(w * 0.14)
  const body = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="100%" height="100%" rx="${r}" fill="#0d0d0d"/>
    <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="${r}" fill="none" stroke="#3d3d3d" stroke-width="2"/></svg>`)
  const content = await screen(name, label, w - bezel * 2, h - bezel * 2, r - bezel)
  return sharp(body).composite([{ input: content, top: bezel, left: bezel }]).png().toBuffer()
}

const shadow = async (buf) => {
  const { width, height } = await sharp(buf).metadata()
  const pad = Math.round(width * 0.08)
  const blur = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width + pad * 2}" height="${height + pad * 2}">
    <defs><filter id="f"><feGaussianBlur stdDeviation="${pad / 3}"/></filter></defs>
    <rect x="${pad}" y="${pad * 1.4}" width="${width}" height="${height}" rx="${width * 0.04}" fill="#000" opacity="0.5" filter="url(#f)"/></svg>`)
  return { buf: await sharp(blur).composite([{ input: buf, top: pad, left: pad }]).png().toBuffer(), pad }
}

async function render(output, spec) {
  const [W, H] = output.size
  const label = (n) => spec.screens[n]?.label ?? n
  const layers = []
  const place = async (buf, left, top) => {
    const s = await shadow(buf)
    layers.push({ input: s.buf, left: Math.round(left - s.pad), top: Math.round(top - s.pad) })
  }

  if (output.layout === 'desktop') {
    const w = Math.round(W * 0.78)
    const buf = await browser(output.screens[0], label(output.screens[0]), w)
    await place(buf, (W - w) / 2, H * 0.11)
  } else if (output.layout === 'phones') {
    const n = output.screens.length
    const w = Math.round(Math.min(W * 0.22, (H * 0.8) / 2.16))
    const gap = Math.round(W * 0.04)
    const total = n * w + (n - 1) * gap
    for (const [i, name] of output.screens.entries()) {
      const buf = await phone(name, label(name), w)
      const offset = i % 2 ? H * 0.06 : 0
      await place(buf, (W - total) / 2 + i * (w + gap), (H - w * 2.16) / 2 - H * 0.03 + offset)
    }
  } else if (output.layout === 'desktop-phone') {
    const dw = Math.round(W * 0.7)
    const desk = await browser(output.screens[0], label(output.screens[0]), dw)
    await place(desk, W * 0.08, H * 0.12)
    const pw = Math.round(W * 0.18)
    const ph = await phone(output.screens[1], label(output.screens[1]), pw)
    await place(ph, W * 0.92 - pw, H - pw * 2.16 - H * 0.02)
  }

  const out = path.join(IMAGES_DIR, output.file)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  // Compose on an oversized canvas so mockups and shadows can bleed past the edges, then crop.
  const M = Math.round(W * 0.3)
  const canvas = await sharp(background(W + M * 2, H + M * 2))
    .composite(layers.map((l) => ({ ...l, left: l.left + M, top: l.top + M })))
    .png().toBuffer()
  await sharp(canvas).extract({ left: M, top: M, width: W, height: H }).webp({ quality: 86 }).toFile(out)
  const missing = output.screens.filter((n) => !fs.existsSync(path.join(SCREENS_DIR, `${n}.png`)))
  console.log(`${output.file}${missing.length ? `  (placeholders: ${missing.join(', ')})` : ''}`)
}

const only = process.argv[2]
for (const f of fs.readdirSync(FIGMA_DIR).filter((f) => f.endsWith('.json'))) {
  if (only && f !== `${only}.json`) continue
  const spec = JSON.parse(fs.readFileSync(path.join(FIGMA_DIR, f), 'utf8'))
  for (const output of spec.outputs) await render(output, spec)
}
