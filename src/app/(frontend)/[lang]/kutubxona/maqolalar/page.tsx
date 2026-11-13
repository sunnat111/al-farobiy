import type { Metadata } from 'next'
import React from 'react'
import { getDict, type Locale } from '@/i18n/dict'
import { href } from '@/lib/links'
import { PageHero } from '@/components/ui'
import { PublicationList } from '@/components/PublicationList'

type Props = { params: Promise<{ lang: Locale }>; searchParams: Promise<Record<string, string | undefined>> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  return { title: getDict(lang).labels.articles }
}

export default async function ArticlesPage({ params, searchParams }: Props) {
  const { lang } = await params
  const sp = await searchParams
  const t = getDict(lang)
  return (
    <>
      <PageHero
        eyebrow={`${t.nav.library} · III`}
        title={lang === 'uz' ? 'Ilmiy maqolalar va tadqiqotlar repozitoriysi' : 'Research Papers & Articles'}
        intro={
          lang === 'uz'
            ? 'Hamkor tadqiqotchilar, mentorlar va mualliflarimizning maqolalari hamda xalqaro jurnallardan saralab olingan tahliliy maqolalar. Muallif, yil va mavzu boʻyicha saralang.'
            : 'Papers by partner researchers, mentors and our authors, plus selected analytical articles from international journals. Filter by author, year and topic.'
        }
        crumbs={[{ label: t.nav.library, href: href.library(lang) }, { label: t.labels.articles }]}
      />
      <PublicationList locale={lang} kinds={['article', 'curated']} sp={sp} basePath={href.articles(lang)} showKindFilter />
    </>
  )
}
