import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import type { Publication } from '@/payload-types'
import { getDict, type Locale } from '@/i18n/dict'
import { findBySlug } from '@/lib/payload'
import { href } from '@/lib/links'
import { PublicationView } from '@/components/PublicationView'

type Params = { params: Promise<{ lang: Locale; slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang, slug } = await params
  const p = await findBySlug<Publication>('publications', slug, lang, 1)
  return p ? { title: p.title, description: p.excerpt ?? undefined } : {}
}

export default async function Page({ params }: Params) {
  const { lang, slug } = await params
  const t = getDict(lang)
  const p = await findBySlug<Publication>('publications', slug, lang)
  if (!p || !['article', 'curated'].includes(p.kind)) notFound()
  return (
    <PublicationView
      p={p}
      locale={lang}
      crumbs={[{ label: t.nav.library, href: href.library(lang) }, { label: t.labels.articles, href: href.articles(lang) }, { label: p.title }]}
    />
  )
}
