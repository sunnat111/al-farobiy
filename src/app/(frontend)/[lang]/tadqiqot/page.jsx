import React from 'react'
import { getDict } from '@/i18n/dict'
import { list } from '@/lib/api'
import { href } from '@/lib/links'
import { PaperCard, FeatureCard } from '@/components/cards'
import { PageHero, Empty } from '@/components/ui'

export async function generateMetadata({ params }) {
  const { lang } = await params
  return { title: getDict(lang).nav.research }
}

export default async function ResearchPage({ params }) {
  const { lang } = await params
  const t = getDict(lang)
  const { docs } = await list('publications', { locale: lang, sort: '-publishedDate', limit: 100, kind: 'research' })
  const streams = [
    { id: 'ild', key: 'islamic-liberal-democracy', title: t.labels.ild, desc: t.navDesc.ild, tone: 'from-turquoise-700 to-lapis-900' },
    { id: 'meros', key: 'national-statehood', title: t.labels.statehood, desc: t.navDesc.statehood, tone: 'from-terracotta-700 to-lapis-900' },
    { id: 'boshqa', key: 'other', title: lang === 'uz' ? 'Boshqa tadqiqotlar' : 'Other research', desc: '', tone: 'from-lapis-700 to-lapis-900' },
  ]
  return (
    <>
      <PageHero
        eyebrow={t.nav.research}
        title={lang === 'uz' ? 'Tadqiqot va nazariya' : 'Research & Theory'}
        intro={
          lang === 'uz'
            ? 'Ikki asosiy yoʻnalish: islomiy qadriyatlar va liberal demokratik institutlar sintezi hamda milliy davlatchilik merosining ilmiy tahlili.'
            : 'Two core streams: a synthesis of Islamic values and liberal democratic institutions, and scholarly study of our statehood heritage.'
        }
        crumbs={[{ label: t.siteName, href: href.home(lang) }, { label: t.nav.research }]}
      >
        <div className="mt-6 flex flex-wrap gap-2">
          {streams.slice(0, 2).map((s) => (
            <a key={s.id} href={`#${s.id}`} className="btn-ghost-light">
              {s.title}
            </a>
          ))}
        </div>
      </PageHero>
      {streams.map((s) => {
        const list = docs.filter((d) => (d.series ?? 'other') === s.key)
        if (!list.length && s.key === 'other') return null
        const [first, ...rest] = list
        return (
          <section key={s.id} id={s.id} className="container-x scroll-mt-28 py-12">
            <div className={`relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br ${s.tone} p-7 text-white`}>
              <div className="girih-bg absolute inset-0 opacity-20" aria-hidden />
              <div className="relative max-w-3xl">
                <h2 className="font-display text-3xl font-bold">{s.title}</h2>
                {s.desc && <p className="mt-2 text-white/85">{s.desc}</p>}
                <p className="mt-3 text-sm font-semibold text-gold-300">
                  {list.length} {lang === 'uz' ? 'ta tadqiqot' : 'papers'}
                </p>
              </div>
            </div>
            {!list.length ? (
              <Empty>{t.common.noResults}</Empty>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                <FeatureCard p={first} locale={lang} />
                <div className="grid content-start gap-5">
                  {rest.map((p) => (
                    <PaperCard key={p.id} p={p} locale={lang} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )
      })}
    </>
  )
}
