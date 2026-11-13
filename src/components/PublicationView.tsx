import Link from 'next/link'
import React from 'react'
import { BookMarked, Calendar, Clock, Download, ExternalLink, ListChecks, Sparkles } from 'lucide-react'
import type { Author, Publication } from '@/payload-types'
import { getDict, type Locale } from '@/i18n/dict'
import { formatDate } from '@/lib/format'
import { href } from '@/lib/links'
import { mediaUrl } from '@/lib/media'
import { find } from '@/lib/payload'
import { RichText, headingsOf } from './RichText'
import { Avatar, Breadcrumbs, MediaImg, TopicPills } from './ui'
import { PaperCard, PublicationKindLabel } from './cards'
import { ShareButton } from './interactive'

export async function PublicationView({ p, locale, crumbs }: { p: Publication; locale: Locale; crumbs: { label: string; href?: string }[] }) {
  const t = getDict(locale)
  const authors = (p.authors ?? []).filter((a): a is Author => typeof a === 'object')
  const toc = headingsOf(p.content)
  const pdf = mediaUrl(p.pdf)
  const related = await find<Publication>({
    collection: 'publications',
    locale,
    limit: 3,
    sort: '-publishedDate',
    where: { and: [{ id: { not_equals: p.id } }, p.series ? { series: { equals: p.series } } : { kind: { equals: p.kind } }] },
  })

  return (
    <article>
      <header className="border-b border-line bg-white">
        <div className="container-x py-10 sm:py-14">
          <Breadcrumbs items={crumbs} />
          <div className="max-w-3xl">
            <PublicationKindLabel p={p} locale={locale} />
            <h1 className="mt-3 font-display text-[2rem] font-bold leading-[1.15] text-lapis-950 sm:text-[2.7rem]">{p.title}</h1>
            {p.subtitle && <p className="mt-3 font-display text-xl text-muted">{p.subtitle}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted">
              {authors.length > 0 && (
                <span className="flex items-center gap-2">
                  <span className="flex -space-x-2">
                    {authors.map((a) => (
                      <Avatar key={a.id} author={a} size={36} />
                    ))}
                  </span>
                  <span>
                    {authors.map((a, i) => (
                      <React.Fragment key={a.id}>
                        {i > 0 && ', '}
                        <Link href={href.author(locale, a)} className="font-bold text-lapis-900 hover:underline">
                          {a.name}
                        </Link>
                      </React.Fragment>
                    ))}
                  </span>
                </span>
              )}
              {p.externalAuthors && <span className="font-bold text-lapis-900">{p.externalAuthors}</span>}
              {p.journal && <span className="italic">{p.journal}</span>}
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {p.kind === 'curated' ? new Date(p.publishedDate).getFullYear() : formatDate(p.publishedDate, locale)}
              </span>
              {p.readTime ? (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> {p.readTime} {t.common.minRead}
                </span>
              ) : null}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {pdf && (
                <a href={pdf} className="btn-lapis" download>
                  <Download className="h-4 w-4" /> {t.common.download}
                </a>
              )}
              {p.externalUrl && (
                <a href={p.externalUrl} target="_blank" rel="noreferrer" className="btn-lapis">
                  <ExternalLink className="h-4 w-4" /> {t.common.source}
                </a>
              )}
              <ShareButton label={t.common.share} />
            </div>
          </div>
        </div>
      </header>

      {p.cover && typeof p.cover === 'object' && p.kind !== 'curated' && (
        <div className="container-x -mb-4 pt-8">
          <MediaImg media={p.cover} className="aspect-[21/8] w-full rounded-2xl object-top" sizes="100vw" priority />
        </div>
      )}

      <div className="container-x grid gap-12 py-12 lg:grid-cols-[220px_minmax(0,1fr)_260px]">
        <nav className="hidden lg:block">
          {toc.length > 1 && (
            <div className="sticky top-28">
              <div className="eyebrow mb-3 text-gold-600">{locale === 'uz' ? 'Mundarija' : 'Contents'}</div>
              <ol className="space-y-2 border-l border-line text-sm">
                {toc.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="-ml-px block border-l-2 border-transparent pl-3 text-muted hover:border-gold-500 hover:text-lapis-900">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </nav>

        <div className="min-w-0 max-w-[720px]">
          {(p.summary || (p.keyPoints?.length ?? 0) > 0) && (
            <section className="mb-10 rounded-2xl border border-gold-200 bg-gold-50/60 p-6">
              {p.summary && (
                <>
                  <div className="eyebrow flex items-center gap-2 text-gold-700">
                    <Sparkles className="h-4 w-4" /> {locale === 'uz' ? 'Qisqa xulosa' : 'Short summary'}
                  </div>
                  <p className="mt-2 font-display text-[1.08rem] leading-relaxed text-lapis-950">{p.summary}</p>
                </>
              )}
              {(p.keyPoints?.length ?? 0) > 0 && (
                <>
                  <div className="eyebrow mt-5 flex items-center gap-2 text-gold-700">
                    <ListChecks className="h-4 w-4" /> {locale === 'uz' ? 'Asosiy fikrlar' : 'Key takeaways'}
                  </div>
                  <ul className="mt-2 space-y-2">
                    {p.keyPoints!.map((k) => (
                      <li key={k.id} className="flex gap-2.5 text-[15.5px] text-ink/90">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-500" /> {k.text}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          )}

          <RichText data={p.content} />

          {(p.references?.length ?? 0) > 0 && (
            <section className="mt-12 border-t border-line pt-6">
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-lapis-900">
                <BookMarked className="h-5 w-5 text-gold-500" /> {locale === 'uz' ? 'Manbalar' : 'References'}
              </h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-[15px] text-muted marker:text-gold-600">
                {p.references!.map((r) => (
                  <li key={r.id}>{r.text}</li>
                ))}
              </ol>
            </section>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          {authors.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex items-center gap-3">
                <Avatar author={a} size={48} />
                <div>
                  <Link href={href.author(locale, a)} className="font-bold text-lapis-900 hover:underline">
                    {a.name}
                  </Link>
                  <div className="text-xs text-muted">{a.position}</div>
                </div>
              </div>
              {a.bio && <p className="mt-3 line-clamp-4 text-sm text-muted">{a.bio}</p>}
            </div>
          ))}
          <div className="card p-5">
            <div className="eyebrow mb-3 text-gold-600">{t.common.topics}</div>
            <TopicPills topics={p.topics} locale={locale} max={6} />
          </div>
        </aside>
      </div>

      {related.docs.length > 0 && (
        <section className="border-t border-line bg-sand/40 py-12">
          <div className="container-x">
            <h2 className="mb-6 font-display text-2xl font-bold text-lapis-900">{locale === 'uz' ? 'Shu mavzuda yana' : 'Read next'}</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {related.docs.map((r) => (
                <PaperCard key={r.id} p={r} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
