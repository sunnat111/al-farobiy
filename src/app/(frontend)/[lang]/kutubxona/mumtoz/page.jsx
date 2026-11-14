import React from 'react'
import { getDict } from '@/i18n/dict'
import { list } from '@/lib/api'
import { href } from '@/lib/links'
import { ClassicCard } from '@/components/cards'
import { PageHero } from '@/components/ui'

export async function generateMetadata({ params }) {
  const { lang } = await params
  return { title: getDict(lang).labels.classics }
}

export default async function ClassicsPage({ params }) {
  const { lang } = await params
  const t = getDict(lang)
  const { docs } = await list('classical-texts', { locale: lang, sort: 'order', limit: 100 })
  return (
    <>
      <PageHero
        eyebrow={`${t.nav.library} · II`}
        title={lang === 'uz' ? 'Mumtoz asarlar va ilmiy sharhlar' : 'Classical Texts & Hermeneutics'}
        intro={t.navDesc.classics}
        crumbs={[{ label: t.nav.library, href: href.library(lang) }, { label: t.labels.classics }]}
      />
      <section className="container-x py-12">
        <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {docs.map((c) => (
            <li key={c.id}>
              <ClassicCard c={c} locale={lang} />
              <p className="mt-3 line-clamp-3 px-1 text-sm text-muted">{c.intro}</p>
              <p className="mt-1 px-1 text-xs font-semibold text-gold-700">{c.era}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
