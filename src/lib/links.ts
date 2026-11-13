import type { Locale } from '@/i18n/dict'

type Doc = { slug?: string | null; kind?: string | null }

export const href = {
  home: (l: Locale) => `/${l}`,
  courses: (l: Locale) => `/${l}/dasturlar`,
  course: (l: Locale, d: Doc) => `/${l}/dasturlar/${d.slug}`,
  research: (l: Locale) => `/${l}/tadqiqot`,
  library: (l: Locale) => `/${l}/kutubxona`,
  books: (l: Locale) => `/${l}/kutubxona/kitoblar`,
  book: (l: Locale, d: Doc) => `/${l}/kutubxona/kitoblar/${d.slug}`,
  classics: (l: Locale) => `/${l}/kutubxona/mumtoz`,
  classic: (l: Locale, d: Doc) => `/${l}/kutubxona/mumtoz/${d.slug}`,
  articles: (l: Locale) => `/${l}/kutubxona/maqolalar`,
  briefs: (l: Locale) => `/${l}/kutubxona/tahlilnomalar`,
  publication: (l: Locale, d: Doc) => {
    if (d.kind === 'research') return `/${l}/tadqiqot/${d.slug}`
    if (d.kind === 'brief') return `/${l}/kutubxona/tahlilnomalar/${d.slug}`
    return `/${l}/kutubxona/maqolalar/${d.slug}`
  },
  hub: (l: Locale) => `/${l}/hub`,
  session: (l: Locale, d: Doc) => `/${l}/hub/${d.slug}`,
  competitions: (l: Locale) => `/${l}/musobaqalar`,
  competition: (l: Locale, d: Doc) => `/${l}/musobaqalar/${d.slug}`,
  hallOfFame: (l: Locale) => `/${l}/musobaqalar/shon-sharaf`,
  about: (l: Locale) => `/${l}/loyiha`,
  topic: (l: Locale, d: Doc) => `/${l}/mavzular/${d.slug}`,
  author: (l: Locale, d: Doc) => `/${l}/mualliflar/${d.slug}`,
  search: (l: Locale) => `/${l}/qidiruv`,
}

/** Link for any document coming from a polymorphic relationship. */
export function hrefFor(l: Locale, relationTo: string, d: Doc): string {
  switch (relationTo) {
    case 'courses':
      return href.course(l, d)
    case 'publications':
      return href.publication(l, d)
    case 'books':
      return href.book(l, d)
    case 'classical-texts':
      return href.classic(l, d)
    case 'sessions':
      return href.session(l, d)
    case 'competitions':
      return href.competition(l, d)
    default:
      return href.home(l)
  }
}
