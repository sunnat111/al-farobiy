import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import { BookOpen, CheckCircle2, Clock, GraduationCap, ListChecks, PlayCircle } from 'lucide-react'
import type { Author, Book, ClassicalText, Course, Publication } from '@/payload-types'
import { getDict, type Locale } from '@/i18n/dict'
import { findBySlug } from '@/lib/payload'
import { href, hrefFor } from '@/lib/links'
import { mediaUrl } from '@/lib/media'
import { RichText } from '@/components/RichText'
import { Avatar, Breadcrumbs, MediaImg, TopicPills } from '@/components/ui'
import { Quiz } from '@/components/interactive'

type Params = { params: Promise<{ lang: Locale; slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang, slug } = await params
  const c = await findBySlug<Course>('courses', slug, lang, 1)
  if (!c) return {}
  return { title: c.title, description: c.summary ?? undefined, openGraph: { images: mediaUrl(c.cover, 'hero') ?? undefined } }
}

function youtubeId(url?: string | null) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/)
  return m?.[1] ?? null
}

export default async function CoursePage({ params }: Params) {
  const { lang, slug } = await params
  const t = getDict(lang)
  const c = await findBySlug<Course>('courses', slug, lang, 2)
  if (!c) notFound()
  const instructors = (c.instructors ?? []).filter((a): a is Author => typeof a === 'object')
  const lessons = c.lessons ?? []
  const readings = (c.readings ?? []).filter((r) => typeof r.value === 'object')
  const quiz = (c.quiz ?? []).map((q) => ({ question: q.question ?? '', options: (q.options ?? []).map((o) => o.text ?? ''), correct: q.correct, explanation: q.explanation }))

  return (
    <>
      <section className="relative overflow-hidden bg-lapis-900 text-white">
        <MediaImg media={c.cover} className="absolute inset-0 h-full w-full opacity-35" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-lapis-950 via-lapis-950/85 to-lapis-900/40" aria-hidden />
        <div className="container-x relative py-12 sm:py-16">
          <Breadcrumbs items={[{ label: t.siteName, href: href.home(lang) }, { label: t.nav.courses, href: href.courses(lang) }, { label: c.code ?? c.title }]} />
          <div className="flex flex-wrap items-center gap-2">
            {c.code && <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold tracking-wider ring-1 ring-white/20">{c.code}</span>}
            {c.level && <span className="rounded-full bg-gold-500 px-3 py-1 text-xs font-bold text-lapis-950">{t.levels[c.level]}</span>}
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-[2.1rem] font-bold leading-[1.15] sm:text-5xl">{c.title}</h1>
          {c.tagline && <p className="mt-3 max-w-2xl text-lg text-lapis-100">{c.tagline}</p>}
          <div className="mt-6 flex flex-wrap gap-5 text-sm text-lapis-100">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold-300" /> {c.duration}
            </span>
            <span className="inline-flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-gold-300" /> {lessons.length} {t.common.lessons}
            </span>
            {quiz.length > 0 && (
              <span className="inline-flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-gold-300" /> {quiz.length} {lang === 'uz' ? 'test savoli' : 'quiz questions'}
              </span>
            )}
          </div>
          <a href="#darslar" className="btn-gold mt-7">
            <GraduationCap className="h-4 w-4" /> {lang === 'uz' ? 'Kursni boshlash' : 'Start the course'}
          </a>
        </div>
      </section>

      <div className="container-x grid gap-10 py-12 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          {c.summary && <p className="font-display text-xl leading-relaxed text-lapis-900">{c.summary}</p>}
          {c.outcomes && c.outcomes.length > 0 && (
            <div className="mt-8 rounded-2xl border border-line bg-white p-6">
              <h2 className="font-display text-xl font-bold text-lapis-900">{lang === 'uz' ? 'Kurs yakunida siz:' : 'By the end you will:'}</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {c.outcomes.map((o) => (
                  <li key={o.id} className="flex gap-2.5 text-[15px]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /> {o.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-8">
            <RichText data={c.description} className="reader-sans" />
          </div>

          <h2 id="darslar" className="mt-12 scroll-mt-28 font-display text-2xl font-bold text-lapis-900">
            {lang === 'uz' ? 'Darslar' : 'Lessons'}
          </h2>
          <ol className="mt-5 space-y-3">
            {lessons.map((l, i) => {
              const yt = youtubeId(l.videoUrl)
              return (
                <li key={l.id}>
                  <details className="group card overflow-hidden open:shadow-[0_8px_30px_-16px_rgba(20,39,94,0.35)]" open={i === 0}>
                    <summary className="flex cursor-pointer list-none items-center gap-4 p-5">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lapis-50 font-display font-bold text-lapis-700 group-open:bg-lapis-700 group-open:text-white">{i + 1}</span>
                      <span className="flex-1">
                        <span className="block font-display text-lg font-bold text-lapis-900">{l.title}</span>
                        {l.summary && <span className="mt-0.5 block text-sm text-muted">{l.summary}</span>}
                      </span>
                      {l.duration && <span className="hidden shrink-0 text-sm text-muted sm:block">{l.duration}</span>}
                    </summary>
                    <div className="border-t border-line px-5 pb-6 pt-5 sm:pl-[76px]">
                      {yt ? (
                        <div className="mb-5 aspect-video overflow-hidden rounded-xl">
                          <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${yt}`} title={l.title ?? ''} allowFullScreen loading="lazy" />
                        </div>
                      ) : (
                        <div className="mb-5 flex items-center gap-2 rounded-lg bg-sand px-4 py-3 text-sm text-muted">
                          <PlayCircle className="h-4 w-4" /> {lang === 'uz' ? 'Video dars admin paneldan YouTube havolasi qoʻshilganda shu yerda chiqadi.' : 'The video appears here once a YouTube link is added in the admin panel.'}
                        </div>
                      )}
                      <RichText data={l.content} className="reader-sans" />
                    </div>
                  </details>
                </li>
              )
            })}
          </ol>

          {quiz.length > 0 && (
            <>
              <h2 id="test" className="mt-14 scroll-mt-28 font-display text-2xl font-bold text-lapis-900">
                {lang === 'uz' ? 'Oʻz-oʻzini tekshirish' : 'Self-check quiz'}
              </h2>
              <div className="mt-5">
                <Quiz questions={quiz} labels={{ check: lang === 'uz' ? 'Javoblarni tekshirish' : 'Check answers', retry: lang === 'uz' ? 'Qayta urinish' : 'Try again', score: lang === 'uz' ? 'Natija' : 'Score' }} />
              </div>
            </>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="card p-5">
            <h3 className="eyebrow text-gold-600">{lang === 'uz' ? 'Oʻqituvchilar' : 'Instructors'}</h3>
            <ul className="mt-4 space-y-4">
              {instructors.map((a) => (
                <li key={a.id} className="flex items-center gap-3">
                  <Avatar author={a} size={44} />
                  <div>
                    <Link href={href.author(lang, a)} className="font-bold text-lapis-900 hover:underline">
                      {a.name}
                    </Link>
                    <div className="text-xs text-muted">{a.position}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {readings.length > 0 && (
            <div className="card p-5">
              <h3 className="eyebrow text-gold-600">{lang === 'uz' ? 'Adabiyotlar' : 'Readings'}</h3>
              <ul className="mt-3 divide-y divide-line">
                {readings.map((r) => {
                  const d = r.value as Book | ClassicalText | Publication
                  const sub = r.relationTo === 'books' ? `${(d as Book).authorsText}, ${(d as Book).year}` : r.relationTo === 'classical-texts' ? (d as ClassicalText).thinker : t.kinds[(d as Publication).kind]
                  return (
                    <li key={`${r.relationTo}-${d.id}`} className="py-3">
                      <Link href={hrefFor(lang, r.relationTo, d)} className="font-display font-bold leading-snug text-lapis-900 hover:underline">
                        {d.title}
                      </Link>
                      <div className="text-xs text-muted">{sub}</div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
          <div className="card p-5">
            <h3 className="eyebrow mb-3 text-gold-600">{t.common.topics}</h3>
            <TopicPills topics={c.topics} locale={lang} max={6} />
          </div>
        </aside>
      </div>
    </>
  )
}
