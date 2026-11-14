export const href = {
  home: (l) => `/${l}`,
  courses: (l) => `/${l}/dasturlar`,
  course: (l, d) => `/${l}/dasturlar/${d.slug}`,
  research: (l) => `/${l}/tadqiqot`,
  library: (l) => `/${l}/kutubxona`,
  books: (l) => `/${l}/kutubxona/kitoblar`,
  book: (l, d) => `/${l}/kutubxona/kitoblar/${d.slug}`,
  classics: (l) => `/${l}/kutubxona/mumtoz`,
  classic: (l, d) => `/${l}/kutubxona/mumtoz/${d.slug}`,
  articles: (l) => `/${l}/kutubxona/maqolalar`,
  briefs: (l) => `/${l}/kutubxona/tahlilnomalar`,
  publication: (l, d) => {
    if (d.kind === 'research') return `/${l}/tadqiqot/${d.slug}`
    if (d.kind === 'brief') return `/${l}/kutubxona/tahlilnomalar/${d.slug}`
    return `/${l}/kutubxona/maqolalar/${d.slug}`
  },
  hub: (l) => `/${l}/hub`,
  session: (l, d) => `/${l}/hub/${d.slug}`,
  competitions: (l) => `/${l}/musobaqalar`,
  competition: (l, d) => `/${l}/musobaqalar/${d.slug}`,
  hallOfFame: (l) => `/${l}/musobaqalar/shon-sharaf`,
  about: (l) => `/${l}/loyiha`,
  topic: (l, d) => `/${l}/mavzular/${d.slug}`,
  author: (l, d) => `/${l}/mualliflar/${d.slug}`,
  search: (l) => `/${l}/qidiruv`,
}

/** Link for any document coming from a polymorphic relationship. */
export function hrefFor(l, relationTo, d) {
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
