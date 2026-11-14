import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import { Award, CalendarDays, CheckCircle2, Gift, Hourglass, Scale, Trophy, Users } from 'lucide-react'
import { getDict } from '@/i18n/dict'
import { getBySlug } from '@/lib/api'
import { href } from '@/lib/links'
import { formatDate } from '@/lib/format'
import { competitionState } from '@/components/cards'
import { Countdown } from '@/components/interactive'
import { EssayForm } from '@/components/forms'
import { RichText } from '@/components/RichText'
import { Avatar, Breadcrumbs, MediaImg } from '@/components/ui'

export async function generateMetadata({ params }) {
  const { lang, slug } = await params
  const c = await getBySlug('competitions', slug, lang)
  return c ? { title: `#${c.number} ${c.title}`, description: c.prompt ?? undefined } : {}
}

export default async function CompetitionPage({ params }) {
  const { lang, slug } = await params
  const t = getDict(lang)
  const c = await getBySlug('competitions', slug, lang)
  if (!c) notFound()
  const state = competitionState(c)
  const judges = (c.judges ?? []).filter((a) => typeof a === 'object')
  const winners = [...(c.winners ?? [])].sort((a, b) => (a.place === 'special' ? 9 : Number(a.place)) - (b.place === 'special' ? 9 : Number(b.place)))

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-terracotta-700 via-lapis-900 to-lapis-950 text-white">
        <div className="girih-bg absolute inset-0 opacity-25" aria-hidden />
        <div className="container-x relative grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Breadcrumbs items={[{ label: t.nav.competitions, href: href.competitions(lang) }, { label: `#${c.number}` }]} />
            <div className="eyebrow text-gold-300">
              {t.labels.weekly} · #{c.number}
            </div>
            <h1 className="mt-3 font-display text-[2.1rem] font-bold leading-tight sm:text-5xl">{c.title}</h1>
            <blockquote className="mt-5 max-w-2xl border-l-4 border-gold-400 pl-4 font-display text-xl leading-relaxed text-lapis-50">{c.prompt}</blockquote>
            <div className="mt-6 flex flex-wrap gap-5 text-sm text-lapis-100">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-gold-300" /> {formatDate(c.startDate, lang, { year: false })} — {formatDate(c.deadline, lang, { time: true })}
              </span>
              <span className="inline-flex items-center gap-2">
                <Hourglass className="h-4 w-4 text-gold-300" /> {c.minWords}–{c.maxWords} {t.common.words}
              </span>
              {c.audience && (
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4 text-gold-300" /> {c.audience}
                </span>
              )}
            </div>
          </div>
          <div className="self-end rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
            {state === 'open' ? (
              <>
                <div className="mb-3 text-sm font-semibold text-lapis-200">{lang === 'uz' ? 'Topshirishga qoldi' : 'Time left'}</div>
                <Countdown to={c.deadline} labels={{ days: t.common.days, hours: t.common.hours, minutes: t.common.minutes, seconds: t.common.seconds }} />
                {c.acceptSubmissions && (
                  <a href="#topshirish" className="btn-gold mt-5 w-full">
                    {t.cta.submitEssay}
                  </a>
                )}
              </>
            ) : state === 'judging' ? (
              <div className="flex items-start gap-3">
                <Scale className="h-6 w-6 shrink-0 text-gold-300" />
                <div>
                  <div className="font-display text-xl font-bold">{t.common.judging}</div>
                  <p className="mt-1 text-sm text-lapis-200">{lang === 'uz' ? 'Qabul yakunlandi. Natijalar tez orada eʼlon qilinadi.' : 'Submissions are closed. Results coming soon.'}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <Trophy className="h-6 w-6 shrink-0 text-gold-300" />
                <div>
                  <div className="font-display text-xl font-bold">{t.common.closed}</div>
                  <a href="#goliblar" className="mt-1 inline-block text-sm font-semibold text-gold-300 hover:underline">
                    {lang === 'uz' ? 'Gʻoliblarni koʻrish ↓' : 'See the winners ↓'}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container-x grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <RichText data={c.description} className="reader-sans" />

          {winners.length > 0 && (
            <section id="goliblar" className="mt-10 scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-lapis-900">{lang === 'uz' ? 'Gʻoliblar' : 'Winners'}</h2>
              <div className="mt-5 space-y-5">
                {winners.map((w) => (
                  <article key={w.id} id={w.id ?? undefined} className={`card scroll-mt-28 p-6 ${w.place === '1' ? 'border-gold-300 bg-gold-50/40' : ''}`}>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="h-14 w-14 overflow-hidden rounded-full ring-2 ring-gold-300">
                        <MediaImg media={w.photo} className="h-full w-full" sizes="112px" alt={w.name} />
                      </span>
                      <div className="flex-1">
                        <div className="font-bold text-lapis-900">{w.name}</div>
                        <div className="text-sm text-muted">
                          {[w.age ? `${w.age} ${lang === 'uz' ? 'yosh' : 'y.o.'}` : null, w.school, w.region].filter(Boolean).join(' · ')}
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-3 py-1 text-xs font-bold text-lapis-950">
                        <Award className="h-3.5 w-3.5" /> {t.places[w.place]}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-xl font-bold text-lapis-950">“{w.essayTitle}”</h3>
                    {w.essay ? (
                      <details className="group mt-2">
                        <summary className="cursor-pointer list-none">
                          <p className="font-display text-[16.5px] italic leading-relaxed text-ink/80">{w.essayExcerpt}</p>
                          <span className="mt-2 inline-block text-sm font-bold text-lapis-700 group-open:hidden">{lang === 'uz' ? 'Toʻliq inshoni oʻqish ↓' : 'Read the full essay ↓'}</span>
                        </summary>
                        <div className="mt-4 border-t border-line pt-4">
                          <RichText data={w.essay} />
                        </div>
                      </details>
                    ) : (
                      w.essayExcerpt && <p className="mt-2 font-display text-[16.5px] italic leading-relaxed text-ink/80">{w.essayExcerpt}</p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {state === 'open' && c.acceptSubmissions && (
            <section id="topshirish" className="mt-12 scroll-mt-28 rounded-2xl border border-line bg-white p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold text-lapis-900">{lang === 'uz' ? 'Inshoni topshirish' : 'Submit your essay'}</h2>
              <p className="mb-6 mt-2 text-sm text-muted">
                {lang === 'uz' ? 'Barcha maydonlarni toʻldiring. Inshoingiz faqat hakamlar tomonidan koʻriladi.' : 'Fill in all fields. Your essay will only be read by the judges.'}
              </p>
              <EssayForm locale={lang} competitionId={c.id} minWords={c.minWords ?? 0} maxWords={c.maxWords ?? 5000} />
            </section>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          {(c.rules?.length ?? 0) > 0 && (
            <div className="card p-5">
              <h3 className="eyebrow mb-3 text-gold-600">{lang === 'uz' ? 'Qoidalar' : 'Rules'}</h3>
              <ul className="space-y-2.5">
                {c.rules.map((r) => (
                  <li key={r.id} className="flex gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {r.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {(c.criteria?.length ?? 0) > 0 && (
            <div className="card p-5">
              <h3 className="eyebrow mb-3 text-gold-600">{lang === 'uz' ? 'Baholash mezonlari' : 'Judging criteria'}</h3>
              <ul className="space-y-3">
                {c.criteria.map((k) => (
                  <li key={k.id} className="text-sm">
                    <div className="flex justify-between gap-2">
                      <span>{k.title}</span>
                      <span className="font-bold text-lapis-800">{k.weight}%</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-sand">
                      <div className="h-full rounded-full bg-gold-500" style={{ width: `${k.weight ?? 0}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {(c.prizes?.length ?? 0) > 0 && (
            <div className="card p-5">
              <h3 className="eyebrow mb-3 flex items-center gap-2 text-gold-600">
                <Gift className="h-4 w-4" /> {lang === 'uz' ? 'Mukofotlar' : 'Prizes'}
              </h3>
              <ul className="space-y-2 text-sm">
                {c.prizes.map((p) => (
                  <li key={p.id}>{p.text}</li>
                ))}
              </ul>
            </div>
          )}
          {judges.length > 0 && (
            <div className="card p-5">
              <h3 className="eyebrow mb-4 text-gold-600">{lang === 'uz' ? 'Hakamlar' : 'Judges'}</h3>
              <ul className="space-y-3">
                {judges.map((a) => (
                  <li key={a.id} className="flex items-center gap-3">
                    <Avatar author={a} size={36} />
                    <Link href={href.author(lang, a)} className="text-sm font-bold text-lapis-900 hover:underline">
                      {a.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </>
  )
}
