import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { BookMarked, BookOpen, FileText, ScrollText } from 'lucide-react'
import type { Book, ClassicalText, Publication } from '@/payload-types'
import { getDict, type Locale } from '@/i18n/dict'
import { count, find } from '@/lib/payload'
import { href } from '@/lib/links'
import { withBase } from '@/lib/site'
import { BookCard, ClassicCard, LibraryTile, PaperCard } from '@/components/cards'
import { PageHero, SectionHeader } from '@/components/ui'

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params
  return { title: getDict(lang).nav.library }
}

export default async function LibraryPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const t = getDict(lang)
  const [books, classics, articles, briefs, cBooks, cClassics, cArticles, cBriefs] = await Promise.all([
    find<Book>({ collection: 'books', locale: lang, sort: '-year', limit: 12 }),
    find<ClassicalText>({ collection: 'classical-texts', locale: lang, sort: 'order', limit: 4 }),
    find<Publication>({ collection: 'publications', locale: lang, sort: '-publishedDate', limit: 3, where: { kind: { in: ['article', 'curated'] } } }),
    find<Publication>({ collection: 'publications', locale: lang, sort: '-publishedDate', limit: 3, where: { kind: { equals: 'brief' } } }),
    count('books'),
    count('classical-texts'),
    count('publications', { kind: { in: ['article', 'curated'] } }),
    count('publications', { kind: { equals: 'brief' } }),
  ])
  const cats = Object.entries(t.bookCats)
  return (
    <>
      <PageHero
        eyebrow={t.nav.library}
        title={lang === 'uz' ? 'Kutubxona va ilmiy depozitariy' : 'Library & Research Repository'}
        intro={
          lang === 'uz'
            ? 'Zamonaviy kitoblar, mumtoz asarlar, ilmiy maqolalar va siyosiy tahlilnomalar — muallif, yil va mavzu boʻyicha tartiblangan toʻrt boʻlim.'
            : 'Modern books, classical texts, research papers and policy briefs — four sections you can filter by author, year and topic.'
        }
        crumbs={[{ label: t.siteName, href: href.home(lang) }, { label: t.nav.library }]}
      >
        <form action={withBase(href.search(lang))} className="mt-7 flex max-w-xl items-center gap-2 rounded-full bg-white p-1.5 pl-5">
          <input name="q" placeholder={t.common.searchPlaceholder} className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-ink outline-none" />
          <button className="btn-lapis shrink-0">{t.common.search}</button>
        </form>
      </PageHero>

      <section className="container-x py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <LibraryTile title={`I. ${t.labels.books}`} desc={t.navDesc.books} href={href.books(lang)} count={cBooks} icon={BookOpen} tone="bg-lapis-50 text-lapis-700" />
          <LibraryTile title={`II. ${t.labels.classics}`} desc={t.navDesc.classics} href={href.classics(lang)} count={cClassics} icon={ScrollText} tone="bg-gold-50 text-gold-700" />
          <LibraryTile title={`III. ${t.labels.articles}`} desc={t.navDesc.articles} href={href.articles(lang)} count={cArticles} icon={FileText} tone="bg-plum-50 text-plum-800" />
          <LibraryTile title={`IV. ${t.labels.briefs}`} desc={t.navDesc.briefs} href={href.briefs(lang)} count={cBriefs} icon={BookMarked} tone="bg-emerald-50 text-emerald-800" />
        </div>
      </section>

      <section className="container-x pb-12">
        <SectionHeader title={`I. ${t.labels.books}`} href={href.books(lang)} linkLabel={t.common.viewAll} align="left" />
        <div className="mb-8 flex flex-wrap gap-2">
          {cats.map(([k, v]) => (
            <Link key={k} href={`${href.books(lang)}?bolim=${k}`} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-semibold text-lapis-800 hover:border-lapis-300">
              {v}
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4 lg:grid-cols-6">
          {books.docs.map((b) => (
            <BookCard key={b.id} b={b} locale={lang} />
          ))}
        </div>
      </section>

      <section className="bg-lapis-950 py-12">
        <div className="container-x">
          <SectionHeader title={`II. ${t.labels.classics}`} href={href.classics(lang)} linkLabel={t.common.viewAll} align="left" light />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {classics.docs.map((c) => (
              <ClassicCard key={c.id} c={c} locale={lang} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-12">
        <SectionHeader title={`III. ${t.labels.articles}`} href={href.articles(lang)} linkLabel={t.common.viewAll} align="left" />
        <div className="grid gap-5 md:grid-cols-3">
          {articles.docs.map((p) => (
            <PaperCard key={p.id} p={p} locale={lang} />
          ))}
        </div>
      </section>

      <section className="container-x pb-4">
        <SectionHeader title={`IV. ${t.labels.briefs}`} href={href.briefs(lang)} linkLabel={t.common.viewAll} align="left" />
        <div className="grid gap-5 md:grid-cols-3">
          {briefs.docs.map((p) => (
            <PaperCard key={p.id} p={p} locale={lang} />
          ))}
        </div>
      </section>
    </>
  )
}
