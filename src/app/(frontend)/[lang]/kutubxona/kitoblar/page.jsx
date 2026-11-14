import React, { Suspense } from 'react'
import { getDict } from '@/i18n/dict'
import { list } from '@/lib/api'
import { href } from '@/lib/links'
import { PageHero } from '@/components/ui'
import { BookBrowser } from '@/components/browsers'

export async function generateMetadata({ params }) {
  const { lang } = await params
  return { title: getDict(lang).labels.books }
}

export default async function BooksPage({ params, searchParams }) {
  const { lang } = await params
  const sp = await searchParams
  const t = getDict(lang)
  const [books, topics] = await Promise.all([
    list('books', { locale: lang, sort: 'title', limit: 1000 }),
    list('topics', { locale: lang, sort: 'order' }),
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
