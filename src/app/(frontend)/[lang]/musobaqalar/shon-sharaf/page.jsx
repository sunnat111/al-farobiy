import Link from 'next/link'
import React from 'react'
import { Award, Trophy } from 'lucide-react'
import { getDict } from '@/i18n/dict'
import { list } from '@/lib/api'
import { href } from '@/lib/links'
import { RichText } from '@/components/RichText'
import { Empty, MediaImg, PageHero } from '@/components/ui'

export async function generateMetadata({ params }) {
  const { lang } = await params
  return { title: getDict(lang).labels.hallOfFame }
}

export default async function HallOfFame({ params }) {
  const { lang } = await params
  const t = getDict(lang)
  const { docs } = await list('competitions', { locale: lang, sort: '-deadline', limit: 200 })
  const withWinners = docs.filter((c) => (c.winners?.length ?? 0) > 0)
  const champions = withWinners.flatMap((c) => (c.winners ?? []).filter((w) => w.place === '1').map((w) => ({ ...w, c })))

  return (
    <>
      <PageHero
        eyebrow={t.nav.competitions}
        title={lang === 'uz' ? 'Shon-sharaf zali' : 'Hall of Fame'}
        intro={t.navDesc.hallOfFame}
        crumbs={[{ label: t.nav.competitions, href: href.competitions(lang) }, { label: t.labels.hallOfFame }]}
      />
      {champions.length > 0 && (
        <section className="container-x py-12">
          <div className="grid gap-6 md:grid-cols-2">
            {champions.map((w) => (
              <article key={w.id} id={w.id ?? undefined} className="relative scroll-mt-28 overflow-hidden rounded-2xl border border-gold-300 bg-white">
                <div className="flex items-center gap-4 bg-gradient-to-r from-gold-50 to-white p-6">
                  <span className="h-16 w-16 overflow-hidden rounded-full ring-4 ring-gold-300">
                    <MediaImg media={w.photo} className="h-full w-full" sizes="128px" alt={w.name} />
                  </span>
                  <div className="flex-1">
                    <div className="font-display text-xl font-bold text-lapis-950">{w.name}</div>
                    <div className="text-sm text-muted">{[w.school, w.region].filter(Boolean).join(' · ')}</div>
                  </div>
                  <Trophy className="h-8 w-8 text-gold-500" />
                </div>
                <div className="p-6 pt-4">
                  <Link href={href.competition(lang, w.c)} className="eyebrow text-lapis-600 hover:underline">
                    #{w.c.number} · {w.c.title}
                  </Link>
                  <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-lapis-950">“{w.essayTitle}”</h2>
                  {w.essay ? (
                    <div className="mt-3">
                      <RichText data={w.essay} />
                    </div>
                  ) : (
                    <p className="mt-3 font-display text-lg italic leading-relaxed text-ink/80">{w.essayExcerpt}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
      <section className="container-x pb-6">
        <h2 className="mb-6 font-display text-2xl font-bold text-lapis-900">{lang === 'uz' ? 'Barcha gʻoliblar' : 'All winners'}</h2>
        {withWinners.length ? (
          <div className="space-y-8">
            {withWinners.map((c) => (
              <div key={c.id} className="card overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-sand/50 px-5 py-3">
                  <Link href={href.competition(lang, c)} className="font-display text-lg font-bold text-lapis-900 hover:underline">
                    #{c.number} · {c.title}
                  </Link>
                </div>
                <ul className="divide-y divide-line">
                  {(c.winners ?? []).map((w) => (
                    <li key={w.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                      <span className="inline-flex w-36 items-center gap-1.5 text-sm font-bold text-gold-700">
                        <Award className="h-4 w-4" /> {t.places[w.place]}
                      </span>
                      <span className="min-w-[160px] font-semibold text-lapis-900">{w.name}</span>
                      <span className="flex-1 font-display italic text-ink/80">“{w.essayTitle}”</span>
                      <span className="text-sm text-muted">{w.region}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <Empty>{t.common.noResults}</Empty>
        )}
      </section>
    </>
  )
}
