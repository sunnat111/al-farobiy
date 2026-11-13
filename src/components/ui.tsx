import Link from 'next/link'
import React from 'react'
import { ChevronRight } from 'lucide-react'
import type { Author, Media, Topic } from '@/payload-types'
import type { Locale } from '@/i18n/dict'
import { href } from '@/lib/links'
import { mediaAlt, type MediaLike } from '@/lib/media'

export function MediaImg({
  media,
  className = '',
  sizes = '(min-width: 1024px) 33vw, 100vw',
  priority = false,
  alt,
}: {
  media: MediaLike
  className?: string
  sizes?: string
  priority?: boolean
  alt?: string
}) {
  if (!media || typeof media === 'number') return <div className={`bg-sand ${className}`} aria-hidden />
  const m = media as Media
  const set = (['thumb', 'card', 'hero'] as const)
    .map((k) => (m.sizes?.[k]?.url && m.sizes?.[k]?.width ? `${m.sizes[k]!.url} ${m.sizes[k]!.width}w` : null))
    .filter(Boolean)
  if (m.url && m.width) set.push(`${m.url} ${m.width}w`)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={m.sizes?.card?.url || m.url || ''}
      srcSet={set.join(', ') || undefined}
      sizes={sizes}
      alt={alt ?? mediaAlt(m)}
      width={m.width ?? undefined}
      height={m.height ?? undefined}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`object-cover ${className}`}
    />
  )
}

export function SectionHeader({ title, href: link, linkLabel, eyebrow, light = false, align = 'center' }: { title: string; href?: string; linkLabel?: string; eyebrow?: string; light?: boolean; align?: 'center' | 'left' }) {
  const rule = light ? 'bg-gold-400/50' : 'bg-gold-500/60'
  return (
    <div className={`mb-8 flex flex-col gap-3 ${align === 'center' ? 'items-center text-center' : 'items-start'}`}>
      {eyebrow && <span className={`eyebrow ${light ? 'text-gold-300' : 'text-gold-600'}`}>{eyebrow}</span>}
      <div className="flex w-full items-center gap-4">
        {align === 'center' && <span className={`hidden h-px flex-1 sm:block ${rule}`} />}
        <h2 className={`font-display text-[1.75rem] font-bold leading-tight sm:text-[2rem] ${light ? 'text-white' : 'text-lapis-900'} ${align === 'center' ? 'mx-auto text-center sm:mx-0' : ''}`}>
          {title}
        </h2>
        <span className={`hidden h-px flex-1 sm:block ${rule}`} />
        {link && (
          <Link href={link} className={`hidden shrink-0 items-center gap-1 text-sm font-bold sm:inline-flex ${light ? 'text-gold-300 hover:text-gold-200' : 'text-lapis-700 hover:text-lapis-900'}`}>
            {linkLabel} <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      {link && (
        <Link href={link} className={`inline-flex items-center gap-1 text-sm font-bold sm:hidden ${light ? 'text-gold-300' : 'text-lapis-700'}`}>
          {linkLabel} <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}

export function TypeLabel({ children, tone = 'lapis' }: { children: React.ReactNode; tone?: 'lapis' | 'gold' | 'turquoise' | 'terracotta' | 'plum' | 'emerald' }) {
  const tones = {
    lapis: 'text-lapis-600',
    gold: 'text-gold-600',
    turquoise: 'text-turquoise-600',
    terracotta: 'text-terracotta-500',
    plum: 'text-plum-600',
    emerald: 'text-emerald-600',
  }
  return <span className={`eyebrow ${tones[tone]}`}>{children}</span>
}

const topicTones: Record<string, string> = {
  lapis: 'bg-lapis-50 text-lapis-700 hover:bg-lapis-100',
  turquoise: 'bg-turquoise-50 text-turquoise-700 hover:bg-turquoise-100',
  gold: 'bg-gold-50 text-gold-700 hover:bg-gold-100',
  terracotta: 'bg-terracotta-50 text-terracotta-700 hover:bg-terracotta-100',
  emerald: 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100',
  plum: 'bg-plum-50 text-plum-800 hover:bg-plum-100',
}

export function TopicPills({ topics, locale, max = 3 }: { topics?: (number | Topic)[] | null; locale: Locale; max?: number }) {
  const list = (topics ?? []).filter((t): t is Topic => typeof t === 'object').slice(0, max)
  if (!list.length) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {list.map((t) => (
        <Link key={t.id} href={href.topic(locale, t)} className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${topicTones[t.color ?? 'lapis']}`}>
          {t.title}
        </Link>
      ))}
    </div>
  )
}

export function AuthorLine({ authors, locale, external, className = '' }: { authors?: (number | Author)[] | null; locale: Locale; external?: string | null; className?: string }) {
  const list = (authors ?? []).filter((a): a is Author => typeof a === 'object')
  if (!list.length && !external) return null
  return (
    <span className={`text-sm text-muted ${className}`}>
      {list.map((a, i) => (
        <React.Fragment key={a.id}>
          {i > 0 && ', '}
          <Link href={href.author(locale, a)} className="font-semibold text-lapis-800 hover:underline">
            {a.name}
          </Link>
        </React.Fragment>
      ))}
      {external && <span className="font-semibold text-lapis-800">{external}</span>}
    </span>
  )
}

export function Avatar({ author, size = 40 }: { author: Author; size?: number }) {
  return (
    <span className="inline-block shrink-0 overflow-hidden rounded-full ring-2 ring-white" style={{ width: size, height: size }}>
      <MediaImg media={author.photo} className="h-full w-full" sizes={`${size * 2}px`} alt={author.name} />
    </span>
  )
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="breadcrumb" className="mb-5 flex flex-wrap items-center gap-1 text-sm text-current/70">
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
          {it.href ? (
            <Link href={it.href} className="hover:underline">
              {it.label}
            </Link>
          ) : (
            <span className="opacity-90">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

/** Dark lapis page header used by section hubs. */
export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
  children,
}: {
  eyebrow?: string
  title: string
  intro?: string | null
  crumbs?: { label: string; href?: string }[]
  children?: React.ReactNode
}) {
  return (
    <section className="relative overflow-hidden bg-lapis-900 text-white">
      <div className="girih-bg absolute inset-0 opacity-40" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-lapis-950/90 via-lapis-900/70 to-transparent" aria-hidden />
      <div className="container-x relative py-12 sm:py-16">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {eyebrow && <div className="eyebrow mb-3 text-gold-300">{eyebrow}</div>}
        <h1 className="max-w-3xl font-display text-[2.1rem] font-bold leading-[1.15] sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-lapis-100">{intro}</p>}
        {children}
      </div>
    </section>
  )
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="card px-6 py-10 text-center text-muted">{children}</div>
}
