import Link from 'next/link'
import React from 'react'
import { ArrowRight, BookMarked, BookOpen, FileText, GraduationCap, Landmark, Library, MessagesSquare, PenLine, Quote, ScrollText, Search, Send, Trophy } from 'lucide-react'
import type { Book, ClassicalText, Competition, Course, HomePage, Publication, Session, SiteSetting, Topic } from '@/payload-types'
import { getDict, type Locale } from '@/i18n/dict'
import { count, find, getGlobal } from '@/lib/payload'
import { href, hrefFor } from '@/lib/links'
import { BookCard, ClassicCard, CompetitionCard, CourseCard, FeatureCard, LibraryTile, PublicationRow, SessionCard, competitionState } from '@/components/cards'
import { MediaImg, SectionHeader } from '@/components/ui'
import { Countdown } from '@/components/interactive'
import { TopicIcon } from '@/components/TopicIcon'
import { isPast } from '@/lib/format'
import { withBase } from '@/lib/site'

function Highlight({ text, word }: { text: string; word?: string | null }) {
  if (!word || !text.includes(word)) return <>{text}</>
  const [a, b] = text.split(word)
  return (
    <>
      {a}
      <span className="relative whitespace-nowrap text-gold-300">
        {word}
        <svg viewBox="0 0 200 12" className="absolute -bottom-1.5 left-0 h-2.5 w-full" preserveAspectRatio="none" aria-hidden>
          <path d="M2 9 C 50 2, 150 2, 198 8" stroke="#C9962B" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      </span>
      {b}
    </>
  )
}

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const t = getDict(lang)

  const [home, settings, latest, courses, ild, heritage, books, classics, sessions, competitions, topics, counts] = await Promise.all([
    getGlobal<HomePage>('home-page', lang, 2),
    getGlobal<SiteSetting>('site-settings', lang),
    find<Publication>({ collection: 'publications', locale: lang, sort: '-publishedDate', limit: 6, where: { kind: { in: ['research', 'article', 'brief'] } } }),
    find<Course>({ collection: 'courses', locale: lang, sort: 'order', limit: 4 }),
    find<Publication>({ collection: 'publications', locale: lang, sort: '-publishedDate', limit: 3, where: { series: { equals: 'islamic-liberal-democracy' } } }),
    find<Publication>({ collection: 'publications', locale: lang, sort: '-publishedDate', limit: 3, where: { series: { equals: 'national-statehood' } } }),
    find<Book>({ collection: 'books', locale: lang, sort: '-year', limit: 12 }),
    find<ClassicalText>({ collection: 'classical-texts', locale: lang, sort: 'order', limit: 4, where: { featured: { equals: true } } }).then(async (r) =>
      r.docs.length >= 4 ? r : find<ClassicalText>({ collection: 'classical-texts', locale: lang, sort: 'order', limit: 4 }),
    ),
    find<Session>({ collection: 'sessions', locale: lang, sort: '-date', limit: 6 }),
    find<Competition>({ collection: 'competitions', locale: lang, sort: '-deadline', limit: 6 }),
    find<Topic>({ collection: 'topics', locale: lang, sort: 'order', limit: 12, depth: 0 }),
    Promise.all([count('courses'), count('books'), count('classical-texts'), count('publications'), count('competitions')]),
  ])

  const [cCourses, cBooks, cClassics, cPubs, cComps] = counts
  const spotlightRel = home.spotlight
  const spotlight = spotlightRel && typeof spotlightRel.value === 'object' ? spotlightRel : null
  const latestList = latest.docs.filter((p) => !(spotlight?.relationTo === 'publications' && (spotlight.value as Publication).id === p.id)).slice(0, 4)
  const activeComp = competitions.docs.find((c) => competitionState(c) === 'open')
  const upcoming = sessions.docs.filter((s) => !isPast(s.date)).reverse()
  const pastSessions = sessions.docs.filter((s) => isPast(s.date))
  const winners = competitions.docs.flatMap((c) => (c.winners ?? []).filter((w) => w.place === '1').map((w) => ({ ...w, comp: c }))).slice(0, 3)

  const [articleCount, briefCount] = await Promise.all([
    count('publications', { kind: { in: ['article', 'curated'] } }),
    count('publications', { kind: { equals: 'brief' } }),
  ])

  const sections = [
    { label: t.nav.courses, href: href.courses(lang), icon: GraduationCap },
    { label: t.nav.research, href: href.research(lang), icon: Landmark },
    { label: t.nav.library, href: href.library(lang), icon: Library },
    { label: t.nav.hub, href: href.hub(lang), icon: MessagesSquare },
    { label: t.nav.competitions, href: href.competitions(lang), icon: PenLine },
  ]

  const stats = home.stats?.length
    ? home.stats.map((s) => ({ value: s.value, label: s.label }))
    : [
        { value: String(cCourses), label: t.home.stats.courses },
        { value: String(cBooks + cClassics), label: t.home.stats.books },
        { value: String(cPubs), label: t.home.stats.publications },
        { value: String(cComps), label: t.home.stats.competitions },
      ]

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-lapis-900 text-white">
        <div className="girih-bg absolute inset-0 opacity-50" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(9,19,47,0.95)_20%,rgba(15,31,77,0.75)_55%,rgba(30,58,138,0.55))]" aria-hidden />
        <div className="container-x relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.25fr_1fr]">
          <div>
            {home.hero?.eyebrow && <div className="eyebrow mb-4 inline-flex items-center gap-2 text-gold-300"><span className="h-px w-8 bg-gold-400" />{home.hero.eyebrow}</div>}
            <h1 className="font-display text-[2.3rem] font-bold leading-[1.12] sm:text-[3.2rem]">
              <Highlight text={home.hero?.title ?? settings.siteName} word={home.hero?.highlight} />
            </h1>
            {home.hero?.subtitle && <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-lapis-100">{home.hero.subtitle}</p>}
            <form action={withBase(href.search(lang))} className="mt-8 flex max-w-xl items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
              <Search className="h-5 w-5 shrink-0 text-muted" />
              <input name="q" placeholder={t.common.searchPlaceholder} className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-ink outline-none" />
              <button className="btn-lapis shrink-0">{t.common.search}</button>
            </form>
            <div className="mt-6 flex flex-wrap gap-2">
              {sections.map(({ label, href: h, icon: Icon }) => (
                <Link key={h} href={h} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-2 text-sm font-semibold text-white transition hover:border-gold-400 hover:bg-white/10">
                  <Icon className="h-4 w-4 text-gold-300" /> {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <div key={i} className={`rounded-2xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur ${i % 2 === 1 ? 'translate-y-6' : ''}`}>
                  <div className="font-display text-5xl font-bold text-white">{s.value}</div>
                  <div className="mt-2 text-sm font-semibold text-lapis-200">{s.label}</div>
                </div>
              ))}
            </div>
            <figure className="mt-12 rounded-2xl border border-gold-400/30 bg-lapis-950/40 p-6">
              <Quote className="h-6 w-6 text-gold-400" />
              <blockquote className="mt-2 font-display text-lg italic leading-relaxed text-lapis-50">
                {lang === 'uz'
                  ? 'Inson oʻz kamolotiga yolgʻiz erisha olmaydi; buning uchun u boshqalar bilan hamjihatlikda yashashi zarur.'
                  : 'No human being can attain perfection alone; for that, people must live together in cooperation.'}
              </blockquote>
              <figcaption className="mt-3 text-sm font-semibold text-gold-300">— {lang === 'uz' ? 'Abu Nasr Forobiy gʻoyasi asosida' : 'After Abu Nasr al-Farabi'}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* STATS (mobile) */}
      <section className="border-b border-line bg-white lg:hidden">
        <div className="container-x grid grid-cols-2 gap-px py-2 sm:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="px-2 py-3 text-center">
              <div className="font-display text-3xl font-bold text-lapis-800">{s.value}</div>
              <div className="text-xs font-semibold text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SPOTLIGHT + LATEST */}
      <section className="container-x py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.45fr_1fr]">
          <div>
            {spotlight?.relationTo === 'publications' ? (
              <FeatureCard p={spotlight.value as Publication} locale={lang} />
            ) : spotlight ? (
              <Link href={hrefFor(lang, spotlight.relationTo, spotlight.value as { slug?: string })} className="block rounded-2xl bg-lapis-900 p-8 text-white">
                {(spotlight.value as { title?: string }).title}
              </Link>
            ) : (
              latest.docs[0] && <FeatureCard p={latest.docs[0]} locale={lang} />
            )}
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-lapis-900">{t.home.latest}</h2>
              <Link href={href.articles(lang)} className="text-sm font-bold text-lapis-700 hover:underline">
                {t.common.viewAll} →
              </Link>
            </div>
            <div className="divide-y divide-line">
              {latestList.map((p) => (
                <PublicationRow key={p.id} p={p} locale={lang} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVE COMPETITION */}
      {activeComp && (
        <section className="relative overflow-hidden bg-gradient-to-br from-terracotta-700 via-lapis-900 to-lapis-950 text-white">
          <div className="girih-bg absolute inset-0 opacity-25" aria-hidden />
          <div className="container-x relative grid items-center gap-8 py-12 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="eyebrow inline-flex items-center gap-2 text-gold-300">
                <PenLine className="h-4 w-4" /> {t.home.activeCompetition} · #{activeComp.number}
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">{activeComp.title}</h2>
              <p className="mt-3 max-w-2xl font-display text-[18px] leading-relaxed text-lapis-100">“{activeComp.prompt}”</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`${href.competition(lang, activeComp)}#topshirish`} className="btn-gold">
                  {t.home.submitEssay} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={href.competition(lang, activeComp)} className="btn-ghost-light">
                  {t.common.readMore}
                </Link>
              </div>
            </div>
            <div className="lg:justify-self-end">
              <div className="mb-3 text-sm font-semibold text-lapis-200">{t.common.deadline}</div>
              <Countdown to={activeComp.deadline} labels={{ days: t.common.days, hours: t.common.hours, minutes: t.common.minutes, seconds: t.common.seconds }} />
            </div>
          </div>
        </section>
      )}

      {/* COURSES */}
      <section className="container-x py-14 sm:py-16">
        <SectionHeader title={t.home.courses} eyebrow={t.navDesc.allCourses} href={href.courses(lang)} linkLabel={t.common.viewAll} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {courses.docs.map((c) => (
            <CourseCard key={c.id} c={c} locale={lang} />
          ))}
        </div>
      </section>

      {/* RESEARCH */}
      <section className="girih-bg-soft border-y border-line bg-sand/50 py-14 sm:py-16">
        <div className="container-x">
          <SectionHeader title={t.home.research} href={href.research(lang)} linkLabel={t.common.viewAll} />
          <div className="grid gap-6 lg:grid-cols-2">
            {[
              { key: 'ild', title: t.labels.ild, desc: t.navDesc.ild, list: ild.docs, tone: 'from-turquoise-700 to-lapis-900', anchor: '#ild' },
              { key: 'meros', title: t.labels.statehood, desc: t.navDesc.statehood, list: heritage.docs, tone: 'from-terracotta-700 to-lapis-900', anchor: '#meros' },
            ].map((s) => (
              <div key={s.key} className="card overflow-hidden">
                <div className={`relative bg-gradient-to-br ${s.tone} p-6 text-white`}>
                  <div className="girih-bg absolute inset-0 opacity-20" aria-hidden />
                  <div className="relative">
                    <h3 className="font-display text-2xl font-bold">{s.title}</h3>
                    <p className="mt-1.5 text-sm text-white/80">{s.desc}</p>
                  </div>
                </div>
                <div className="divide-y divide-line px-5">
                  {s.list.map((p) => (
                    <PublicationRow key={p.id} p={p} locale={lang} showImage={false} />
                  ))}
                </div>
                <div className="border-t border-line px-5 py-3">
                  <Link href={`${href.research(lang)}${s.anchor}`} className="text-sm font-bold text-lapis-700 hover:underline">
                    {t.common.viewAll} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIBRARY */}
      <section className="container-x py-14 sm:py-16">
        <SectionHeader title={t.home.library} eyebrow={t.nav.library} href={href.library(lang)} linkLabel={t.common.viewAll} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <LibraryTile title={`I. ${t.labels.books}`} desc={t.navDesc.books} href={href.books(lang)} count={cBooks} icon={BookOpen} tone="bg-lapis-50 text-lapis-700" />
          <LibraryTile title={`II. ${t.labels.classics}`} desc={t.navDesc.classics} href={href.classics(lang)} count={cClassics} icon={ScrollText} tone="bg-gold-50 text-gold-700" />
          <LibraryTile title={`III. ${t.labels.articles}`} desc={t.navDesc.articles} href={href.articles(lang)} count={articleCount} icon={FileText} tone="bg-plum-50 text-plum-800" />
          <LibraryTile title={`IV. ${t.labels.briefs}`} desc={t.navDesc.briefs} href={href.briefs(lang)} count={briefCount} icon={BookMarked} tone="bg-emerald-50 text-emerald-800" />
        </div>
        <div className="no-scrollbar -mx-4 mt-10 flex snap-x gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
          {books.docs.map((b) => (
            <div key={b.id} className="w-[150px] shrink-0 snap-start sm:w-[170px]">
              <BookCard b={b} locale={lang} />
            </div>
          ))}
        </div>
      </section>

      {/* CLASSICS */}
      <section className="bg-lapis-950 py-14 text-white sm:py-16">
        <div className="container-x">
          <SectionHeader title={t.home.thinkers} eyebrow={t.labels.classics} href={href.classics(lang)} linkLabel={t.common.viewAll} light />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {classics.docs.map((c) => (
              <ClassicCard key={c.id} c={c} locale={lang} />
            ))}
          </div>
        </div>
      </section>

      {/* HUB */}
      <section className="container-x py-14 sm:py-16">
        <SectionHeader title={t.home.hub} eyebrow={t.labels.ideas} href={href.hub(lang)} linkLabel={t.common.viewAll} />
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-lapis-700 to-lapis-900 p-7 text-white">
            <div className="girih-bg absolute inset-0 opacity-20" aria-hidden />
            <div className="relative">
              <div className="eyebrow text-gold-300">{lang === 'uz' ? 'Haftaning savoli' : 'Question of the week'}</div>
              <p className="mt-3 font-display text-2xl font-bold leading-snug">{settings.hubQuestion}</p>
              {settings.hubQuestionContext && <p className="mt-3 text-[15px] leading-relaxed text-lapis-100">{settings.hubQuestionContext}</p>}
              <div className="mt-6 flex flex-wrap gap-3">
                {settings.socials?.telegramGroup && (
                  <a href={settings.socials.telegramGroup} target="_blank" rel="noreferrer" className="btn-gold">
                    <Send className="h-4 w-4" /> {t.home.joinTelegram}
                  </a>
                )}
                <Link href={`${href.hub(lang)}#taklif`} className="btn-ghost-light">
                  {lang === 'uz' ? 'Mavzu taklif qilish' : 'Propose a topic'}
                </Link>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            {[...upcoming.slice(0, 1), ...pastSessions.slice(0, 2)].map((s) => (
              <SessionCard key={s.id} s={s} locale={lang} />
            ))}
          </div>
        </div>
      </section>

      {/* HALL OF FAME */}
      {winners.length > 0 && (
        <section className="girih-bg-soft border-y border-line bg-gold-50/60 py-14 sm:py-16">
          <div className="container-x">
            <SectionHeader title={t.home.hall} eyebrow={t.labels.weekly} href={href.hallOfFame(lang)} linkLabel={t.common.viewAll} />
            <div className="grid gap-5 md:grid-cols-3">
              {winners.map((w) => (
                <article key={w.id ?? w.name} className="card relative flex flex-col p-6">
                  <Trophy className="absolute right-5 top-5 h-6 w-6 text-gold-500" />
                  <div className="flex items-center gap-3">
                    <span className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-gold-300">
                      <MediaImg media={w.photo} className="h-full w-full" sizes="96px" alt={w.name} />
                    </span>
                    <div>
                      <div className="font-bold text-lapis-900">{w.name}</div>
                      <div className="text-xs text-muted">
                        {w.region} · #{w.comp.number}
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold leading-snug text-lapis-900">“{w.essayTitle}”</h3>
                  {w.essayExcerpt && <p className="mt-2 line-clamp-4 font-display text-[16px] italic leading-relaxed text-ink/80">{w.essayExcerpt}</p>}
                  <Link href={`${href.hallOfFame(lang)}#${w.id}`} className="mt-auto pt-4 text-sm font-bold text-lapis-700 hover:underline">
                    {t.common.read} →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TOPICS */}
      <section className="container-x py-14 sm:py-16">
        <SectionHeader title={t.home.topics} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {topics.docs.map((tp) => (
            <Link key={tp.id} href={href.topic(lang, tp)} className="card group flex flex-col items-start gap-3 p-4 transition hover:-translate-y-0.5 hover:border-lapis-300">
              <TopicIcon topic={tp} />
              <span className="font-display text-[15px] font-bold leading-snug text-lapis-900 group-hover:underline decoration-gold-500 underline-offset-4">{tp.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* extra: more competitions for discovery */}
      {competitions.docs.length > 1 && (
        <section className="container-x pb-4">
          <SectionHeader title={t.labels.weekly} href={href.competitions(lang)} linkLabel={t.common.viewAll} />
          <div className="grid gap-5 md:grid-cols-3">
            {competitions.docs.slice(0, 3).map((c) => (
              <CompetitionCard key={c.id} c={c} locale={lang} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}

