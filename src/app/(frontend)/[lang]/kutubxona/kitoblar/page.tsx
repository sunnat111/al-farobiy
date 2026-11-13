import type { Metadata } from 'next'
import Link from 'next/link'
import React, { Suspense } from 'react'
import type { Where } from 'payload'
import type { Book, Topic } from '@/payload-types'
import { getDict, type Locale } from '@/i18n/dict'
import { find } from '@/lib/payload'
import { href } from '@/lib/links'
import { BookCard } from '@/components/cards'
import { Empty, PageHero } from '@/components/ui'
import { FilterSelect } from '@/components/interactive'

type Props = { params: Promise<{ lang: Locale }>; searchParams: Promise<Record<string, string | undefined>> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  return { title: getDict(lang).labels.books }
}

const decades = [
  { value: '2010', label: '2010 –' },
  { value: '1990', label: '1990 – 2009' },
  { value: '1950', label: '1950 – 1989' },
  { value: '0', label: '– 1949' },
]

export default async function BooksPage({ params, searchParams }: Props) {
  const { lang } = await params
  const sp = await searchParams
  const t = getDict(lang)
  const and: Where[] = []
  if (sp.bolim) and.push({ category: { equals: sp.bolim } })
  if (sp.mavzu) and.push({ 'topics.slug': { equals: sp.mavzu } })
  if (sp.davr) {
    const from = Number(sp.davr)
    const to = from === 2010 ? 3000 : from === 1990 ? 2009 : from === 1950 ? 1989 : 1949
    and.push({ year: { greater_than_equal: from === 0 ? -5000 : from } }, { year: { less_than_equal: to } })
  }
  if (sp.q) and.push({ or: [{ title: { like: sp.q } }, { authorsText: { like: sp.q } }, { titleTranslated: { like: sp.q } }] })
  const sort = sp.tartib === 'yil' ? '-year' : sp.tartib === 'eski' ? 'year' : 'title'
  const [{ docs }, topics] = await Promise.all([
    find<Book>({ collection: 'books', locale: lang, sort, limit: 200, where: and.length ? { and } : undefined }),
    find<Topic>({ collection: 'topics', locale: lang, sort: 'order', depth: 0 }),
  ])
  const cats = Object.entries(t.bookCats)

  return (
    <>
      <PageHero
        eyebrow={`${t.nav.library} · I`}
        title={t.labels.books}
        intro={t.navDesc.books}
        crumbs={[{ label: t.nav.library, href: href.library(lang) }, { label: t.labels.books }]}
      />
      <div className="border-b border-line bg-paper/95 backdrop-blur">
        <div className="no-scrollbar container-x flex gap-2 overflow-x-auto py-3">
          <Link href={href.books(lang)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold ${!sp.bolim ? 'bg-lapis-700 text-white' : 'border border-line bg-white text-lapis-800'}`}>
            {t.common.all}
          </Link>
          {cats.map(([k, v]) => (
            <Link key={k} href={`${href.books(lang)}?bolim=${k}`} className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold ${sp.bolim === k ? 'bg-lapis-700 text-white' : 'border border-line bg-white text-lapis-800 hover:border-lapis-300'}`}>
              {v}
            </Link>
          ))}
        </div>
      </div>
      <section className="container-x grid gap-8 py-10 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-4">
          <form className="block">
            {sp.bolim && <input type="hidden" name="bolim" value={sp.bolim} />}
            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted">{t.common.search}</span>
            <input name="q" defaultValue={sp.q} placeholder={lang === 'uz' ? 'Nomi yoki muallif…' : 'Title or author…'} className="field py-2" />
          </form>
          <Suspense>
            <FilterSelect name="mavzu" label={t.common.topic} value={sp.mavzu ?? ''} options={[{ value: '', label: t.common.all }, ...topics.docs.map((tp) => ({ value: tp.slug ?? '', label: tp.title }))]} />
            <FilterSelect name="davr" label={t.common.year} value={sp.davr ?? ''} options={[{ value: '', label: t.common.all }, ...decades]} />
            <FilterSelect
              name="tartib"
              label={t.common.filter}
              value={sp.tartib ?? ''}
              options={[
                { value: '', label: lang === 'uz' ? 'Alifbo boʻyicha' : 'A–Z' },
                { value: 'yil', label: lang === 'uz' ? 'Eng yangi' : 'Newest' },
                { value: 'eski', label: lang === 'uz' ? 'Eng eski' : 'Oldest' },
              ]}
            />
          </Suspense>
          {(sp.q || sp.mavzu || sp.davr || sp.bolim) && (
            <Link href={href.books(lang)} className="inline-block text-sm font-bold text-terracotta-500 hover:underline">
              × {t.common.reset}
            </Link>
          )}
        </aside>
        <div>
          <p className="mb-6 text-sm text-muted">
            {docs.length} {t.common.results}
          </p>
          {docs.length ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 xl:grid-cols-5">
              {docs.map((b) => (
                <BookCard key={b.id} b={b} locale={lang} />
              ))}
            </div>
          ) : (
            <Empty>{t.common.noResults}</Empty>
          )}
        </div>
      </section>
    </>
  )
}
