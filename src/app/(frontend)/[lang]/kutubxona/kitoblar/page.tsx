import type { Metadata } from 'next'
import React, { Suspense } from 'react'
import type { Book, Topic } from '@/payload-types'
import { getDict, type Locale } from '@/i18n/dict'
import { find } from '@/lib/payload'
import { href } from '@/lib/links'
import { PageHero } from '@/components/ui'
import { BookBrowser } from '@/components/browsers'

type Props = { params: Promise<{ lang: Locale }>; searchParams: Promise<Record<string, string | undefined>> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  return { title: getDict(lang).labels.books }
}

export default async function BooksPage({ params, searchParams }: Props) {
  const { lang } = await params
  const sp = await searchParams
  const t = getDict(lang)
  const [books, topics] = await Promise.all([
    find<Book>({ collection: 'books', locale: lang, sort: 'title', limit: 1000 }),
    find<Topic>({ collection: 'topics', locale: lang, sort: 'order', depth: 0 }),
  ])
  return (
    <>
      <PageHero eyebrow={`${t.nav.library} · I`} title={t.labels.books} intro={t.navDesc.books} crumbs={[{ label: t.nav.library, href: href.library(lang) }, { label: t.labels.books }]} />
      <Suspense>
        <BookBrowser books={books.docs} topics={topics.docs} locale={lang} initial={sp} />
      </Suspense>
    </>
  )
}
