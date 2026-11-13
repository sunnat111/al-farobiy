import React, { Suspense } from 'react'
import type { Publication } from '@/payload-types'
import type { Locale } from '@/i18n/dict'
import { find } from '@/lib/payload'
import { PublicationBrowser } from './browsers'

/** Filterable list of publications (author, year, topic, type, text) — filtering happens in the browser. */
export async function PublicationList({
  locale,
  kinds,
  sp,
  showKindFilter = false,
}: {
  locale: Locale
  kinds: Publication['kind'][]
  sp: Record<string, string | undefined>
  basePath?: string
  showKindFilter?: boolean
}) {
  const { docs } = await find<Publication>({ collection: 'publications', locale, sort: '-publishedDate', limit: 1000, depth: 1, where: { kind: { in: kinds } } })
  return (
    <Suspense>
      <PublicationBrowser docs={docs} kinds={kinds} locale={locale} initial={sp} showKindFilter={showKindFilter} />
    </Suspense>
  )
}
