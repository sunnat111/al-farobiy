import 'server-only'
import { cache } from 'react'

/**
 * Talks to the Python (FastAPI) backend. Runs on the Next.js server only,
 * so the browser never needs to know where the backend lives.
 *
 * API_URL defaults to the local backend started with `uvicorn app.main:app --port 8000`.
 */
const API_URL = (process.env.API_URL || 'http://localhost:8000').replace(/\/$/, '')

async function get(path, params = {}) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    query.set(key, Array.isArray(value) ? value.join(',') : String(value))
  }
  const url = `${API_URL}${path}${query.size ? `?${query}` : ''}`
  const res = await fetch(url, { cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`API ${res.status} for ${url}: ${await res.text()}`)
  return res.json()
}

/**
 * List of items. Example:
 *   list('publications', { locale: 'uz', sort: '-publishedDate', limit: 6, kind: ['research', 'brief'] })
 * Filters the backend understands: kind, series, category, featured, topic, author, exclude.
 * Returns { docs: [...], totalDocs }.
 */
export async function list(collection, { locale = 'uz', ...params } = {}) {
  return (await get(`/api/${collection}`, { locale, ...params })) ?? { docs: [], totalDocs: 0 }
}

/** One item by its URL slug, or null if it does not exist (or is a draft). */
export async function getBySlug(collection, slug, locale = 'uz') {
  return get(`/api/${collection}/${encodeURIComponent(decodeURIComponent(slug))}`, { locale })
}

/** Single settings pages: 'site-settings', 'home-page', 'about-page'. Cached for one page render. */
export const getGlobal = cache(async (name, locale = 'uz') => get(`/api/globals/${name}`, { locale }))

/** Counts of published items: { courses, books, classicalTexts, publications, articles, briefs, competitions }. */
export const getStats = cache(async () => get('/api/stats'))

/** Sends a form to the backend: 'essay', 'proposal' or 'message'. Returns { ok, message, errors }. */
export async function postForm(name, body) {
  const res = await fetch(`${API_URL}/api/forms/${name}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`API ${res.status} for form ${name}`)
  return res.json()
}
