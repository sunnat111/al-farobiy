import { notFound } from 'next/navigation'
import React from 'react'
import { Globe, Mail, MapPin, Send } from 'lucide-react'
import { getDict } from '@/i18n/dict'
import { getBySlug, list } from '@/lib/api'
import { href } from '@/lib/links'
import { CourseCard, PaperCard, SessionCard } from '@/components/cards'
import { Breadcrumbs, MediaImg, SectionHeader } from '@/components/ui'

const kindLabel = {
  uz: { team: 'Jamoa aʼzosi', mentor: 'Mentor', researcher: 'Tadqiqotchi', student: 'Yosh muallif', guest: 'Mehmon spiker' },
  en: { team: 'Team member', mentor: 'Mentor', researcher: 'Researcher', student: 'Young author', guest: 'Guest speaker' },
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params
  const a = await getBySlug('authors', slug, lang)
  return a ? { title: a.name, description: a.bio ?? undefined } : {}
}

export default async function AuthorPage({ params }) {
  const { lang, slug } = await params
  const t = getDict(lang)
  const a = await getBySlug('authors', slug, lang)
  if (!a) notFound()
  const [pubs, courses, sessions, judged] = await Promise.all([
    list('publications', { locale: lang, author: a.id, sort: '-publishedDate' }),
    list('courses', { locale: lang, author: a.id, sort: 'order' }),
    list('sessions', { locale: lang, author: a.id, sort: '-date' }),
    list('competitions', { locale: lang, author: a.id }),
  ])
  return (
    <>
      <section className="girih-bg-soft border-b border-line bg-sand/50">
        <div className="container-x py-12">
          <Breadcrumbs items={[{ label: t.siteName, href: href.home(lang) }, { label: t.common.authors }, { label: a.name }]} />
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <span className="h-28 w-28 shrink-0 overflow-hidden rounded-full ring-4 ring-white">
              <MediaImg media={a.photo} className="h-full w-full" sizes="224px" alt={a.name} priority />
            </span>
            <div>
              <span className="eyebrow text-gold-600">{kindLabel[lang][a.kind]}</span>
              <h1 className="mt-1 font-display text-[2.2rem] font-bold leading-tight text-lapis-950">{a.name}</h1>
              {a.position && <p className="font-semibold text-lapis-700">{a.position}</p>}
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted">
                {a.region && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {a.region}
                  </span>
                )}
                {a.links?.email && (
                  <a href={`mailto:${a.links.email}`} className="inline-flex items-center gap-1 hover:underline">
                    <Mail className="h-4 w-4" /> Email
                  </a>
                )}
                {a.links?.telegram && (
                  <a href={a.links.telegram} className="inline-flex items-center gap-1 hover:underline">
                    <Send className="h-4 w-4" /> Telegram
                  </a>
                )}
                {a.links?.website && (
                  <a href={a.links.website} className="inline-flex items-center gap-1 hover:underline">
                    <Globe className="h-4 w-4" /> Web
                  </a>
                )}
              </div>
            </div>
          </div>
          {a.bio && <p className="mt-6 max-w-3xl font-display text-lg leading-relaxed text-ink/85">{a.bio}</p>}
          {judged.docs.length > 0 && (
            <p className="mt-3 text-sm text-muted">
              {lang === 'uz' ? 'Hakamlik qilgan tanlovlar' : 'Judged competitions'}: {judged.docs.map((c) => `#${c.number}`).join(', ')}
            </p>
          )}
        </div>
      </section>
      <div className="container-x space-y-14 py-12">
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
            <SectionHeader title={lang === 'uz' ? 'Nashrlar' : 'Publications'} align="left" />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {pubs.docs.map((p) => (
                <PaperCard key={p.id} p={p} locale={lang} />
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
