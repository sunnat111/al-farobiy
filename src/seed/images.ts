/**
 * Generated demo artwork (SVG strings). The seed rasterises them with sharp and caches
 * the results in /seed-assets so they look identical on every machine.
 * Real photos and covers replace these through the admin panel.
 */

export const palette = {
  lapis900: '#0F1F4D',
  lapis800: '#14275E',
  lapis700: '#1E3A8A',
  lapis600: '#2B4CB0',
  turquoise: '#1E8C86',
  turquoiseDark: '#135E5A',
  gold: '#C9962B',
  goldLight: '#E3C27A',
  terracotta: '#B5532C',
  terracottaDark: '#7E3518',
  emerald: '#1F4D3A',
  plum: '#4A2E5C',
  ivory: '#FBF8F2',
  sand: '#EFE6D2',
}

const SERIF = "'Source Serif 4', 'DejaVu Serif', serif"
const SANS = "Inter, 'DejaVu Sans', sans-serif"

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function rng(seed: string) {
  let x = hash(seed) || 1
  return () => {
    x ^= x << 13
    x ^= x >>> 17
    x ^= x << 5
    return ((x >>> 0) % 10000) / 10000
  }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function wrap(text: string, max: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max && line) {
      lines.push(line)
      line = w
    } else line = (line + ' ' + w).trim()
  }
  if (line) lines.push(line)
  return lines
}

/** One 8-point girih star (two rotated squares). */
function star(cx: number, cy: number, r: number, stroke: string, sw: number, opacity = 1, fill = 'none') {
  const s = r * 0.72
  return `<g transform="translate(${cx} ${cy})" opacity="${opacity}">
    <rect x="${-s}" y="${-s}" width="${2 * s}" height="${2 * s}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
    <rect x="${-s}" y="${-s}" width="${2 * s}" height="${2 * s}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" transform="rotate(45)"/>
  </g>`
}

function starGrid(w: number, h: number, step: number, stroke: string, opacity: number, sw = 1.5) {
  let out = ''
  for (let y = 0; y <= h + step; y += step)
    for (let x = 0; x <= w + step; x += step) {
      const off = (Math.round(y / step) % 2) * (step / 2)
      out += star(x + off, y, step * 0.42, stroke, sw, opacity)
    }
  return out
}

function arches(w: number, h: number, n: number, stroke: string, opacity: number) {
  const aw = w / n
  let out = ''
  for (let i = 0; i < n; i++) {
    const x = i * aw
    out += `<path d="M${x + aw * 0.1} ${h} V${h * 0.45} Q${x + aw * 0.1} ${h * 0.2} ${x + aw / 2} ${h * 0.12} Q${x + aw * 0.9} ${h * 0.2} ${x + aw * 0.9} ${h * 0.45} V${h}" fill="none" stroke="${stroke}" stroke-width="2" opacity="${opacity}"/>`
  }
  return out
}

function rings(cx: number, cy: number, r: number, n: number, stroke: string, opacity: number) {
  let out = ''
  for (let i = 1; i <= n; i++) out += `<circle cx="${cx}" cy="${cy}" r="${(r / n) * i}" fill="none" stroke="${stroke}" stroke-width="1.5" opacity="${opacity}"/>`
  return out
}

