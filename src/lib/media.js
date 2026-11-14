export function mediaUrl(m, size) {
  if (!m || typeof m === 'number') return null
  if (size && m.sizes?.[size]?.url) return m.sizes[size].url
  return m.url ?? null
}

export function mediaAlt(m, fallback = '') {
  if (!m || typeof m === 'number') return fallback
  return m.alt || fallback
}
