import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import { Calendar, CheckCircle2, Headphones, MapPin, Users, Video } from 'lucide-react'
import type { Author, Session } from '@/payload-types'
import { getDict, type Locale } from '@/i18n/dict'
import { findBySlug } from '@/lib/payload'
import { href } from '@/lib/links'
import { formatDate, isPast } from '@/lib/format'
import { mediaUrl } from '@/lib/media'
import { RichText } from '@/components/RichText'
import { Avatar, Breadcrumbs, MediaImg, TopicPills } from '@/components/ui'

type Params = { params: Promise<{ lang: Locale; slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang, slug } = await params
  const s = await findBySlug<Session>('sessions', slug, lang, 1)
  return s ? { title: s.title, description: s.summary ?? undefined } : {}
}

export default async function SessionPage({ params }: Params) {
  const { lang, slug } = await params
  const t = getDict(lang)
  const s = await findBySlug<Session>('sessions', slug, lang)
  if (!s) notFound()
  const past = isPast(s.date)
  const speakers = (s.speakers ?? []).filter((a): a is Author => typeof a === 'object')
  const yt = s.recordingUrl?.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/)?.[1]
  const audio = mediaUrl(s.audio)

  return (
    <>
      <section className="relative overflow-hidden bg-lapis-900 text-white">
        <MediaImg media={s.cover} className="absolute inset-0 h-full w-full opacity-40" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-lapis-950 via-lapis-950/85 to-transparent" aria-hidden />
        <div className="container-x relative py-12 sm:py-16">
          <Breadcrumbs items={[{ label: t.nav.hub, href: href.hub(lang) }, { label: t.labels.sessions, href: `${href.hub(lang)}#suhbatlar` }, { label: s.title }]} />
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${past ? 'bg-white/15' : 'bg-gold-500 text-lapis-950'}`}>{past ? t.common.past : t.common.upcoming}</span>
          <h1 className="mt-4 max-w-3xl font-display text-[2rem] font-bold leading-tight sm:text-[2.8rem]">{s.title}</h1>
          {s.question && <p className="mt-3 max-w-2xl font-display text-xl italic text-lapis-100">“{s.question}”</p>}
          <div className="mt-6 flex flex-wrap gap-5 text-sm text-lapis-100">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gold-300" /> {formatDate(s.date, lang, { time: true })}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold-300" /> {s.format ? t.formats[s.format] : ''} {s.location ? `· ${s.location}` : ''}
            </span>
            {s.participants ? (
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-gold-300" /> {s.participants} {lang === 'uz' ? 'ishtirokchi' : 'participants'}
              </span>
            ) : null}
          </div>
          {!past && s.joinUrl && (
            <a href={s.joinUrl} target="_blank" rel="noreferrer" className="btn-gold mt-7">
              {lang === 'uz' ? 'Qoʻshilish' : 'Join'}
            </a>
          )}
        </div>
      </section>

      <div className="container-x grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 max-w-[740px]">
          {yt ? (
            <div className="mb-8 aspect-video overflow-hidden rounded-2xl">
              <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${yt}`} title={s.title} allowFullScreen loading="lazy" />
            </div>
          ) : past ? (
            <div className="mb-8 flex items-center gap-3 rounded-xl bg-sand px-5 py-4 text-sm text-muted">
              <Video className="h-5 w-5" /> {lang === 'uz' ? 'Video yozuv admin panelda YouTube havolasi qoʻshilganda shu yerda chiqadi.' : 'The recording appears here once a YouTube link is added.'}
            </div>
          ) : null}
          {audio && (
            <div className="mb-8 card flex items-center gap-4 p-4">
              <Headphones className="h-6 w-6 text-lapis-600" />
              <audio controls src={audio} className="w-full" />
            </div>
          )}
          {s.summary && <p className="font-display text-xl leading-relaxed text-lapis-950">{s.summary}</p>}
          {(s.takeaways?.length ?? 0) > 0 && (
            <section className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
              <h2 className="font-display text-xl font-bold text-lapis-900">{lang === 'uz' ? 'Muhokama xulosalari' : 'Key takeaways'}</h2>
              <ul className="mt-4 space-y-2.5">
                {s.takeaways!.map((k) => (
                  <li key={k.id} className="flex gap-2.5 text-[15.5px]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /> {k.text}
                  </li>
                ))}
              </ul>
            </section>
          )}
          <div className="mt-8">
            <RichText data={s.notes} className="reader-sans" />
          </div>
        </div>
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="card p-5">
            <div className="eyebrow mb-4 text-gold-600">{lang === 'uz' ? 'Spikerlar' : 'Speakers'}</div>
            <ul className="space-y-4">
              {speakers.map((a) => (
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
            {s.guests && <p className="mt-4 text-sm text-muted">{s.guests}</p>}
          </div>
          <div className="card p-5">
            <div className="eyebrow mb-3 text-gold-600">{t.common.topics}</div>
            <TopicPills topics={s.topics} locale={lang} max={5} />
          </div>
        </aside>
      </div>
    </>
  )
}
