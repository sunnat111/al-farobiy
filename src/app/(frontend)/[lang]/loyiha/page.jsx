import Link from 'next/link'
import React from 'react'
import { Compass, Mail, MapPin, Send, Target } from 'lucide-react'
import { getDict } from '@/i18n/dict'
import { getGlobal } from '@/lib/api'
import { href } from '@/lib/links'
import { RichText } from '@/components/RichText'
import { MediaImg, PageHero } from '@/components/ui'
import { ContactForm } from '@/components/forms'

export async function generateMetadata({ params }) {
  const { lang } = await params
  return { title: getDict(lang).nav.about }
}

export default async function About({ params }) {
  const { lang } = await params
  const t = getDict(lang)
  const [about, settings] = await Promise.all([getGlobal('about-page', lang), getGlobal('site-settings', lang)])
  const team = (about.team ?? []).filter((a) => typeof a === 'object')

  return (
    <>
      <PageHero eyebrow={t.nav.about} title={settings.siteName} intro={about.intro} crumbs={[{ label: t.siteName, href: href.home(lang) }, { label: t.nav.about }]}>
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            ['#manifest', t.labels.manifesto],
            ['#jamoa', t.labels.team],
            ['#aloqa', t.labels.contact],
          ].map(([h, l]) => (
            <a key={h} href={h} className="btn-ghost-light">
              {l}
            </a>
          ))}
        </div>
      </PageHero>

      <section className="container-x grid gap-6 py-12 md:grid-cols-2">
        {about.mission && (
          <div className="card p-7">
            <Target className="h-7 w-7 text-gold-500" />
            <h2 className="mt-3 font-display text-2xl font-bold text-lapis-900">{lang === 'uz' ? 'Missiya' : 'Mission'}</h2>
            <p className="mt-2 text-[16px] leading-relaxed text-ink/85">{about.mission}</p>
          </div>
        )}
        {about.vision && (
          <div className="card p-7">
            <Compass className="h-7 w-7 text-gold-500" />
            <h2 className="mt-3 font-display text-2xl font-bold text-lapis-900">{lang === 'uz' ? 'Maqsad' : 'Vision'}</h2>
            <p className="mt-2 text-[16px] leading-relaxed text-ink/85">{about.vision}</p>
          </div>
        )}
      </section>

      <section id="manifest" className="scroll-mt-28 border-y border-line bg-white py-14">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <div className="eyebrow text-gold-600">{t.labels.manifesto}</div>
            <h2 className="mt-2 font-display text-3xl font-bold text-lapis-900">{lang === 'uz' ? 'Biz kimmiz va nimaga ishonamiz' : 'Who we are and what we believe'}</h2>
          </div>
          <div className="max-w-[720px]">
            <RichText data={about.manifesto} />
          </div>
        </div>
      </section>

      {(about.values?.length ?? 0) > 0 && (
        <section className="container-x py-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((v, i) => (
              <div key={v.id} className="card p-5">
                <span className="font-display text-3xl font-bold text-gold-500">0{i + 1}</span>
                <h3 className="mt-2 font-display text-lg font-bold text-lapis-900">{v.title}</h3>
                <p className="mt-1 text-sm text-muted">{v.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="jamoa" className="scroll-mt-28 bg-sand/50 py-14">
        <div className="container-x">
          <h2 className="font-display text-3xl font-bold text-lapis-900">{lang === 'uz' ? 'Jamoa va mentorlar' : 'Team and mentors'}</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((a) => (
              <Link key={a.id} href={href.author(lang, a)} className="card group flex gap-4 p-5 transition hover:border-lapis-300">
                <span className="h-16 w-16 shrink-0 overflow-hidden rounded-full">
                  <MediaImg media={a.photo} className="h-full w-full" sizes="128px" alt={a.name} />
                </span>
                <div>
                  <div className="font-display text-lg font-bold text-lapis-900 group-hover:underline">{a.name}</div>
                  <div className="text-sm font-semibold text-gold-700">{a.position}</div>
                  {a.bio && <p className="mt-1.5 line-clamp-3 text-sm text-muted">{a.bio}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {(about.faq?.length ?? 0) > 0 && (
        <section className="container-x py-14">
          <h2 className="font-display text-3xl font-bold text-lapis-900">{lang === 'uz' ? 'Koʻp soʻraladigan savollar' : 'FAQ'}</h2>
          <div className="mt-6 max-w-3xl divide-y divide-line rounded-2xl border border-line bg-white">
            {about.faq.map((f) => (
              <details key={f.id} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-lapis-900">
                  {f.q}
                  <span className="text-xl text-gold-500 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-[15px] text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section id="aloqa" className="scroll-mt-28 border-t border-line bg-white py-14">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <h2 className="font-display text-3xl font-bold text-lapis-900">{t.labels.contact}</h2>
            <p className="mt-3 text-muted">
              {lang === 'uz'
                ? 'Savol, hamkorlik taklifi yoki oʻz maqolangizni yuborish uchun yozing.'
                : 'Write to us with questions, partnership ideas or your own paper.'}
            </p>
            <ul className="mt-6 space-y-3 text-[15px]">
              {settings.contact?.email && (
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gold-500" /> {settings.contact.email}
                </li>
              )}
              {settings.socials?.telegramChannel && (
                <li className="flex items-center gap-3">
                  <Send className="h-5 w-5 text-gold-500" />
                  <a href={settings.socials.telegramChannel} target="_blank" rel="noreferrer" className="hover:underline">
                    Telegram
                  </a>
                </li>
              )}
              {settings.contact?.address && (
                <li className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gold-500" /> {settings.contact.address}
                </li>
              )}
            </ul>
          </div>
          <div className="card p-6">
            <ContactForm locale={lang} />
          </div>
        </div>
      </section>
    </>
  )
}
