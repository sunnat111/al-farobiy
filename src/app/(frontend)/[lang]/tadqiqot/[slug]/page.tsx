import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import type { Publication } from '@/payload-types'
import { getDict, type Locale } from '@/i18n/dict'
import { findBySlug } from '@/lib/payload'
import { href } from '@/lib/links'
import { mediaUrl } from '@/lib/media'
import { PublicationView } from '@/components/PublicationView'

type Params = { params: Promise<{ lang: Locale; slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang, slug } = await params
  const p = await findBySlug<Publication>('publications', slug, lang, 1)
  if (!p) return {}
  return { title: p.title, description: p.excerpt ?? undefined, openGraph: { type: 'article', images: mediaUrl(p.cover, 'hero') ?? undefined } }
}

export default async function Page({ params }: Params) {
  const { lang, slug } = await params
  const t = getDict(lang)
  const p = await findBySlug<Publication>('publications', slug, lang)
  if (!p || p.kind !== 'research') notFound()
  return <PublicationView p={p} locale={lang} crumbs={[{ label: t.siteName, href: href.home(lang) }, { label: t.nav.research, href: href.research(lang) }, { label: p.title }]} />
}
