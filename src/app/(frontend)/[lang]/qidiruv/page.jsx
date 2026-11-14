import React, { Suspense } from 'react'
import { getDict } from '@/i18n/dict'
import { list } from '@/lib/api'
import { href } from '@/lib/links'
import { SearchClient } from '@/components/browsers'

export async function generateMetadata({ params }) {
  const { lang } = await params
  return { title: getDict(lang).common.search, robots: { index: false } }
}

/** Builds a small search index of everything on the site; matching happens in the browser. */
export default async function SearchPage({ params, searchParams }) {
  const { lang } = await params
  const sp = await searchParams
  const t = getDict(lang)
  const all = { locale: lang, limit: 1000 }
  const [courses, pubs, books, classics, sessions, authors] = await Promise.all([
    list('courses', all),
    list('publications', all),
    list('books', all),
    list('classical-texts', all),
    list('sessions', all),
    list('authors', all),
  ])
  const items = [
    ...courses.docs.map((d) => ({ key: `c${d.id}`, label: t.kinds.course, title: d.title, sub: d.tagline, href: href.course(lang, d), text: `${d.code ?? ''} ${d.summary ?? ''}` })),
    ...pubs.docs.map((d) => ({ key: `p${d.id}`, label: t.kinds[d.kind], title: d.title, sub: d.excerpt, href: href.publication(lang, d), text: `${d.summary ?? ''} ${d.externalAuthors ?? ''}` })),
    ...classics.docs.map((d) => ({ key: `k${d.id}`, label: t.kinds.classic, title: `${d.title} — ${d.thinker}`, sub: d.intro, href: href.classic(lang, d), text: d.originalTitle ?? '' })),
    ...books.docs.map((d) => ({ key: `b${d.id}`, label: t.kinds.book, title: d.title, sub: `${d.authorsText}, ${d.year}`, href: href.book(lang, d), text: `${d.titleTranslated ?? ''} ${d.summary ?? ''}` })),
    ...sessions.docs.map((d) => ({ key: `s${d.id}`, label: t.kinds.session, title: d.title, sub: d.question, href: href.session(lang, d), text: d.summary ?? '' })),
    ...authors.docs.map((d) => ({ key: `a${d.id}`, label: t.common.author, title: d.name, sub: d.position, href: href.author(lang, d), text: d.bio ?? '' })),
  ]

  return (
    <section className="container-x min-h-[60vh] py-12">
      <h1 className="font-display text-4xl font-bold text-lapis-950">{t.common.search}</h1>
      <Suspense>
        <SearchClient items={items} locale={lang} initial={sp} />
      </Suspense>
    </section>
  )
}
