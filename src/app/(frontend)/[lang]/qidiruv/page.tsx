import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { Search } from 'lucide-react'
import type { Author, Book, ClassicalText, Course, Publication, Session } from '@/payload-types'
import { getDict, type Locale } from '@/i18n/dict'
import { find } from '@/lib/payload'
import { href } from '@/lib/links'
import { TypeLabel } from '@/components/ui'

type Props = { params: Promise<{ lang: Locale }>; searchParams: Promise<{ q?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  return { title: getDict(lang).common.search, robots: { index: false } }
}

type Hit = { key: string; label: string; title: string; sub?: string | null; href: string }

export default async function SearchPage({ params, searchParams }: Props) {
  const { lang } = await params
  const { q = '' } = await searchParams
  const t = getDict(lang)
  const query = q.trim().slice(0, 100)
  let hits: Hit[] = []
  if (query) {
    const like = (fields: string[]) => ({ or: fields.map((f) => ({ [f]: { like: query } })) })
    const [courses, pubs, books, classics, sessions, authors] = await Promise.all([
      find<Course>({ collection: 'courses', locale: lang, where: like(['title', 'summary', 'tagline', 'code']), depth: 0 }),
      find<Publication>({ collection: 'publications', locale: lang, where: like(['title', 'excerpt', 'summary', 'externalAuthors']), depth: 0 }),
      find<Book>({ collection: 'books', locale: lang, where: like(['title', 'authorsText', 'titleTranslated', 'summary']), depth: 0 }),
      find<ClassicalText>({ collection: 'classical-texts', locale: lang, where: like(['title', 'thinker', 'intro']), depth: 0 }),
      find<Session>({ collection: 'sessions', locale: lang, where: like(['title', 'question', 'summary']), depth: 0 }),
      find<Author>({ collection: 'authors', locale: lang, where: like(['name', 'position', 'bio']), depth: 0 }),
    ])
    hits = [
      ...courses.docs.map((d) => ({ key: `c${d.id}`, label: t.kinds.course, title: d.title, sub: d.tagline, href: href.course(lang, d) })),
      ...pubs.docs.map((d) => ({ key: `p${d.id}`, label: t.kinds[d.kind], title: d.title, sub: d.excerpt, href: href.publication(lang, d) })),
      ...classics.docs.map((d) => ({ key: `k${d.id}`, label: t.kinds.classic, title: `${d.title} — ${d.thinker}`, sub: d.intro, href: href.classic(lang, d) })),
      ...books.docs.map((d) => ({ key: `b${d.id}`, label: t.kinds.book, title: d.title, sub: `${d.authorsText}, ${d.year}`, href: href.book(lang, d) })),
      ...sessions.docs.map((d) => ({ key: `s${d.id}`, label: t.kinds.session, title: d.title, sub: d.question, href: href.session(lang, d) })),
      ...authors.docs.map((d) => ({ key: `a${d.id}`, label: t.common.author, title: d.name, sub: d.position, href: href.author(lang, d) })),
    ]
  }

  return (
    <section className="container-x min-h-[60vh] py-12">
      <h1 className="font-display text-4xl font-bold text-lapis-950">{t.common.search}</h1>
      <form className="mt-6 flex max-w-2xl items-center gap-2 rounded-full border border-line bg-white p-1.5 pl-5">
        <Search className="h-5 w-5 text-muted" />
        <input name="q" defaultValue={query} autoFocus placeholder={t.common.searchPlaceholder} className="min-w-0 flex-1 bg-transparent py-2 text-[16px] outline-none" />
        <button className="btn-lapis">{t.common.search}</button>
      </form>
      {query && (
        <p className="mt-6 text-sm text-muted">
          “{query}” — {hits.length} {t.common.results}
        </p>
      )}
      {query && hits.length === 0 && <p className="mt-6 text-muted">{t.common.noResults}</p>}
      <ul className="mt-4 max-w-3xl divide-y divide-line">
        {hits.map((h) => (
          <li key={h.key} className="py-4">
            <TypeLabel>{h.label}</TypeLabel>
            <Link href={h.href} className="mt-1 block font-display text-lg font-bold text-lapis-900 hover:underline">
              {h.title}
            </Link>
            {h.sub && <p className="mt-0.5 line-clamp-2 text-[15px] text-muted">{h.sub}</p>}
          </li>
        ))}
      </ul>
    </section>
  )
}
