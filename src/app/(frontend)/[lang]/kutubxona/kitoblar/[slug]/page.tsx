import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import { Download, ExternalLink } from 'lucide-react'
import type { Book } from '@/payload-types'
import { getDict, type Locale } from '@/i18n/dict'
import { find, findBySlug } from '@/lib/payload'
import { href } from '@/lib/links'
import { mediaUrl } from '@/lib/media'
import { BookCard, BookCover } from '@/components/cards'
import { Breadcrumbs, TopicPills } from '@/components/ui'

type Params = { params: Promise<{ lang: Locale; slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang, slug } = await params
  const b = await findBySlug<Book>('books', slug, lang, 1)
  return b ? { title: `${b.title} — ${b.authorsText}`, description: b.summary ?? undefined } : {}
}

export default async function BookPage({ params }: Params) {
  const { lang, slug } = await params
  const t = getDict(lang)
  const b = await findBySlug<Book>('books', slug, lang)
  if (!b) notFound()
  const more = await find<Book>({ collection: 'books', locale: lang, limit: 6, sort: '-year', where: { and: [{ category: { equals: b.category } }, { id: { not_equals: b.id } }] } })
  const file = mediaUrl(b.file)
  const facts = [
    [t.common.author, b.authorsText],
    [t.common.year, b.year],
    [t.common.category, t.bookCats[b.category]],
    [lang === 'uz' ? 'Sahifalar' : 'Pages', b.pages],
    [lang === 'uz' ? 'Nashriyot' : 'Publisher', b.publisher],
  ].filter(([, v]) => v)

  return (
    <>
      <section className="girih-bg-soft border-b border-line bg-sand/50">
        <div className="container-x grid gap-10 py-10 sm:py-14 md:grid-cols-[260px_1fr]">
          <div className="mx-auto w-[200px] md:w-full">
            <BookCover b={b} />
          </div>
          <div>
            <Breadcrumbs items={[{ label: t.nav.library, href: href.library(lang) }, { label: t.labels.books, href: href.books(lang) }, { label: b.title }]} />
            <span className="eyebrow text-gold-600">{t.bookCats[b.category]}</span>
            <h1 className="mt-2 font-display text-[2rem] font-bold leading-tight text-lapis-950 sm:text-[2.6rem]">{b.title}</h1>
            {b.titleTranslated && <p className="mt-1 font-display text-xl text-muted">{b.titleTranslated}</p>}
            <p className="mt-3 text-lg font-semibold text-lapis-800">
              {b.authorsText} · {b.year}
            </p>
            {b.summary && <p className="mt-5 max-w-2xl font-display text-[1.1rem] leading-relaxed text-ink/90">{b.summary}</p>}
            {b.whyRead && (
              <div className="mt-6 max-w-2xl rounded-xl border-l-4 border-gold-500 bg-white p-4">
                <div className="eyebrow text-gold-600">{lang === 'uz' ? 'Tahririyat tavsiyasi' : 'Why read it'}</div>
                <p className="mt-1 text-[15px] text-ink/85">{b.whyRead}</p>
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-2">
              {file ? (
                <a href={file} download className="btn-lapis">
                  <Download className="h-4 w-4" /> {t.common.download}
                </a>
              ) : null}
              {b.externalUrl && (
                <a href={b.externalUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                  <ExternalLink className="h-4 w-4" /> {t.common.whereToFind}
                </a>
              )}
            </div>
            <dl className="mt-8 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-5 text-sm sm:grid-cols-3">
              {facts.map(([k, v]) => (
                <div key={String(k)}>
                  <dt className="text-xs font-bold uppercase tracking-wider text-muted">{k}</dt>
                  <dd className="mt-0.5 font-semibold text-lapis-900">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5">
              <TopicPills topics={b.topics} locale={lang} max={5} />
            </div>
          </div>
        </div>
      </section>
      {more.docs.length > 0 && (
        <section className="container-x py-12">
          <h2 className="mb-6 font-display text-2xl font-bold text-lapis-900">{lang === 'uz' ? 'Shu boʻlimdan yana' : 'More in this section'}</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {more.docs.map((x) => (
              <BookCard key={x.id} b={x} locale={lang} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
