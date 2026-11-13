'use client'

/**
 * Library filtering and search done in the browser, so they also work on a static host (GitHub Pages).
 * The server passes the full (small) list; the URL query string holds the active filters.
 */
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import type { Author, Book, Publication, Topic } from '@/payload-types'
import { getDict, type Locale } from '@/i18n/dict'
import { BookCard, PaperCard } from './cards'
import { Empty, TypeLabel } from './ui'
import { FilterSelect, QueryLink } from './interactive'

type Initial = Record<string, string | undefined>

/** Reads filters from the URL after hydration; uses the server's values before that. */
function useQuery(initial: Initial) {
  const sp = useSearchParams()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return (k: string) => (mounted ? (sp?.get(k) ?? '') : (initial[k] ?? ''))
}

const norm = (s: string | null | undefined) =>
  (s ?? '')
    .toLowerCase()
    .replace(/[ʻʼ‘’'`]/g, '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')

const topicSlugs = (topics?: (number | Topic)[] | null) => (topics ?? []).map((t) => (typeof t === 'object' ? t.slug : '')).filter(Boolean) as string[]

/* ------------------------------------------------------------------ books */

const decades = [
  { value: '2010', label: '2010 –', from: 2010, to: 3000 },
  { value: '1990', label: '1990 – 2009', from: 1990, to: 2009 },
  { value: '1950', label: '1950 – 1989', from: 1950, to: 1989 },
  { value: '0', label: '– 1949', from: -5000, to: 1949 },
]

export function BookBrowser({ books, topics, locale, initial }: { books: Book[]; topics: Topic[]; locale: Locale; initial: Initial }) {
  const t = getDict(locale)
  const q = useQuery(initial)
  const [bolim, mavzu, davr, tartib, text] = ['bolim', 'mavzu', 'davr', 'tartib', 'q'].map(q)

  const list = useMemo(() => {
    const d = decades.find((x) => x.value === davr)
    const needle = norm(text)
    const out = books.filter(
      (b) =>
        (!bolim || b.category === bolim) &&
        (!mavzu || topicSlugs(b.topics).includes(mavzu)) &&
        (!d || (b.year >= d.from && b.year <= d.to)) &&
        (!needle || norm(`${b.title} ${b.authorsText} ${b.titleTranslated ?? ''}`).includes(needle)),
    )
    return out.sort((a, b) => (tartib === 'yil' ? b.year - a.year : tartib === 'eski' ? a.year - b.year : a.title.localeCompare(b.title)))
  }, [books, bolim, mavzu, davr, tartib, text])

  const chip = (active: boolean) => `shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold ${active ? 'bg-lapis-700 text-white' : 'border border-line bg-white text-lapis-800 hover:border-lapis-300'}`

  return (
    <>
      <div className="border-b border-line bg-paper/95">
        <div className="no-scrollbar container-x flex gap-2 overflow-x-auto py-3">
          <QueryLink query="" className={chip(!bolim)}>
            {t.common.all}
          </QueryLink>
          {Object.entries(t.bookCats).map(([k, v]) => (
            <QueryLink key={k} query={`?bolim=${k}`} className={chip(bolim === k)}>
              {v}
            </QueryLink>
          ))}
        </div>
      </div>
      <section className="container-x grid gap-8 py-10 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-4">
          <form className="block">
            {bolim && <input type="hidden" name="bolim" value={bolim} />}
            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted">{t.common.search}</span>
            <input key={text} name="q" defaultValue={text} placeholder={locale === 'uz' ? 'Nomi yoki muallif…' : 'Title or author…'} className="field py-2" />
          </form>
          <FilterSelect name="mavzu" label={t.common.topic} value={mavzu} options={[{ value: '', label: t.common.all }, ...topics.map((tp) => ({ value: tp.slug ?? '', label: tp.title }))]} />
          <FilterSelect name="davr" label={t.common.year} value={davr} options={[{ value: '', label: t.common.all }, ...decades.map(({ value, label }) => ({ value, label }))]} />
          <FilterSelect
            name="tartib"
            label={t.common.filter}
            value={tartib}
            options={[
              { value: '', label: locale === 'uz' ? 'Alifbo boʻyicha' : 'A–Z' },
              { value: 'yil', label: locale === 'uz' ? 'Eng yangi' : 'Newest' },
              { value: 'eski', label: locale === 'uz' ? 'Eng eski' : 'Oldest' },
            ]}
          />
          {(text || mavzu || davr || bolim || tartib) && (
            <QueryLink query="" className="inline-block text-sm font-bold text-terracotta-500 hover:underline">
              × {t.common.reset}
            </QueryLink>
          )}
        </aside>
        <div>
          <p className="mb-6 text-sm text-muted">
            {list.length} {t.common.results}
          </p>
          {list.length ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 xl:grid-cols-5">
              {list.map((b) => (
                <BookCard key={b.id} b={b} locale={locale} />
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

/* ----------------------------------------------------------- publications */

export function PublicationBrowser({
  docs,
  kinds,
  locale,
  initial,
  showKindFilter,
}: {
  docs: Publication[]
  kinds: Publication['kind'][]
  locale: Locale
  initial: Initial
  showKindFilter?: boolean
}) {
  const t = getDict(locale)
  const q = useQuery(initial)
  const [tur, muallif, yil, mavzu, text] = ['tur', 'muallif', 'yil', 'mavzu', 'q'].map(q)

  const { years, authors, topics } = useMemo(() => {
    const a = new Map<string, string>()
    const tp = new Map<string, string>()
    docs.forEach((d) => {
      ;(d.authors ?? []).forEach((x) => typeof x === 'object' && x.slug && a.set(x.slug, (x as Author).name))
      ;(d.topics ?? []).forEach((x) => typeof x === 'object' && x.slug && tp.set(x.slug, (x as Topic).title))
    })
    return {
      years: [...new Set(docs.map((d) => new Date(d.publishedDate).getFullYear()))].sort((x, y) => y - x),
      authors: [...a],
      topics: [...tp],
    }
  }, [docs])

  const list = useMemo(() => {
    const needle = norm(text)
    return docs.filter(
      (d) =>
        (!tur || d.kind === tur) &&
        (!muallif || (d.authors ?? []).some((a) => typeof a === 'object' && a.slug === muallif)) &&
        (!yil || new Date(d.publishedDate).getFullYear() === Number(yil)) &&
        (!mavzu || topicSlugs(d.topics).includes(mavzu)) &&
        (!needle || norm(`${d.title} ${d.excerpt ?? ''} ${d.externalAuthors ?? ''}`).includes(needle)),
    )
  }, [docs, tur, muallif, yil, mavzu, text])

  return (
    <section className="container-x grid gap-8 py-10 lg:grid-cols-[240px_1fr]">
      <aside className="space-y-4">
        <form>
          <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted">{t.common.search}</span>
          <input key={text} name="q" defaultValue={text} className="field py-2" placeholder={locale === 'uz' ? 'Sarlavha yoki muallif…' : 'Title or author…'} />
        </form>
        {showKindFilter && (
          <FilterSelect name="tur" label={locale === 'uz' ? 'Turi' : 'Type'} value={tur} options={[{ value: '', label: t.common.all }, ...kinds.map((k) => ({ value: k, label: t.kinds[k] }))]} />
        )}
        <FilterSelect name="muallif" label={t.common.author} value={muallif} options={[{ value: '', label: t.common.all }, ...authors.map(([value, label]) => ({ value, label }))]} />
        <FilterSelect name="yil" label={t.common.year} value={yil} options={[{ value: '', label: t.common.all }, ...years.map((y) => ({ value: String(y), label: String(y) }))]} />
        <FilterSelect name="mavzu" label={t.common.topic} value={mavzu} options={[{ value: '', label: t.common.all }, ...topics.map(([value, label]) => ({ value, label }))]} />
        {(tur || muallif || yil || mavzu || text) && (
          <QueryLink query="" className="inline-block text-sm font-bold text-terracotta-500 hover:underline">
            × {t.common.reset}
          </QueryLink>
        )}
      </aside>
      <div>
        <p className="mb-5 text-sm text-muted">
          {list.length} {t.common.results}
        </p>
        {list.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {list.map((p) => (
              <PaperCard key={p.id} p={p} locale={locale} />
            ))}
          </div>
        ) : (
          <Empty>{t.common.noResults}</Empty>
        )}
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- search */

export type SearchItem = { key: string; label: string; title: string; sub?: string | null; href: string; text: string }

export function SearchClient({ items, locale, initial }: { items: SearchItem[]; locale: Locale; initial: Initial }) {
  const t = getDict(locale)
  const q = useQuery(initial)('q').trim()
  const hits = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean)
    if (!words.length) return []
    return items.filter((it) => {
      const hay = norm(`${it.title} ${it.sub ?? ''} ${it.text}`)
      return words.every((w) => hay.includes(w))
    })
  }, [items, q])

  return (
    <>
      <form className="mt-6 flex max-w-2xl items-center gap-2 rounded-full border border-line bg-white p-1.5 pl-5">
        <Search className="h-5 w-5 text-muted" />
        <input key={q} name="q" defaultValue={q} autoFocus placeholder={t.common.searchPlaceholder} className="min-w-0 flex-1 bg-transparent py-2 text-[16px] outline-none" />
        <button className="btn-lapis">{t.common.search}</button>
      </form>
      {q && (
        <p className="mt-6 text-sm text-muted">
          “{q}” — {hits.length} {t.common.results}
        </p>
      )}
      {q && hits.length === 0 && <p className="mt-6 text-muted">{t.common.noResults}</p>}
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
    </>
  )
}