const svg = (w: number, h: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`

/* ---------- book cover 600×900 ---------- */
export function bookCover(opts: { title: string; author: string; bg: string; label: string; seed?: string }) {
  const r = rng(opts.seed ?? opts.title)
  const W = 600
  const H = 900
  const variant = Math.floor(r() * 3)
  const accent = [palette.gold, palette.goldLight, palette.sand][Math.floor(r() * 3)]
  const titleLines = wrap(opts.title, opts.title.length > 40 ? 18 : 15).slice(0, 5)
  const fs = titleLines.length > 3 ? 46 : 54
  let art = ''
  if (variant === 0) art = starGrid(W, 420, 120, accent, 0.28)
  if (variant === 1) art = arches(W, 420, 4, accent, 0.4)
  if (variant === 2) art = rings(W / 2, 220, 260, 9, accent, 0.35) + star(W / 2, 220, 90, accent, 3, 0.9)
  const titleY = 520
  return svg(
    W,
    H,
    `<rect width="${W}" height="${H}" fill="${opts.bg}"/>
     <g>${art}</g>
     <rect x="0" y="440" width="${W}" height="${H - 440}" fill="${opts.bg}"/>
     <rect x="36" y="36" width="${W - 72}" height="${H - 72}" fill="none" stroke="${accent}" stroke-width="2" opacity="0.65"/>
     <rect x="0" y="0" width="22" height="${H}" fill="#000" opacity="0.18"/>
     <text x="60" y="470" font-family="${SANS}" font-size="17" font-weight="700" letter-spacing="3" fill="${accent}">${esc(opts.label.toUpperCase())}</text>
     <line x1="60" y1="488" x2="160" y2="488" stroke="${accent}" stroke-width="3"/>
     ${titleLines.map((l, i) => `<text x="60" y="${titleY + 30 + i * (fs * 1.12)}" font-family="${SERIF}" font-size="${fs}" font-weight="700" fill="${palette.ivory}">${esc(l)}</text>`).join('')}
     <text x="60" y="${H - 80}" font-family="${SANS}" font-size="24" font-weight="600" fill="${accent}">${esc(opts.author)}</text>`,
  )
}

/* ---------- wide abstract cover 1200×675 ---------- */
export function wideCover(opts: { seed: string; bg: string; bg2?: string; motif?: 'stars' | 'arches' | 'rings' | 'table' | 'pen' | 'columns'; label?: string; big?: string }) {
  const r = rng(opts.seed)
  const W = 1200
  const H = 675
  const bg2 = opts.bg2 ?? palette.lapis900
  const accent = r() > 0.5 ? palette.gold : palette.goldLight
  const motif = opts.motif ?? (['stars', 'arches', 'rings'] as const)[Math.floor(r() * 3)]
  let art = ''
  const cx = 760 + r() * 200
  const cy = 300 + r() * 80
  switch (motif) {
    case 'stars':
      art = starGrid(W, H, 150, accent, 0.18) + star(cx, cy, 230, accent, 4, 0.9) + star(cx, cy, 150, palette.ivory, 2, 0.5)
      break
    case 'arches':
      art = arches(W, H, 6, accent, 0.25) + `<path d="M${cx - 170} ${H} V${cy} Q${cx - 170} ${cy - 220} ${cx} ${cy - 280} Q${cx + 170} ${cy - 220} ${cx + 170} ${cy} V${H}" fill="${palette.ivory}" opacity="0.08" stroke="${accent}" stroke-width="4"/>`
      break
    case 'rings':
      art = rings(cx, cy, 420, 12, accent, 0.3) + `<circle cx="${cx}" cy="${cy}" r="70" fill="${accent}" opacity="0.9"/>`
      break
    case 'table': {
      art = rings(cx, cy, 300, 4, accent, 0.25) + `<circle cx="${cx}" cy="${cy}" r="120" fill="none" stroke="${accent}" stroke-width="5"/>`
      const n = 9
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + r()
        art += `<circle cx="${cx + Math.cos(a) * 200}" cy="${cy + Math.sin(a) * 200}" r="${26 + r() * 8}" fill="${i % 3 === 0 ? accent : palette.ivory}" opacity="${i % 3 === 0 ? 0.95 : 0.75}"/>`
      }
      break
    }
    case 'pen':
      art =
        starGrid(W, H, 170, accent, 0.14) +
        `<g transform="translate(${cx} ${cy}) rotate(-35)">
          <path d="M0 -260 L60 -40 L0 140 L-60 -40 Z" fill="${palette.ivory}" opacity="0.92"/>
          <path d="M0 -40 L0 140" stroke="${opts.bg}" stroke-width="6"/>
          <circle cx="0" cy="-40" r="14" fill="${opts.bg}"/>
          <rect x="-70" y="-330" width="140" height="70" rx="10" fill="${accent}"/>
        </g>`
      break
    case 'columns': {
      const ccx = Math.min(cx, 820)
      const ccy = 400
      art = starGrid(W, H, 170, accent, 0.12)
      for (let i = 0; i < 5; i++) {
        const x = ccx - 260 + i * 130
        art += `<rect x="${x}" y="${ccy - 130}" width="54" height="290" fill="${palette.ivory}" opacity="${0.2 + i * 0.1}"/>`
      }
      art += `<path d="M${ccx - 320} ${ccy - 140} L${ccx + 30} ${ccy - 290} L${ccx + 380} ${ccy - 140} Z" fill="${accent}" opacity="0.9"/><rect x="${ccx - 320}" y="${ccy + 165}" width="700" height="26" fill="${accent}" opacity="0.9"/>`
      break
    }
  }
  const big = opts.big
    ? `<text x="70" y="${H - 80}" font-family="${SERIF}" font-size="190" font-weight="700" fill="${palette.ivory}" opacity="0.95">${esc(opts.big)}</text>`
    : ''
  const label = opts.label
    ? `<text x="72" y="96" font-family="${SANS}" font-size="24" font-weight="700" letter-spacing="5" fill="${accent}">${esc(opts.label.toUpperCase())}</text><line x1="72" y1="118" x2="200" y2="118" stroke="${accent}" stroke-width="4"/>`
    : ''
  return svg(
    W,
    H,
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${opts.bg}"/><stop offset="1" stop-color="${bg2}"/></linearGradient></defs>
     <rect width="${W}" height="${H}" fill="url(#g)"/>${art}${label}${big}`,
  )
}

