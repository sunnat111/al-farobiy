import '@fontsource-variable/manrope'
import '@fontsource-variable/source-serif-4'
import '../globals.css'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { isLocale, locales } from '@/i18n/dict'
import { getGlobal } from '@/lib/payload'
import { STATIC_DEMO, withBase } from '@/lib/site'
import { StaticNav } from '@/components/StaticNav'
import type { SiteSetting } from '@/payload-types'

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const s = await getGlobal<SiteSetting>('site-settings', lang)
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: { default: `${s.siteName} — ${s.tagline ?? ''}`, template: `%s · ${s.siteName}` },
    description: s.description ?? undefined,
    icons: { icon: withBase('/favicon.svg') },
    alternates: { languages: { uz: withBase('/uz'), en: withBase('/en') } },
    openGraph: { siteName: s.siteName, type: 'website', locale: lang === 'uz' ? 'uz_UZ' : 'en_US' },
  }
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  return (
    <html lang={lang}>
      <body className="min-h-screen">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:px-3 focus:py-2">
          Skip
        </a>
        {STATIC_DEMO && <StaticNav />}
        <Header locale={lang} />
        <main id="main">{children}</main>
        <Footer locale={lang} />
      </body>
    </html>
  )
}
