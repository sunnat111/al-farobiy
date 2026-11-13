import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import { Download, ExternalLink, HelpCircle, Lightbulb } from 'lucide-react'
import type { ClassicalText } from '@/payload-types'
import { getDict, type Locale } from '@/i18n/dict'
import { find, findBySlug } from '@/lib/payload'
import { href } from '@/lib/links'
import { mediaUrl } from '@/lib/media'
import { RichText } from '@/components/RichText'
import { Breadcrumbs, MediaImg, TopicPills } from '@/components/ui'

type Params = { params: Promise<{ lang: Locale; slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang, slug } = await params
  const c = await findBySlug<ClassicalText>('classical-texts', slug, lang, 1)
  return c ? { title: `${c.thinker}: ${c.title}`, description: c.intro ?? undefined } : {}
}

export default async function ClassicPage({ params }: Params) {
  const { lang, slug } = await params
  const t = getDict(lang)
  const c = await findBySlug<ClassicalText>('classical-texts', slug, lang)
  if (!c) notFound()
  const others = await find<ClassicalText>({ collection: 'classical-texts', locale: lang, sort: 'order', limit: 20, depth: 0, where: { id: { not_equals: c.id } } })
  const file = mediaUrl(c.file)
  const hasExcerpt = Boolean((c.excerpt as { root?: { children?: unknown[] } } | null)?.root?.children?.length)

  return (
    <>
      <section className="relative overflow-hidden bg-lapis-950 text-white">
        <div className="girih-bg absolute inset-0 opacity-25" aria-hidden />
        <div className="container-x relative grid items-center gap-10 py-12 md:grid-cols-[1fr_300px]">
          <div>
            <Breadcrumbs items={[{ label: t.nav.library, href: href.library(lang) }, { label: t.labels.classics, href: href.classics(lang) }, { label: c.title }]} />
            <div className="eyebrow text-gold-300">
              {c.thinker} · {c.era}
            </div>
            <h1 className="mt-3 font-display text-[2.2rem] font-bold leading-tight sm:text-5xl">{c.title}</h1>
            {c.originalTitle && <p className="mt-2 font-display text-lg italic text-lapis-200">{c.originalTitle}</p>}
            {c.intro && <p className="mt-5 max-w-2xl font-display text-[1.15rem] leading-relaxed text-lapis-100">{c.intro}</p>}
            <div className="mt-6 flex flex-wrap gap-2">
              {file && (
                <a href={file} download className="btn-gold">
                  <Download className="h-4 w-4" /> {t.common.download}
                </a>
              )}
              {c.fullTextUrl && (
                <a href={c.fullTextUrl} target="_blank" rel="noreferrer" className="btn-ghost-light">
                  <ExternalLink className="h-4 w-4" /> {lang === 'uz' ? 'Toʻliq matn (ommaviy mulk)' : 'Full text (public domain)'}
                </a>
              )}
            </div>
          </div>
          <MediaImg media={c.cover} className="mx-auto aspect-[9/11] w-[240px] rounded-2xl shadow-2xl md:w-full" sizes="300px" priority />
        </div>
      </section>

      <div className="container-x grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 max-w-[740px]">
          {c.context && (
            <section>
              <h2 className="font-display text-2xl font-bold text-lapis-900">{lang === 'uz' ? 'Tarixiy kontekst' : 'Historical context'}</h2>
              <div className="mt-3">
                <RichText data={c.context} />
              </div>
            </section>
          )}
          {(c.keyIdeas?.length ?? 0) > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-bold text-lapis-900">{lang === 'uz' ? 'Asosiy gʻoyalar' : 'Key ideas'}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {c.keyIdeas!.map((k, i) => (
                  <div key={k.id} className="card p-5">
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-gold-50 font-display font-bold text-gold-700">{i + 1}</span>
                      <Lightbulb className="h-4 w-4 text-gold-500" />
                    </div>
                    <h3 className="mt-3 font-display text-lg font-bold text-lapis-900">{k.title}</h3>
                    <p className="mt-1.5 text-[15px] text-muted">{k.text}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          {c.commentary && (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-bold text-lapis-900">{lang === 'uz' ? 'Ilmiy sharh' : 'Commentary'}</h2>
              <div className="mt-3">
                <RichText data={c.commentary} />
              </div>
            </section>
          )}
          {hasExcerpt && (
            <section className="mt-10 rounded-2xl border border-line bg-white p-6">
              <h2 className="font-display text-xl font-bold text-lapis-900">{lang === 'uz' ? 'Asardan parcha' : 'Excerpt'}</h2>
              <RichText data={c.excerpt} />
            </section>
          )}
          {(c.questions?.length ?? 0) > 0 && (
            <section className="mt-10 rounded-2xl bg-lapis-50 p-6">
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-lapis-900">
                <HelpCircle className="h-5 w-5 text-lapis-600" /> {lang === 'uz' ? 'Muhokama uchun savollar' : 'Discussion questions'}
              </h2>
              <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-[15.5px] text-ink/90 marker:font-bold marker:text-lapis-600">
                {c.questions!.map((q) => (
                  <li key={q.id}>{q.text}</li>
                ))}
              </ol>
            </section>
          )}
        </div>
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="card p-5 text-sm">
            <dl className="space-y-3">
              {[
                [lang === 'uz' ? 'Mutafakkir' : 'Thinker', c.thinker],
                [lang === 'uz' ? 'Davri' : 'Era', c.era],
                [t.common.language, c.originalLanguage],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs font-bold uppercase tracking-wider text-muted">{k}</dt>
                    <dd className="font-semibold text-lapis-900">{v}</dd>
                  </div>
                ))}
            </dl>
            <div className="mt-4">
              <TopicPills topics={c.topics} locale={lang} max={5} />
            </div>
          </div>
          <div className="card p-5">
            <div className="eyebrow mb-3 text-gold-600">{t.labels.classics}</div>
            <ul className="space-y-2.5">
              {others.docs.map((o) => (
                <li key={o.id}>
                  <Link href={href.classic(lang, o)} className="block leading-snug hover:underline">
                    <span className="font-display font-bold text-lapis-900">{o.title}</span>
                    <span className="block text-xs text-muted">{o.thinker}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  )
}
