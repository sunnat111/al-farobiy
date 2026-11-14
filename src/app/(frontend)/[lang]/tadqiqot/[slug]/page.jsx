import { notFound } from 'next/navigation'
import React from 'react'
import { getDict } from '@/i18n/dict'
import { getBySlug } from '@/lib/api'
import { href } from '@/lib/links'
import { mediaUrl } from '@/lib/media'
import { PublicationView } from '@/components/PublicationView'

export async function generateMetadata({ params }) {
  const { lang, slug } = await params
  const p = await getBySlug('publications', slug, lang)
  if (!p) return {}
  return { title: p.title, description: p.excerpt ?? undefined, openGraph: { type: 'article', images: mediaUrl(p.cover, 'hero') ?? undefined } }
}

export default async function Page({ params }) {
  const { lang, slug } = await params
  const t = getDict(lang)
  const p = await getBySlug('publications', slug, lang)
  if (!p || p.kind !== 'research') notFound()
  return <PublicationView p={p} locale={lang} crumbs={[{ label: t.siteName, href: href.home(lang) }, { label: t.nav.research, href: href.research(lang) }, { label: p.title }]} />
}