/* ---------- classical thinker medallion 900×1100 ---------- */
export function medallion(opts: { name: string; initials: string; era: string; bg: string; seed?: string }) {
  const W = 900
  const H = 1100
  const r = rng(opts.seed ?? opts.name)
  const accent = palette.gold
  const nameLines = wrap(opts.name, 18)
  return svg(
    W,
    H,
    `<rect width="${W}" height="${H}" fill="${opts.bg}"/>
     ${starGrid(W, H, 140, accent, 0.12 + r() * 0.05)}
     <path d="M170 900 V470 Q170 230 450 140 Q730 230 730 470 V900 Z" fill="${palette.lapis900}" opacity="0.55" stroke="${accent}" stroke-width="6"/>
     <path d="M205 880 V478 Q205 262 450 182 Q695 262 695 478 V880 Z" fill="none" stroke="${palette.goldLight}" stroke-width="2" opacity="0.7"/>
     ${star(450, 330, 70, accent, 4, 0.95)}
     <text x="450" y="640" text-anchor="middle" font-family="${SERIF}" font-size="200" font-weight="700" fill="${palette.ivory}">${esc(opts.initials)}</text>
     ${nameLines.map((l, i) => `<text x="450" y="${975 + i * 52}" text-anchor="middle" font-family="${SERIF}" font-size="46" font-weight="700" fill="${palette.ivory}">${esc(l)}</text>`).join('')}
     <text x="450" y="${975 + nameLines.length * 52 + 10}" text-anchor="middle" font-family="${SANS}" font-size="24" font-weight="600" letter-spacing="3" fill="${accent}">${esc(opts.era.toUpperCase())}</text>`,
  )
}

/* ---------- avatar 400×400 ---------- */
export function avatar(opts: { name: string; bg?: string }) {
  const r = rng(opts.name)
  const colors = [palette.lapis700, palette.turquoiseDark, palette.terracottaDark, palette.plum, palette.emerald, palette.lapis800]
  const bg = opts.bg ?? colors[Math.floor(r() * colors.length)]
  const initials = opts.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
  return svg(
    400,
    400,
    `<rect width="400" height="400" fill="${bg}"/>
     ${starGrid(400, 400, 100, palette.gold, 0.18, 1.2)}
     <circle cx="200" cy="200" r="120" fill="${bg}" stroke="${palette.gold}" stroke-width="4"/>
     <text x="200" y="238" text-anchor="middle" font-family="${SERIF}" font-size="112" font-weight="700" fill="${palette.ivory}">${esc(initials)}</text>`,
  )
}
