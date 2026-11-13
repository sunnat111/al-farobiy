import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { ArrowRight, PenLine, Trophy } from 'lucide-react'
import type { Competition } from '@/payload-types'
import { getDict, type Locale } from '@/i18n/dict'
import { find } from '@/lib/payload'
import { href } from '@/lib/links'
import { CompetitionCard, competitionState } from '@/components/cards'
import { Countdown } from '@/components/interactive'
import { MediaImg, PageHero } from '@/components/ui'

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params
  return { title: getDict(lang).nav.competitions }
}

export default async function CompetitionsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const t = getDict(lang)
  const { docs } = await find<Competition>({ collection: 'competitions', locale: lang, sort: '-deadline', limit: 100 })
  const active = docs.find((c) => competitionState(c) === 'open')
  const rest = docs.filter((c) => c.id !== active?.id)
  const steps =
    lang === 'uz'
      ? [
          ['Mavzuni oʻqing', 'Har dushanba yangi insho savoli eʼlon qilinadi.'],
          ['Yozing', '600–1200 soʻz, kamida ikkita manba bilan.'],
          ['Yuboring', 'Saytdagi forma orqali muddatgacha topshiring.'],
          ['Natija', 'Gʻoliblar “Shon-sharaf zali”da eʼlon qilinadi.'],
        ]
      : [
          ['Read the prompt', 'A new essay question every Monday.'],
          ['Write', '600–1200 words with at least two sources.'],
          ['Submit', 'Use the form on the site before the deadline.'],
          ['Results', 'Winners are featured in the Hall of Fame.'],
        ]

  return (
    <>
      <PageHero
        eyebrow={t.nav.competitions}
        title={lang === 'uz' ? 'Haftalik yozuv tanlovlari' : 'Weekly writing competitions'}
        intro={t.navDesc.weekly}
        crumbs={[{ label: t.siteName, href: href.home(lang) }, { label: t.nav.competitions }]}
      >
        <Link href={href.hallOfFame(lang)} className="btn-ghost-light mt-6">
          <Trophy className="h-4 w-4 text-gold-300" /> {t.labels.hallOfFame}
        </Link>
      </PageHero>

      {active && (
        <section className="container-x py-12">
          <div className="grid overflow-hidden rounded-2xl border border-line bg-white lg:grid-cols-[1fr_1.1fr]">
            <MediaImg media={active.cover} className="h-full min-h-[260px] w-full" sizes="(min-width: 1024px) 45vw, 100vw" priority />
            <div className="p-7 sm:p-9">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{t.common.open}</span>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-lapis-950">
                #{active.number} · {active.title}
              </h2>
              <p className="mt-3 font-display text-lg leading-relaxed text-ink/85">“{active.prompt}”</p>
              <div className="mt-6 rounded-xl bg-lapis-900 p-4">
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-lapis-200">{t.common.deadline}</div>
                <Countdown to={active.deadline} labels={{ days: t.common.days, hours: t.common.hours, minutes: t.common.minutes, seconds: t.common.seconds }} />
              </div>
              <Link href={`${href.competition(lang, active)}#topshirish`} className="btn-gold mt-6">
                <PenLine className="h-4 w-4" /> {t.cta.submitEssay} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="container-x pb-4">
        <div className="grid gap-4 rounded-2xl border border-line bg-sand/50 p-6 md:grid-cols-4">
          {steps.map(([title, d], i) => (
            <div key={title} className="flex gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white font-display font-bold text-gold-700 ring-1 ring-gold-200">{i + 1}</span>
              <div>
                <div className="font-bold text-lapis-900">{title}</div>
                <p className="text-sm text-muted">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-12">
        <h2 className="mb-6 font-display text-2xl font-bold text-lapis-900">{lang === 'uz' ? 'Tanlovlar arxivi' : 'Competition archive'}</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((c) => (
            <CompetitionCard key={c.id} c={c} locale={lang} />
          ))}
        </div>
      </section>
    </>
  )
}
