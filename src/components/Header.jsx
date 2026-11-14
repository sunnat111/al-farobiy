import React from 'react'
import { getDict } from '@/i18n/dict'
import { href } from '@/lib/links'
import { getGlobal, list } from '@/lib/api'
import { HeaderClient } from './HeaderClient'

export async function Header({ locale }) {
  const t = getDict(locale)
  const [{ docs: courses }, settings] = await Promise.all([
    list('courses', { locale, sort: 'order', limit: 8 }),
    getGlobal('site-settings', locale),
  ])

  const nav = [
    {
      key: 'courses',
      label: t.navShort.courses,
      title: t.nav.courses,
      href: href.courses(locale),
      items: [
        ...courses.map((c) => ({ label: c.title, desc: c.tagline ?? '', href: href.course(locale, c), badge: c.code ?? undefined })),
        { label: t.common.viewAll, desc: t.navDesc.allCourses, href: href.courses(locale) },
      ],
    },
    {
      key: 'research',
      label: t.navShort.research,
      title: t.nav.research,
      href: href.research(locale),
      items: [
        { label: t.labels.ild, desc: t.navDesc.ild, href: `${href.research(locale)}#ild` },
        { label: t.labels.statehood, desc: t.navDesc.statehood, href: `${href.research(locale)}#meros` },
      ],
    },
    {
      key: 'library',
      label: t.navShort.library,
      title: t.nav.library,
      href: href.library(locale),
      items: [
        { label: `I. ${t.labels.books}`, desc: t.navDesc.books, href: href.books(locale) },
        { label: `II. ${t.labels.classics}`, desc: t.navDesc.classics, href: href.classics(locale) },
        { label: `III. ${t.labels.articles}`, desc: t.navDesc.articles, href: href.articles(locale) },
        { label: `IV. ${t.labels.briefs}`, desc: t.navDesc.briefs, href: href.briefs(locale) },
      ],
    },
    {
      key: 'hub',
      label: t.navShort.hub,
      title: t.nav.hub,
      href: href.hub(locale),
      items: [
        { label: t.labels.ideas, desc: t.navDesc.ideas, href: `${href.hub(locale)}#goyalar` },
        { label: t.labels.sessions, desc: t.navDesc.sessions, href: `${href.hub(locale)}#suhbatlar` },
      ],
    },
    {
      key: 'competitions',
      label: t.navShort.competitions,
      title: t.nav.competitions,
      href: href.competitions(locale),
      items: [
        { label: t.labels.weekly, desc: t.navDesc.weekly, href: href.competitions(locale) },
        { label: t.labels.hallOfFame, desc: t.navDesc.hallOfFame, href: href.hallOfFame(locale) },
      ],
    },
    {
      key: 'about',
      label: t.navShort.about,
      title: t.nav.about,
      href: href.about(locale),
      items: [
        { label: t.labels.manifesto, desc: t.navDesc.manifesto, href: `${href.about(locale)}#manifest` },
        { label: t.labels.team, desc: t.navDesc.team, href: `${href.about(locale)}#jamoa` },
        { label: t.labels.contact, desc: t.navDesc.contact, href: `${href.about(locale)}#aloqa` },
      ],
    },
  ]

  return (
    <HeaderClient
      locale={locale}
      nav={nav}
      announcement={settings.announcement?.enabled ? { text: settings.announcement.text ?? '', link: settings.announcement.link ?? '' } : null}
      labels={{ search: t.common.search, searchPlaceholder: t.common.searchPlaceholder, cta: t.cta.submitEssay, viewAll: t.common.viewAll }}
      ctaHref={href.competitions(locale)}
      searchHref={href.search(locale)}
    />
  )
}
