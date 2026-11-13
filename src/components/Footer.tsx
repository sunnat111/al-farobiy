import Link from 'next/link'
import React from 'react'
import { Mail, Send } from 'lucide-react'
import { InstagramIcon as Instagram, YoutubeIcon as Youtube } from './BrandIcons'
import { getDict, type Locale } from '@/i18n/dict'
import { href } from '@/lib/links'
import { getGlobal } from '@/lib/payload'
import type { SiteSetting } from '@/payload-types'
import { Wordmark } from './Logo'

export async function Footer({ locale }: { locale: Locale }) {
  const t = getDict(locale)
  const s = await getGlobal<SiteSetting>('site-settings', locale)
  const socials = [
    { url: s.socials?.telegramChannel, icon: Send, label: 'Telegram' },
    { url: s.socials?.instagram, icon: Instagram, label: 'Instagram' },
    { url: s.socials?.youtube, icon: Youtube, label: 'YouTube' },
  ].filter((x) => x.url)

  const cols = [
    {
      title: t.footer.sections,
      links: [
        [t.nav.courses, href.courses(locale)],
        [t.nav.research, href.research(locale)],
        [t.nav.hub, href.hub(locale)],
        [t.nav.competitions, href.competitions(locale)],
        [t.nav.about, href.about(locale)],
      ],
    },
    {
      title: t.footer.library,
      links: [
        [t.labels.books, href.books(locale)],
        [t.labels.classics, href.classics(locale)],
        [t.labels.articles, href.articles(locale)],
        [t.labels.briefs, href.briefs(locale)],
      ],
    },
    {
      title: t.footer.join,
      links: [
        [t.cta.submitEssay, href.competitions(locale)],
        [t.labels.hallOfFame, href.hallOfFame(locale)],
        [t.labels.contact, `${href.about(locale)}#aloqa`],
        [t.common.search, href.search(locale)],
      ],
    },
  ]

  return (
    <footer className="relative mt-20 overflow-hidden bg-lapis-950 text-lapis-100">
      <div className="girih-bg absolute inset-0 opacity-[0.12]" aria-hidden />
      <div className="container-x relative grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Wordmark light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-lapis-200">{s.tagline ? `${s.tagline}. ` : ''}{t.footer.about}</p>
          <div className="mt-5 space-y-1.5 text-sm">
            {s.contact?.email && (
              <a href={`mailto:${s.contact.email}`} className="flex items-center gap-2 hover:text-white">
                <Mail className="h-4 w-4 text-gold-400" /> {s.contact.email}
              </a>
            )}
            {s.contact?.address && <p className="text-lapis-300">{s.contact.address}</p>}
          </div>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-2">
              {socials.map(({ url, icon: Icon, label }) => (
                <a key={label} href={url!} target="_blank" rel="noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 hover:border-gold-400 hover:text-gold-300">
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          )}
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="eyebrow mb-4 text-gold-300">{c.title}</h3>
            <ul className="space-y-2.5 text-[15px]">
              {c.links.map(([label, link]) => (
                <li key={link + label}>
                  <Link href={link} className="hover:text-white hover:underline decoration-gold-400 underline-offset-4">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-lapis-300 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {s.siteName}. {t.footer.rights}
          </span>
          <span className="flex items-center gap-4">
            <span className="text-lapis-400">{t.common.demoNote}</span>
            <Link href="/admin" className="hover:text-white">
              {t.footer.admin}
            </Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
