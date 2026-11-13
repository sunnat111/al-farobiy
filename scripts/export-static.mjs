#!/usr/bin/env node
/**
 * Builds a read-only static snapshot of the site for GitHub Pages (or any static host).
 *
 *   pnpm export:static                       # → ./out, served under /al-farobiy
 *   BASE_PATH=/my-path pnpm export:static     # different sub-path ("" for a domain root)
 *
 * How it works: builds the app with basePath + "static demo" mode into .next-static, starts it,
 * crawls every page reachable from /uz and /en, saves the HTML, then copies JS/CSS, fonts and
 * uploaded media next to it. Forms and the admin panel need a server, so they are disabled
 * in the snapshot. Content comes from the local database — run `pnpm seed` first if it is empty.
 */
import { spawn, execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.BASE_PATH ?? '/al-farobiy'
const SITE_URL = process.env.SITE_URL ?? 'https://sunnat111.github.io/al-farobiy'
const PORT = Number(process.env.PORT ?? 3123)
const OUT = path.resolve('out')
const DIST = '.next-static'
const ORIGIN = `http://127.0.0.1:${PORT}`

const env = {
  ...process.env,
  NEXT_PUBLIC_BASE_PATH: BASE,
  NEXT_PUBLIC_STATIC_DEMO: '1',
  NEXT_PUBLIC_SERVER_URL: SITE_URL,
  NEXT_DIST_DIR: DIST,
  NODE_OPTIONS: '--no-deprecation --max-old-space-size=8000',
}

const log = (...a) => console.log('[export]', ...a)

log(`building with basePath "${BASE}"…`)
execSync('npx next build', { stdio: 'inherit', env })

log('starting server…')
const server = spawn('npx', ['next', 'start', '-p', String(PORT)], { env, stdio: ['ignore', 'pipe', 'inherit'], detached: true })
const stop = () => {
  try {
    process.kill(-server.pid)
  } catch {}
}
process.on('exit', stop)

async function waitForServer() {
  for (let i = 0; i < 120; i++) {
    try {
      const r = await fetch(`${ORIGIN}${BASE}/uz`)
      if (r.ok) return
    } catch {}
    await new Promise((r) => setTimeout(r, 1000))
  }
  throw new Error('server did not start')
}

/** Rewrite URLs that Next.js does not prefix by itself (uploaded media). */
function rewrite(html) {
  // Payload may write absolute URLs (https://host/api/media/file/…) or relative ones (/api/media/file/…)
  return html.replace(/(?:https?:\/\/[^"'\s,)]*?)?\/api\/media\/file\//g, `${BASE}/media/`)
}

function outFile(urlPath) {
  const rel = urlPath.slice(BASE.length).replace(/^\/+/, '')
  return path.join(OUT, rel, 'index.html')
}

async function crawl() {
  const queue = [`${BASE}/uz`, `${BASE}/en`]
  const seen = new Set(queue)
  let count = 0
  while (queue.length) {
    const p = queue.shift()
    const res = await fetch(ORIGIN + p, { redirect: 'manual' })
    if (res.status !== 200) {
      log(`skip ${res.status} ${p}`)
      continue
    }
    const html = await res.text()
    const file = outFile(p)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, rewrite(html))
    count++
    for (const m of html.matchAll(/href="([^"#?]+)/g)) {
      let u = m[1]
      if (!u.startsWith(BASE + '/') || /\/(_next|api|admin)\b/.test(u) || /\.\w{2,4}$/.test(u)) continue
      u = u.replace(/\/$/, '')
      if (!seen.has(u)) {
        seen.add(u)
        queue.push(u)
      }
    }
  }
  return count
}

try {
  fs.rmSync(OUT, { recursive: true, force: true })
  fs.mkdirSync(OUT, { recursive: true })
  await waitForServer()
  const pages = await crawl()
  log(`${pages} pages saved`)

  // 404 page (GitHub Pages serves /404.html for unknown paths)
  const nf = await fetch(`${ORIGIN}${BASE}/uz/__not-found__`)
  fs.writeFileSync(path.join(OUT, '404.html'), rewrite(await nf.text()))

  // assets: JS/CSS/fonts, public files, uploaded media
  fs.cpSync(path.join(DIST, 'static'), path.join(OUT, '_next', 'static'), { recursive: true })
  fs.cpSync('public', OUT, { recursive: true })
  if (fs.existsSync('media')) fs.cpSync('media', path.join(OUT, 'media'), { recursive: true })

  // root → Uzbek home page
  fs.writeFileSync(
    path.join(OUT, 'index.html'),
    `<!doctype html><meta charset="utf-8"><title>AL-FOROB AVLODIDAN</title><meta http-equiv="refresh" content="0; url=${BASE}/uz/"><link rel="canonical" href="${BASE}/uz/"><a href="${BASE}/uz/">AL-FOROB AVLODIDAN</a>`,
  )
  fs.writeFileSync(path.join(OUT, '.nojekyll'), '') // keep the _next folder on GitHub Pages
  log(`done → ${OUT}`)
} finally {
  stop()
}
process.exit(0)
