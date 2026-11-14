import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { getDict } from '@/i18n/dict'
import { list } from '@/lib/api'
import { href } from '@/lib/links'
import { CourseCard } from '@/components/cards'
import { PageHero } from '@/components/ui'

export async function generateMetadata({ params }) {
  const { lang } = await params
  return { title: getDict(lang).nav.courses }
}

export default async function CoursesPage({ params }) {
  const { lang } = await params
  const t = getDict(lang)
  const { docs } = await list('courses', { locale: lang, sort: 'order', limit: 50 })
  const steps =
    lang === 'uz'
      ? ['Kursni tanlang va dars rejasi bilan tanishing', 'Har hafta bitta darsni oʻqing va videoni koʻring', 'Kutubxonadagi tavsiya etilgan adabiyotlarni oʻqing', 'Oʻz-oʻzini tekshirish testini topshiring']
      : ['Pick a course and read the syllabus', 'Study one lesson a week', 'Read the recommended books from the library', 'Take the self-check quiz']
  return (
    <>
      <PageHero
        eyebrow={t.nav.courses}
        title={lang === 'uz' ? 'Akademik dasturlar' : 'Academic courses'}
        intro={
          lang === 'uz'
            ? 'Siyosatshunoslik, siyosiy falsafa, mikroiqtisodiyot va qiyosiy boshqaruv boʻyicha tizimli kurslar. Har bir kursda darslar, adabiyotlar va oʻz-oʻzini tekshirish testi bor.'
            : 'Structured courses in political science, political philosophy, microeconomics and comparative government — with lessons, readings and self-check quizzes.'
        }
        crumbs={[{ label: t.siteName, href: href.home(lang) }, { label: t.nav.courses }]}
      />
      <section className="container-x py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {docs.map((c) => (
            <CourseCard key={c.id} c={c} locale={lang} />
          ))}
        </div>
        <div className="mt-14 grid gap-4 rounded-2xl border border-line bg-white p-6 sm:p-8 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-50 font-display font-bold text-gold-700">{i + 1}</span>
              <p className="text-[15px] text-ink/85">{s}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 flex items-center gap-2 text-sm text-muted">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {lang === 'uz' ? 'Barcha kurslar bepul. Roʻyxatdan oʻtish shart emas.' : 'All courses are free. No registration required.'}
        </p>
      </section>
    </>
  )
}
