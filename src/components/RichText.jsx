import React from 'react'
import { slugify } from '@/lib/slugify'

/**
 * Formatted text written in the admin panel's editor. The backend sends it as HTML that
 * has already been cleaned (no scripts or styles), so it can be inserted directly.
 */

const H2 = /<h2([^>]*)>([\s\S]*?)<\/h2>/g
const stripTags = (html) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim()

/** h2 headings of a text, for a table of contents. */
export function headingsOf(html) {
  if (!html) return []
  return [...html.matchAll(H2)].map((m) => ({ id: slugify(stripTags(m[2])), text: stripTags(m[2]) }))
}

/** Gives every h2 an id so the table of contents can link to it. */
function withAnchors(html) {
  return html.replace(H2, (_all, attrs, inner) => `<h2${attrs} id="${slugify(stripTags(inner))}" class="scroll-mt-28">${inner}</h2>`)
}

export function RichText({ data, className = 'reader' }) {
  if (!data || typeof data !== 'string') return null
  return <div className={className} dangerouslySetInnerHTML={{ __html: withAnchors(data) }} />
}
