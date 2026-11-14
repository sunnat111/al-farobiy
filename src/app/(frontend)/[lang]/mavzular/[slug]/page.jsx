import { notFound } from 'next/navigation'
import React from 'react'
import { getDict } from '@/i18n/dict'
import { getBySlug, list } from '@/lib/api'
import { href } from '@/lib/links'
import { BookCard, ClassicCard, CourseCard, PaperCard, SessionCard } from '@/components/cards'
import { Breadcrumbs, Empty, SectionHeader } from '@/components/ui'
import { TopicIcon } from '@/components/TopicIcon'

export async function generateMetadata({ params }) {
  const { lang, slug } = await params
  const tp = await getBySlug('topics', slug, lang)
  return tp ? { title: tp.title, description: tp.description ?? undefined } : {}
}

export default async function TopicPage({ params }) {
  const { lang, slug } = await params
  const t = getDict(lang)
  const tp = await getBySlug('topics', slug, lang)
  if (!tp) notFound()
  const byTopic = { locale: lang, topic: tp.id }
  const [courses, pubs, books, classics, sessions] = await Promise.all([
    list('courses', { ...byTopic, sort: 'order' }),
    list('publications', { ...byTopic, sort: '-publishedDate' }),
    list('books', { ...byTopic, sort: '-year', limit: 12 }),
    list('classical-texts', { ...byTopic, sort: 'order' }),
    list('sessions', { ...byTopic, sort: '-date' }),
  ])
  const total = courses.docs.length + pubs.docs.length + books.docs.length + classics.docs.length + sessions.docs.length

  return (
    <>
      <section className="girih-bg-soft border-b border-line bg-sand/50">
        <div className="container-x py-12">
          <Breadcrumbs items={[{ label: t.siteName, href: href.home(lang) }, { label: t.labels.topics }, { label: tp.title }]} />
          <div className="flex items-center gap-4">
            <TopicIcon topic={tp} size="lg" />
            <div>
              <h1 className="font-display text-[2.2rem] font-bold leading-tight text-lapis-950 sm:text-5xl">{tp.title}</h1>
              {tp.description && <p className="mt-1 text-lg text-muted">{tp.description}</p>}
            </div>
          </div>
          <p className="mt-4 text-sm font-semibold text-lapis-700">
            {total} {lang === 'uz' ? 'ta material' : 'items'}
          </p>
        </div>
      </section>
      <div className="container-x space-y-14 py-12">
        {total === 0 && <Empty>{t.common.noResults}</Empty>}
        {courses.docs.length > 0 && (
          <section>
            <SectionHeader title={t.nav.courses} align="left" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {courses.docs.map((c) => (
                <CourseCard key={c.id} c={c} locale={lang} />
              ))}
            </div>
          </section>
        )}
        {pubs.docs.length > 0 && (
          <section>
            <SectionHeader title={lang === 'uz' ? 'Tadqiqot va maqolalar' : 'Research & articles'} align="left" />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {pubs.docs.map((p) => (
                <PaperCard key={p.id} p={p} locale={lang} />
              ))}
            </div>
          </section>
        )}
        {classics.docs.length > 0 && (
          <section>
            <SectionHeader title={t.labels.classics} align="left" />
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {classics.docs.map((c) => (
                <ClassicCard key={c.id} c={c} locale={lang} />
              ))}
            </div>
          </section>
        )}
        {books.docs.length > 0 && (
          <section>
            <SectionHeader title={t.labels.books} href={`${href.books(lang)}?mavzu=${tp.slug}`} linkLabel={t.common.viewAll} align="left" />
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
              {books.docs.map((b) => (
                <BookCard key={b.id} b={b} locale={lang} />
              ))}
            </div>
          </section>
        )}
        {sessions.docs.length > 0 && (
          <section>
            <SectionHeader title={t.labels.sessions} align="left" />
            <div className="grid gap-4 md:grid-cols-2">
              {sessions.docs.map((s) => (
                <SessionCard key={s.id} s={s} locale={lang} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
