'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BASE_PATH } from '@/lib/site'
import React, { useEffect, useRef, useState } from 'react'
import { ChevronDown, Menu, PenLine, Search, X, ArrowRight } from 'lucide-react'
import { Wordmark } from './Logo'

export function HeaderClient({
  locale,
  nav,
  announcement,
  labels,
  ctaHref,
  searchHref,
}) {
  const [open, setOpen] = useState(null)
  const [drawer, setDrawer] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [annHidden, setAnnHidden] = useState(false)
  const [mobileGroup, setMobileGroup] = useState(null)
  const ref = useRef(null)
  const pathname = usePathname()
  const closeTimer = useRef(null)

  useEffect(() => {
    setOpen(null)
    setDrawer(false)
    setSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && (setOpen(null), setDrawer(false), setSearchOpen(false))
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
  }, [drawer])

  const otherLocale = locale === 'uz' ? 'en' : 'uz'
  const switchHref = pathname ? pathname.replace(/^\/(uz|en)(?=\/|$)/, `/${otherLocale}`) : `/${otherLocale}`
  const active = (g) => pathname?.startsWith(g.href)

  const enter = (k) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(k)
  }
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 160)
  }

  const onSearch = (e) => {
    e.preventDefault()
    const q = new FormData(e.currentTarget).get('q')
    // full page load: also works on the static snapshot, which has no server to answer client navigation
    window.location.href = `${BASE_PATH}${searchHref}?q=${encodeURIComponent(String(q ?? ''))}`
  }

  return (
    <div ref={ref} className="sticky top-0 z-50">
      {announcement && !annHidden && announcement.text && (
        <div className="bg-lapis-950 text-[13px] text-lapis-100">
          <div className="container-x flex items-center justify-between gap-3 py-2">
            <span className="hidden w-5 sm:block" />
            {announcement.link ? (
              <Link href={announcement.link} className="mx-auto text-center font-semibold hover:text-white">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-gold-400 align-middle" />
                {announcement.text} <span className="text-gold-300">→</span>
              </Link>
            ) : (
              <span className="mx-auto text-center">{announcement.text}</span>
            )}
            <button onClick={() => setAnnHidden(true)} aria-label="Yopish" className="rounded p-0.5 text-lapis-300 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <header className="border-b border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
        <div className="container-x flex h-[72px] items-center gap-4">
          <Link href={`/${locale}`} className="shrink-0" aria-label="AL-FOROB AVLODIDAN">
            <Wordmark />
          </Link>

          <nav className="ml-2 hidden flex-1 items-center justify-center gap-0 xl:flex" aria-label="Asosiy menyu">
            {nav.map((g) => (
              <div key={g.key} className="relative" onMouseEnter={() => enter(g.key)} onMouseLeave={leave}>
                <button
                  onClick={() => setOpen(open === g.key ? null : g.key)}
                  aria-expanded={open === g.key}
                  className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-[14.5px] font-semibold transition ${
                    active(g) || open === g.key ? 'text-lapis-800 bg-lapis-50' : 'text-ink/80 hover:text-lapis-800'
                  }`}
                >
                  {g.label}
                  <ChevronDown className={`h-4 w-4 transition ${open === g.key ? 'rotate-180' : ''}`} />
                </button>
                {open === g.key && (
                  <div className="absolute left-1/2 top-full z-50 w-[min(560px,90vw)] -translate-x-1/2 pt-3">
                    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_60px_-20px_rgba(9,19,47,0.35)]">
                      <div className="flex items-center justify-between border-b border-line bg-sand/60 px-5 py-3">
                        <span className="font-display text-[15px] font-bold text-lapis-900">{g.title}</span>
                        <Link href={g.href} className="inline-flex items-center gap-1 text-xs font-bold text-lapis-700 hover:underline">
                          {labels.viewAll} <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                      <ul className="grid gap-0.5 p-2">
                        {g.items.map((it) => (
                          <li key={it.href + it.label}>
                            <Link href={it.href} className="group flex gap-3 rounded-xl px-3 py-2.5 hover:bg-lapis-50">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-500" />
                              <span>
                                <span className="flex items-center gap-2 text-[14.5px] font-bold text-lapis-900 group-hover:text-lapis-700">
                                  {it.label}
                                  {it.badge && <span className="rounded bg-lapis-50 px-1.5 py-0.5 text-[10px] font-bold text-lapis-600 group-hover:bg-white">{it.badge}</span>}
                                </span>
                                {it.desc && <span className="mt-0.5 block text-[13px] leading-snug text-muted">{it.desc}</span>}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 xl:ml-0">
            <button onClick={() => setSearchOpen((v) => !v)} className="grid h-10 w-10 place-items-center rounded-full text-lapis-800 hover:bg-lapis-50" aria-label={labels.search}>
              <Search className="h-5 w-5" />
            </button>
            <Link href={switchHref} className="grid h-10 min-w-10 place-items-center rounded-full px-2 text-xs font-extrabold tracking-wider text-lapis-800 hover:bg-lapis-50" aria-label="Language">
              {otherLocale.toUpperCase()}
            </Link>
            <Link href={ctaHref} className="btn-gold hidden sm:inline-flex">
              <PenLine className="h-4 w-4" /> {labels.cta}
            </Link>
            <button onClick={() => setDrawer(true)} className="grid h-10 w-10 place-items-center rounded-full text-lapis-800 hover:bg-lapis-50 xl:hidden" aria-label="Menu">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-line bg-white">
            <form onSubmit={onSearch} className="container-x flex items-center gap-3 py-3">
              <Search className="h-5 w-5 text-muted" />
              <input name="q" autoFocus placeholder={labels.searchPlaceholder} className="flex-1 bg-transparent py-2 text-[16px] outline-none" />
              <button className="btn-lapis">{labels.search}</button>
            </form>
          </div>
        )}
      </header>

      {drawer && (
        <div className="fixed inset-0 z-[60] xl:hidden">
          <div className="absolute inset-0 bg-lapis-950/50" onClick={() => setDrawer(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-[min(380px,90vw)] flex-col bg-paper shadow-2xl">
            <div className="flex h-[72px] items-center justify-between border-b border-line px-4">
              <Wordmark compact />
              <button onClick={() => setDrawer(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-lapis-50" aria-label="Yopish">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-2 py-3">
              {nav.map((g) => (
                <div key={g.key} className="border-b border-line/70">
                  <button onClick={() => setMobileGroup(mobileGroup === g.key ? null : g.key)} className="flex w-full items-center justify-between px-3 py-3.5 text-left font-display text-[17px] font-bold text-lapis-900">
                    {g.title}
                    <ChevronDown className={`h-5 w-5 transition ${mobileGroup === g.key ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileGroup === g.key && (
                    <ul className="pb-3">
                      {g.items.map((it) => (
                        <li key={it.href + it.label}>
                          <Link href={it.href} className="block rounded-lg px-4 py-2 hover:bg-lapis-50">
                            <span className="block text-[15px] font-semibold text-lapis-800">{it.label}</span>
                            {it.desc && <span className="block text-[13px] text-muted">{it.desc}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-line p-4">
              <Link href={ctaHref} className="btn-gold w-full">
                <PenLine className="h-4 w-4" /> {labels.cta}
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
