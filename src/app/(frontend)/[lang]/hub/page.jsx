import React from 'react'
import { MessageCircleQuestion, Send, ShieldCheck } from 'lucide-react'
import { getDict } from '@/i18n/dict'
import { getGlobal, list } from '@/lib/api'
import { href } from '@/lib/links'
import { isPast } from '@/lib/format'
import { SessionCard } from '@/components/cards'
import { Empty, PageHero } from '@/components/ui'
import { ProposalForm } from '@/components/forms'

export async function generateMetadata({ params }) {
  const { lang } = await params
  return { title: getDict(lang).nav.hub }
}

export default async function HubPage({ params }) {
  const { lang } = await params
  const t = getDict(lang)
  const [settings, sessions] = await Promise.all([getGlobal('site-settings', lang), list('sessions', { locale: lang, sort: '-date', limit: 100 })])
  const upcoming = sessions.docs.filter((s) => !isPast(s.date)).reverse()
  const past = sessions.docs.filter((s) => isPast(s.date))

  return (
    <>
      <PageHero
        eyebrow={t.nav.hub}
        title={lang === 'uz' ? 'Virtual Hub: gʻoyalar almashinuvi maydoni' : 'Exchange Hub: a space for ideas'}
        intro={t.navDesc.ideas}
        crumbs={[{ label: t.siteName, href: href.home(lang) }, { label: t.nav.hub }]}
      >
        <div className="mt-6 flex flex-wrap gap-2">
          <a href="#goyalar" className="btn-ghost-light">
            {t.labels.ideas}
          </a>
          <a href="#suhbatlar" className="btn-ghost-light">
            {t.labels.sessions}
          </a>
        </div>
      </PageHero>

      <section id="goyalar" className="container-x scroll-mt-28 py-12">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-lapis-700 to-lapis-950 p-8 text-white">
            <div className="girih-bg absolute inset-0 opacity-20" aria-hidden />
            <div className="relative">
              <div className="eyebrow flex items-center gap-2 text-gold-300">
                <MessageCircleQuestion className="h-4 w-4" /> {lang === 'uz' ? 'Haftaning munozarali savoli' : 'Debate question of the week'}
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold leading-snug">{settings.hubQuestion}</h2>
              {settings.hubQuestionContext && <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-lapis-100">{settings.hubQuestionContext}</p>}
              <div className="mt-7 flex flex-wrap gap-3">
                {settings.socials?.telegramGroup && (
                  <a href={settings.socials.telegramGroup} target="_blank" rel="noreferrer" className="btn-gold">
                    <Send className="h-4 w-4" /> {t.home.joinTelegram}
                  </a>
                )}
                {settings.socials?.telegramChannel && (
                  <a href={settings.socials.telegramChannel} target="_blank" rel="noreferrer" className="btn-ghost-light">
                    {lang === 'uz' ? 'Telegram kanal' : 'Telegram channel'}
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="card p-6">
            <h3 className="flex items-center gap-2 font-display text-xl font-bold text-lapis-900">
              <ShieldCheck className="h-5 w-5 text-emerald-600" /> {lang === 'uz' ? 'Muhokama madaniyati' : 'Discussion rules'}
            </h3>
            <ol className="mt-4 space-y-3">
              {(settings.hubRules ?? []).map((r, i) => (
                <li key={r.id} className="flex gap-3 text-[15px]">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-50 text-xs font-bold text-gold-700">{i + 1}</span>
                  {r.text}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="suhbatlar" className="scroll-mt-28 border-y border-line bg-sand/40 py-12">
        <div className="container-x">
          <h2 className="font-display text-3xl font-bold text-lapis-900">{lang === 'uz' ? 'Oylik davra suhbatlari va muhokamalar' : 'Monthly roundtables'}</h2>
          <p className="mt-2 max-w-2xl text-muted">{t.navDesc.sessions}</p>
          {upcoming.length > 0 && (
            <>
              <h3 className="eyebrow mb-4 mt-8 text-gold-600">{t.common.upcoming}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {upcoming.map((s) => (
                  <SessionCard key={s.id} s={s} locale={lang} />
                ))}
              </div>
            </>
          )}
          <h3 className="eyebrow mb-4 mt-10 text-lapis-600">{lang === 'uz' ? 'Arxiv' : 'Archive'}</h3>
          {past.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {past.map((s) => (
                <SessionCard key={s.id} s={s} locale={lang} />
              ))}
            </div>
          ) : (
            <Empty>{t.common.noResults}</Empty>
          )}
        </div>
      </section>

      <section id="taklif" className="container-x scroll-mt-28 py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="font-display text-3xl font-bold text-lapis-900">{lang === 'uz' ? 'Muhokama uchun mavzu taklif qiling' : 'Propose a topic'}</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-muted">
              {lang === 'uz'
                ? 'Qaysi masala sizni qiziqtiradi? Eng koʻp qoʻllab-quvvatlangan takliflar keyingi davra suhbatlari mavzusiga aylanadi.'
                : 'What issue matters to you? The most supported ideas become the next roundtable topics.'}
            </p>
          </div>
          <div className="card p-6">
            <ProposalForm locale={lang} />
          </div>
        </div>
      </section>
    </>
  )
}
