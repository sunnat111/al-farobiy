import Link from 'next/link'
import React, { Suspense } from 'react'
import type { Where } from 'payload'
import type { Author, Publication, Topic } from '@/payload-types'
import { getDict, type Locale } from '@/i18n/dict'
import { find } from '@/lib/payload'
import { PaperCard } from './cards'
import { Empty } from './ui'
import { FilterSelect } from './interactive'

/** Filterable list of publications (author, year, topic, type, text). */
export async function PublicationList({
  locale,
  kinds,
  sp,
  basePath,
  showKindFilter = false,
}: {
  locale: Locale
  kinds: Publication['kind'][]
  sp: Record<string, string | undefined>
  basePath: string
  showKindFilter?: boolean
}) {
  const t = getDict(locale)
  const all = await find<Publication>({ collection: 'publications', locale, sort: '-publishedDate', limit: 500, depth: 1, where: { kind: { in: kinds } } })
  const years = [...new Set(all.docs.map((d) => new Date(d.publishedDate).getFullYear()))].sort((a, b) => b - a)
  const authorMap = new Map<string, string>()
  all.docs.forEach((d) => (d.authors ?? []).forEach((a) => typeof a === 'object' && a.slug && authorMap.set(a.slug, (a as Author).name)))
  const topicMap = new Map<string, string>()
  all.docs.forEach((d) => (d.topics ?? []).forEach((tp) => typeof tp === 'object' && tp.slug && topicMap.set(tp.slug, (tp as Topic).title)))

  const and: Where[] = [{ kind: { in: sp.tur && kinds.includes(sp.tur as Publication['kind']) ? [sp.tur] : kinds } }]
  if (sp.muallif) and.push({ 'authors.slug': { equals: sp.muallif } })
  if (sp.mavzu) and.push({ 'topics.slug': { equals: sp.mavzu } })
  if (sp.yil) and.push({ publishedDate: { greater_than_equal: `${sp.yil}-01-01T00:00:00.000Z` } }, { publishedDate: { less_than: `${Number(sp.yil) + 1}-01-01T00:00:00.000Z` } })
  if (sp.q) and.push({ or: [{ title: { like: sp.q } }, { excerpt: { like: sp.q } }, { externalAuthors: { like: sp.q } }] })
  const { docs } = await find<Publication>({ collection: 'publications', locale, sort: '-publishedDate', limit: 200, where: { and } })
  const active = Boolean(sp.muallif || sp.mavzu || sp.yil || sp.q || sp.tur)

  return (
    <section className="container-x grid gap-8 py-10 lg:grid-cols-[240px_1fr]">
      <aside className="space-y-4">
        <form>
          <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted">{t.common.search}</span>
          <input name="q" defaultValue={sp.q} className="field py-2" placeholder={locale === 'uz' ? 'Sarlavha yoki muallif…' : 'Title or author…'} />
        </form>
        <Suspense>
          {showKindFilter && (
            <FilterSelect
              name="tur"
              label={locale === 'uz' ? 'Turi' : 'Type'}
              value={sp.tur ?? ''}
              options={[{ value: '', label: t.common.all }, ...kinds.map((k) => ({ value: k, label: t.kinds[k] }))]}
            />
          )}
          <FilterSelect name="muallif" label={t.common.author} value={sp.muallif ?? ''} options={[{ value: '', label: t.common.all }, ...[...authorMap].map(([value, label]) => ({ value, label }))]} />
          <FilterSelect name="yil" label={t.common.year} value={sp.yil ?? ''} options={[{ value: '', label: t.common.all }, ...years.map((y) => ({ value: String(y), label: String(y) }))]} />
          <FilterSelect name="mavzu" label={t.common.topic} value={sp.mavzu ?? ''} options={[{ value: '', label: t.common.all }, ...[...topicMap].map(([value, label]) => ({ value, label }))]} />
        </Suspense>
        {active && (
          <Link href={basePath} className="inline-block text-sm font-bold text-terracotta-500 hover:underline">
            × {t.common.reset}
          </Link>
        )}
      </aside>
      <div>
        <p className="mb-5 text-sm text-muted">
          {docs.length} {t.common.results}
        </p>
        {docs.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {docs.map((p) => (
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
