import type { Media } from '@/payload-types'

export type MediaLike = number | Media | null | undefined

export function mediaUrl(m: MediaLike, size?: 'thumb' | 'card' | 'hero'): string | null {
  if (!m || typeof m === 'number') return null
  if (size && m.sizes?.[size]?.url) return m.sizes[size]!.url!
  return m.url ?? null
}

export function mediaAlt(m: MediaLike, fallback = ''): string {
  if (!m || typeof m === 'number') return fallback
  return m.alt || fallback
}
