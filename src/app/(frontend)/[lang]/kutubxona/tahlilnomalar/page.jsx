import Link from 'next/link'
import React from 'react'
import { getDict } from '@/i18n/dict'
import { href } from '@/lib/links'
import { PageHero } from '@/components/ui'
import { PublicationList } from '@/components/PublicationList'

export async function generateMetadata({ params }) {
  const { lang } = await params
  return { title: getDict(lang).labels.briefs }
}

export default async function BriefsPage({ params, searchParams }) {
  const { lang } = await params
  const sp = await searchParams
  const t = getDict(lang)
  return (
    <>
      <PageHero
        eyebrow={`${t.nav.library} · IV`}
        title={lang === 'uz' ? 'Siyosiy tahlilnomalar' : 'Policy Briefs'}
        intro={
          lang === 'uz'
            ? 'Yoshlar va jamoa aʼzolari tomonidan yozilgan 2–3 sahifalik amaliy takliflar arxivi: muammo, tahlil va aniq tavsiyalar.'
            : 'An archive of 2–3 page practical proposals by young people and team members: problem, analysis and concrete recommendations.'
        }
        crumbs={[{ label: t.nav.library, href: href.library(lang) }, { label: t.labels.briefs }]}
      >
        <Link href={`${href.about(lang)}#aloqa`} className="btn-gold mt-6">
          {lang === 'uz' ? 'Oʻz tahlilnomangizni yuboring' : 'Submit your own brief'}
        </Link>
      </PageHero>
      <PublicationList locale={lang} kinds={['brief']} sp={sp} basePath={href.briefs(lang)} />
    </>
  )
}
