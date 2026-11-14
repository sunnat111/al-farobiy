import React, { Suspense } from 'react'
import { list } from '@/lib/api'
import { PublicationBrowser } from './browsers'

/** Filterable list of publications (author, year, topic, type, text) — filtering happens in the browser. */
export async function PublicationList({
  locale,
  kinds,
  sp,
  showKindFilter = false,
}) {
  const { docs } = await list('publications', { locale, sort: '-publishedDate', limit: 1000, kind: kinds })
  return (
    <Suspense>
      <PublicationBrowser docs={docs} kinds={kinds} locale={locale} initial={sp} showKindFilter={showKindFilter} />
    </Suspense>
  )
}
