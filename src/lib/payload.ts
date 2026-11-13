import 'server-only'
import config from '@payload-config'
import { getPayload, type CollectionSlug, type Where } from 'payload'
import { cache } from 'react'
import type { Locale } from '@/i18n/dict'

export const getClient = cache(async () => getPayload({ config }))

const draftable = new Set(['courses', 'publications', 'books', 'classical-texts', 'sessions', 'competitions'])

/** Adds the "published only" filter for draft-enabled collections. */
function publicWhere(collection: string, where?: Where): Where | undefined {
  if (!draftable.has(collection)) return where
  const pub: Where = { _status: { equals: 'published' } }
  return where ? { and: [pub, where] } : pub
}

type FindArgs = {
  collection: CollectionSlug
  locale: Locale
  where?: Where
  sort?: string
  limit?: number
  page?: number
  depth?: number
}

export async function find<T = any>({ collection, locale, where, sort, limit = 50, page, depth = 1 }: FindArgs) {
  const payload = await getClient()
  const res = await payload.find({
    collection,
    locale,
    fallbackLocale: 'uz',
    where: publicWhere(collection, where),
    sort,
    limit,
    page,
    depth,
  })
  return res as unknown as { docs: T[]; totalDocs: number; totalPages: number; page?: number }
}

export async function findBySlug<T = any>(collection: CollectionSlug, slug: string, locale: Locale, depth = 2): Promise<T | null> {
  const res = await find<T>({ collection, locale, where: { slug: { equals: decodeURIComponent(slug) } }, limit: 1, depth })
  return res.docs[0] ?? null
}

export async function count(collection: CollectionSlug, where?: Where) {
  const payload = await getClient()
  const res = await payload.count({ collection, where: publicWhere(collection, where) })
  return res.totalDocs
}

export const getGlobal = cache(async <T = any>(slug: 'site-settings' | 'home-page' | 'about-page', locale: Locale, depth = 1) => {
  const payload = await getClient()
  return (await payload.findGlobal({ slug, locale, fallbackLocale: 'uz', depth })) as T
})
