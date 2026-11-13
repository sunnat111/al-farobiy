import Link from 'next/link'
import React from 'react'
import { ArrowUpRight, BookOpen, Calendar, Clock, FileText, MapPin, Mic, PenLine, Trophy, Users } from 'lucide-react'
import type { Book, ClassicalText, Competition, Course, Publication, Session } from '@/payload-types'
import { getDict, type Locale } from '@/i18n/dict'
import { href } from '@/lib/links'
import { formatDate, dayMonth, isPast } from '@/lib/format'
import { AuthorLine, MediaImg, TopicPills, TypeLabel } from './ui'

const kindTone = { research: 'turquoise', article: 'lapis', curated: 'plum', brief: 'emerald' } as const

export function PublicationKindLabel({ p, locale }: { p: Publication; locale: Locale }) {
  const t = getDict(locale)
  const label = p.kind === 'research' && p.series ? (p.series === 'national-statehood' ? t.labels.statehood : p.series === 'islamic-liberal-democracy' ? t.labels.ild : t.kinds.research) : t.kinds[p.kind]
  return <TypeLabel tone={kindTone[p.kind]}>{label}</TypeLabel>
}

/** Horizontal list item: thumbnail + type label + title + excerpt. */
export function PublicationRow({ p, locale, showImage = true }: { p: Publication; locale: Locale; showImage?: boolean }) {
  const t = getDict(locale)
  return (
    <article className="group flex gap-4 py-4">
      {showImage && (
        <Link href={href.publication(locale, p)} className="hidden shrink-0 overflow-hidden rounded-lg sm:block">
          <MediaImg media={p.cover} className="h-[84px] w-[128px] transition duration-300 group-hover:scale-105" sizes="160px" />
        </Link>
      )}
      <div className="min-w-0">
        <PublicationKindLabel p={p} locale={locale} />
        <h3 className="mt-1 font-display text-lg font-bold leading-snug text-lapis-900">
          <Link href={href.publication(locale, p)} className="hover:underline decoration-gold-500 underline-offset-4">
            {p.title}
          </Link>
        </h3>
        {p.excerpt && <p className="mt-1 line-clamp-2 text-[15px] text-muted">{p.excerpt}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <AuthorLine authors={p.authors} external={p.externalAuthors} locale={locale} className="text-xs" />
          {p.readTime ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {p.readTime} {t.common.minRead}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}

/** Paper card with a document icon (no photo) — like a library index card. */
export function PaperCard({ p, locale }: { p: Publication; locale: Locale }) {
  const t = getDict(locale)
  return (
    <article className="card group flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px_rgba(20,39,94,0.25)]">
      <div className="mb-4 flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-lapis-50 text-lapis-700">
          <FileText className="h-5 w-5" />
        </span>
        <PublicationKindLabel p={p} locale={locale} />
      </div>
      <h3 className="font-display text-[1.2rem] font-bold leading-snug text-lapis-900">
        <Link href={href.publication(locale, p)} className="after:absolute after:inset-0 relative">
          {p.title}
        </Link>
      </h3>
      {p.excerpt && <p className="mt-2 line-clamp-3 text-[15px] text-muted">{p.excerpt}</p>}
      <div className="mt-auto pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-xs text-muted">
          <span className="font-semibold text-lapis-800">
            {(p.authors ?? []).map((a) => (typeof a === 'object' ? a.name : '')).filter(Boolean).join(', ') || p.externalAuthors}
          </span>
          <span>{p.kind === 'curated' && p.journal ? p.journal : formatDate(p.publishedDate, locale)}</span>
        </div>
        {p.readTime ? <span className="sr-only">{p.readTime} {t.common.minRead}</span> : null}
      </div>
    </article>
  )
}

export function FeatureCard({ p, locale }: { p: Publication; locale: Locale }) {
  const t = getDict(locale)
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-lapis-900 text-white">
      <MediaImg media={p.cover} className="aspect-[16/9] w-full opacity-90 transition duration-500 group-hover:scale-[1.02]" sizes="(min-width: 1024px) 60vw, 100vw" priority />
      <div className="p-6 sm:p-8">
        <div className="eyebrow text-gold-300">{t.home.spotlight} · {p.kind === 'research' ? t.kinds.research : t.kinds[p.kind]}</div>
        <h3 className="mt-2 font-display text-2xl font-bold leading-tight sm:text-[2rem]">
          <Link href={href.publication(locale, p)} className="hover:underline decoration-gold-400 underline-offset-4">
            {p.title}
          </Link>
        </h3>
        {p.excerpt && <p className="mt-3 font-display text-[17px] leading-relaxed text-lapis-100">{p.excerpt}</p>}
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-lapis-200">
          <span>{(p.authors ?? []).map((a) => (typeof a === 'object' ? a.name : '')).join(', ')}</span>
          {p.readTime ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" /> {p.readTime} {t.common.minRead}
            </span>
          ) : null}
          <Link href={href.publication(locale, p)} className="btn-gold ml-auto">
            {t.common.read} <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export function CourseCard({ c, locale }: { c: Course; locale: Locale }) {
  const t = getDict(locale)
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px_rgba(20,39,94,0.25)]">
      <div className="relative overflow-hidden">
        <MediaImg media={c.cover} className="aspect-[16/9] w-full transition duration-500 group-hover:scale-[1.03]" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
        {c.code && <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold tracking-wider text-lapis-800">{c.code}</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted">
          <span className="rounded-full bg-gold-50 px-2 py-0.5 text-gold-700">{c.level ? t.levels[c.level] : ''}</span>
          <span>{c.duration}</span>
          <span>· {c.lessons?.length ?? 0} {t.common.lessons}</span>
        </div>
        <h3 className="mt-3 font-display text-[1.2rem] font-bold leading-snug text-lapis-900">
          <Link href={href.course(locale, c)} className="relative after:absolute after:inset-0">
            {c.title}
          </Link>
        </h3>
        {c.tagline && <p className="mt-2 line-clamp-2 text-[15px] text-muted">{c.tagline}</p>}
        <div className="mt-auto pt-4 text-sm font-semibold text-lapis-800">
          {(c.instructors ?? []).map((a) => (typeof a === 'object' ? a.name : '')).join(', ')}
        </div>
      </div>
    </article>
  )
}

export function BookCover({ b, className = '' }: { b: Book; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative overflow-hidden rounded-[3px_8px_8px_3px] shadow-[6px_8px_18px_-6px_rgba(9,19,47,0.45)] ring-1 ring-black/5">
        <MediaImg media={b.cover} className="aspect-[2/3] w-full" sizes="(min-width: 1024px) 180px, 40vw" alt={b.title} />
        <span className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/25 to-transparent" />
      </div>
    </div>
  )
}

export function BookCard({ b, locale }: { b: Book; locale: Locale }) {
  const t = getDict(locale)
  return (
    <article className="group relative flex flex-col">
      <div className="relative transition duration-300 group-hover:-translate-y-1">
        <BookCover b={b} />
        {b.badge && (
          <span className="absolute -right-1.5 top-3 rounded-full bg-gold-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-lapis-950 shadow">
            {t.badges[b.badge]}
          </span>
        )}
      </div>
      <h3 className="mt-3 line-clamp-2 font-display text-[15px] font-bold leading-snug text-lapis-900">
        <Link href={href.book(locale, b)} className="after:absolute after:inset-0">
          {b.title}
        </Link>
      </h3>
      <p className="mt-0.5 line-clamp-1 text-xs text-muted">
        {b.authorsText} · {b.year}
      </p>
    </article>
  )
}

export function ClassicCard({ c, locale }: { c: ClassicalText; locale: Locale }) {
  return (
    <article className="group relative overflow-hidden rounded-xl bg-lapis-900">
      <MediaImg media={c.cover} className="aspect-[9/11] w-full transition duration-500 group-hover:scale-[1.03]" sizes="(min-width: 1024px) 22vw, 50vw" alt={c.thinker ?? ''} />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-lapis-950 via-lapis-950/85 to-transparent p-4 pt-14">
        <div className="eyebrow text-gold-300">{c.thinker}</div>
        <h3 className="mt-1 font-display text-lg font-bold leading-snug text-white">
          <Link href={href.classic(locale, c)} className="after:absolute after:inset-0">
            {c.title}
          </Link>
        </h3>
      </div>
    </article>
  )
}

export function SessionCard({ s, locale }: { s: Session; locale: Locale }) {
  const t = getDict(locale)
  const past = isPast(s.date)
  const dm = dayMonth(s.date, locale)
  return (
    <article className="card group relative flex gap-4 p-5 transition hover:shadow-[0_8px_30px_-12px_rgba(20,39,94,0.25)]">
      <div className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl ${past ? 'bg-sand text-lapis-800' : 'bg-lapis-700 text-white'}`}>
        <span className="font-display text-2xl font-bold leading-none">{dm.day}</span>
        <span className="mt-1 text-[11px] font-bold uppercase tracking-wider opacity-80">{dm.month}</span>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <TypeLabel tone={past ? 'lapis' : 'gold'}>{past ? t.common.past : t.common.upcoming}</TypeLabel>
          <span className="inline-flex items-center gap-1 text-xs text-muted">
            {s.format === 'audio' ? <Mic className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
            {s.format ? t.formats[s.format] : ''} {s.location ? `· ${s.location}` : ''}
          </span>
        </div>
        <h3 className="mt-1 font-display text-lg font-bold leading-snug text-lapis-900">
          <Link href={href.session(locale, s)} className="after:absolute after:inset-0">
            {s.title}
          </Link>
        </h3>
        {s.question && <p className="mt-1 line-clamp-2 text-[15px] text-muted">{s.question}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> {formatDate(s.date, locale, { time: !past })}
          </span>
          {s.participants ? (
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {s.participants}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export function competitionState(c: Competition): 'open' | 'judging' | 'closed' {
  if (!isPast(c.deadline)) return 'open'
  return (c.winners?.length ?? 0) > 0 ? 'closed' : 'judging'
}

export function CompetitionCard({ c, locale }: { c: Competition; locale: Locale }) {
  const t = getDict(locale)
  const state = competitionState(c)
  const stateStyle = { open: 'bg-emerald-50 text-emerald-800', judging: 'bg-gold-50 text-gold-700', closed: 'bg-sand text-muted' }[state]
  const stateLabel = { open: t.common.open, judging: t.common.judging, closed: t.common.closed }[state]
  return (
    <article className="card group relative flex h-full flex-col overflow-hidden">
      <MediaImg media={c.cover} className="aspect-[16/9] w-full" sizes="(min-width: 1024px) 33vw, 100vw" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${stateStyle}`}>{stateLabel}</span>
          <span className="text-xs text-muted">
            {t.common.deadline}: {formatDate(c.deadline, locale, { year: false })}
          </span>
        </div>
        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-lapis-900">
          <Link href={href.competition(locale, c)} className="after:absolute after:inset-0">
            #{c.number} · {c.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-[15px] text-muted">{c.prompt}</p>
        <div className="mt-auto flex items-center gap-2 pt-4 text-sm font-semibold text-lapis-700">
          {state === 'closed' ? <Trophy className="h-4 w-4 text-gold-500" /> : <PenLine className="h-4 w-4" />}
          {state === 'closed' ? `${c.winners?.length} ${locale === 'uz' ? 'gʻolib' : 'winners'}` : `${c.minWords}–${c.maxWords} ${t.common.words}`}
        </div>
      </div>
    </article>
  )
}

export function LibraryTile({ title, desc, href: link, count, icon: Icon, tone }: { title: string; desc: string; href: string; count?: number; icon: React.ElementType; tone: string }) {
  return (
    <Link href={link} className="card group flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:border-lapis-300">
      <div className="flex items-start justify-between">
        <span className={`grid h-11 w-11 place-items-center rounded-xl ${tone}`}>
          <Icon className="h-5 w-5" />
        </span>
        {typeof count === 'number' && <span className="font-display text-2xl font-bold text-lapis-900">{count}</span>}
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-lapis-900 group-hover:underline decoration-gold-500 underline-offset-4">{title}</h3>
      <p className="mt-1 text-sm text-muted">{desc}</p>
    </Link>
  )
}

export { TopicPills, BookOpen }
