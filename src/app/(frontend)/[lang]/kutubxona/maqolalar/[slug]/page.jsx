import { notFound } from 'next/navigation'
import React from 'react'
import { getDict } from '@/i18n/dict'
import { getBySlug } from '@/lib/api'
import { href } from '@/lib/links'
import { PublicationView } from '@/components/PublicationView'

export async function generateMetadata({ params }) {
  const { lang, slug } = await params
  const p = await getBySlug('publications', slug, lang)
  return p ? { title: p.title, description: p.excerpt ?? undefined } : {}
}

export default async function Page({ params }) {
  const { lang, slug } = await params
  const t = getDict(lang)
  const p = await getBySlug('publications', slug, lang)
  if (!p || !['article', 'curated'].includes(p.kind)) notFound()
  return (
    <PublicationView
      p={p}
      locale={lang}
      crumbs={[{ label: t.nav.library, href: href.library(lang) }, { label: t.labels.articles, href: href.articles(lang) }, { label: p.title }]}
    />
  )
}
