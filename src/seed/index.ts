/**
 * Demo data loader.  Run:  pnpm seed
 * WARNING: deletes existing content in all collections first (not users).
 */
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { getPayload } from 'payload'
import { fileURLToPath } from 'url'

import config from '../payload.config'
import { md } from './lexical'
import { avatar, bookCover, medallion, palette, wideCover } from './images'
import { authors, topics } from './data/people'
import { courses } from './data/courses'
import { publications } from './data/publications'
import { books, classics } from './data/library'
import { about, competitionCriteria, competitionPrizes, competitionRules, competitions, sessions, settings } from './data/hub'
import { slugify } from '../lib/slugify'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const assetsDir = path.resolve(dirname, '../../seed-assets')
fs.mkdirSync(assetsDir, { recursive: true })

const payload = await getPayload({ config })
const log = (m: string) => payload.logger.info(`[seed] ${m}`)

const categoryStyle = {
  'political-science': { bg: palette.lapis800, label: 'Siyosatshunoslik' },
  economics: { bg: palette.emerald, label: 'Iqtisodiyot' },
  'philosophy-law': { bg: palette.plum, label: 'Falsafa va huquq' },
  'islam-modernity': { bg: palette.turquoiseDark, label: 'Islom va zamonaviylik' },
} as const

/** Render SVG once, cache as webp in /seed-assets, upload to Media. */
async function image(name: string, svg: () => string, alt: string): Promise<number> {
  const file = path.join(assetsDir, `${name}.webp`)
  if (!fs.existsSync(file)) {
    await sharp(Buffer.from(svg())).webp({ quality: 86 }).toFile(file)
  }
  const data = fs.readFileSync(file)
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype: 'image/webp', name: `${name}.webp`, size: data.length },
  })
  return doc.id as number
}

const published = { _status: 'published' as const }

async function clear() {
  const slugs = [
    'submissions', 'proposals', 'messages', 'competitions', 'sessions', 'courses', 'publications',
    'books', 'classical-texts', 'authors', 'topics', 'media',
  ] as const
  for (const collection of slugs) {
    await payload.delete({ collection, where: { id: { exists: true } } })
  }
  const mediaDir = path.resolve(dirname, '../../media')
  if (fs.existsSync(mediaDir)) fs.rmSync(mediaDir, { recursive: true, force: true })
}

async function run() {
  log('clearing old content…')
  await clear()

  /* admin user */
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@alforob.uz'
  const password = process.env.SEED_ADMIN_PASSWORD || 'alforob-demo-2026'
  const existing = await payload.find({ collection: 'users', where: { email: { equals: email } } })
  if (!existing.docs.length) {
    await payload.create({ collection: 'users', data: { email, password, name: 'Administrator', role: 'admin' } })
    log(`admin user created: ${email}`)
  }

  /* topics */
  const topicId: Record<string, number> = {}
  for (const [i, t] of topics.entries()) {
    const doc = await payload.create({
      collection: 'topics',
      locale: 'uz',
      data: { title: t.uz, slug: t.slug, description: t.desc, color: t.color, icon: t.icon, order: i + 1 },
    })
    await payload.update({ collection: 'topics', id: doc.id, locale: 'en', data: { title: t.en } })
    topicId[t.slug] = doc.id as number
  }
  const tIds = (s: readonly string[]) => s.map((x) => topicId[x])
  log('topics ✓')

  /* authors */
  const authorId: Record<string, number> = {}
  for (const [i, a] of authors.entries()) {
    const photo = await image(`author-${a.key}`, () => avatar({ name: a.name.replace(/^(Dr\.|Prof\.)\s/, '') }), a.name)
    const doc = await payload.create({
      collection: 'authors',
      locale: 'uz',
      data: { name: a.name, slug: slugify(a.name.replace(/^(Dr\.|Prof\.)\s/, '')), kind: a.kind, position: a.position, bio: a.bio, region: a.region, photo, order: i + 1 },
    })
    authorId[a.key] = doc.id as number
  }
  const aIds = (s: readonly string[] = []) => s.map((x) => authorId[x])
  log('authors ✓')

  /* books */
  const bookId: Record<string, number> = {}
  for (const b of books) {
    const slug = slugify(b.title)
    const st = categoryStyle[b.category]
    const cover = await image(`book-${slug}`, () => bookCover({ title: b.title, author: b.authors, bg: st.bg, label: st.label }), `${b.title} — muqova`)
    const doc = await payload.create({
      collection: 'books',
      locale: 'uz',
      data: {
        ...published,
        title: b.title,
        titleTranslated: b.titleUz,
        authorsText: b.authors,
        year: b.year,
        category: b.category,
        summary: b.summary,
        whyRead: b.whyRead,
        cover,
        slug,
        badge: b.badge,
        featured: b.featured ?? false,
        topics: tIds(b.topics),
        language: 'en',
        externalUrl: `https://www.google.com/search?tbm=bks&q=${encodeURIComponent(`${b.title} ${b.authors}`)}`,
      },
    })
    bookId[slug] = doc.id as number
  }
  log(`books ✓ (${books.length})`)

  /* classical texts */
  const classicId: Record<string, number> = {}
  for (const [i, c] of classics.entries()) {
    const cover = await image(`classic-${c.slug}`, () => medallion({ name: c.thinker.replace(' (nisbat berilgan)', ''), initials: c.initials, era: c.era, bg: c.color }), c.thinker)
    const doc = await payload.create({
      collection: 'classical-texts',
      locale: 'uz',
      data: {
        ...published,
        title: c.title,
        originalTitle: c.originalTitle,
        thinker: c.thinker,
        era: c.era,
        originalLanguage: c.originalLanguage,
        intro: c.intro,
        context: md(c.context),
        keyIdeas: c.keyIdeas,
        commentary: md(c.commentary),
        questions: c.questions.map((text) => ({ text })),
        fullTextUrl: c.fullTextUrl,
        cover,
        slug: c.slug,
        topics: tIds(c.topics),
        featured: c.featured ?? false,
        order: i + 1,
      },
    })
    classicId[c.slug] = doc.id as number
  }
  log('classical texts ✓')

  /* publications */
  const pubStyle = (p: (typeof publications)[number]) => {
    if (p.kind === 'research' && p.series === 'islamic-liberal-democracy') return { bg: palette.turquoiseDark, bg2: palette.lapis900, motif: 'stars' as const, label: 'Islamic Liberal Democracy' }
    if (p.kind === 'research') return { bg: palette.terracottaDark, bg2: palette.lapis900, motif: 'arches' as const, label: 'Milliy davlatchilik' }
    if (p.kind === 'curated') return { bg: palette.plum, bg2: palette.lapis900, motif: 'rings' as const, label: 'Xalqaro jurnallar' }
    if (p.kind === 'brief') return { bg: palette.emerald, bg2: palette.lapis900, motif: 'columns' as const, label: 'Policy brief' }
    return { bg: palette.lapis700, bg2: palette.lapis900, motif: undefined, label: 'Ilmiy maqola' }
  }
  const pubId: Record<string, number> = {}
  for (const p of publications) {
    const st = pubStyle(p)
    const cover = await image(`pub-${p.slug}`, () => wideCover({ seed: p.slug, bg: st.bg, bg2: st.bg2, motif: st.motif, label: st.label }), p.title)
    const doc = await payload.create({
      collection: 'publications',
      locale: 'uz',
      data: {
        ...published,
        title: p.title,
        subtitle: p.subtitle,
        excerpt: p.excerpt,
        content: md(p.content),
        summary: p.summary,
        keyPoints: p.keyPoints.map((text) => ({ text })),
        references: (p.references ?? []).map((text) => ({ text })),
        cover,
        journal: p.journal,
        externalAuthors: p.externalAuthors,
        externalUrl: p.externalUrl,
        slug: p.slug,
        kind: p.kind,
        series: p.series,
        publishedDate: new Date(p.date).toISOString(),
        authors: aIds(p.authors),
        readTime: p.readTime,
        topics: tIds(p.topics),
        language: (p.language as 'uz' | 'en') ?? 'uz',
        featured: p.featured ?? false,
      },
    })
    pubId[p.slug] = doc.id as number
  }
  log(`publications ✓ (${publications.length})`)

  /* courses */
  for (const [i, c] of courses.entries()) {
    const cover = await image(`course-${c.slug}`, () => wideCover({ seed: c.slug, bg: c.color, motif: c.motif, label: c.code }), c.title)
    const readings = c.readings
      .map((slug) =>
        bookId[slug]
          ? { relationTo: 'books' as const, value: bookId[slug] }
          : classicId[slug]
            ? { relationTo: 'classical-texts' as const, value: classicId[slug] }
            : pubId[slug]
              ? { relationTo: 'publications' as const, value: pubId[slug] }
              : null,
      )
      .filter((x): x is NonNullable<typeof x> => Boolean(x))
    const doc = await payload.create({
      collection: 'courses',
      locale: 'uz',
      data: {
        ...published,
        title: c.title,
        code: c.code,
        tagline: c.tagline,
        summary: c.summary,
        description: md(c.description),
        outcomes: c.outcomes.map((text) => ({ text })),
        cover,
        lessons: c.lessons.map((l) => ({
          title: l.title,
          duration: l.duration,
          summary: l.summary,
          content: md(`${l.summary}\n\n### Asosiy tushunchalar\n${l.points.map((p) => `- ${p}`).join('\n')}`),
        })),
        readings,
        quiz: c.quiz.map((q) => ({ question: q.q, options: q.options.map((text) => ({ text })), correct: q.correct, explanation: q.explanation })),
        slug: c.slug,
        level: c.level,
        duration: c.duration,
        instructors: aIds(c.instructors),
        topics: tIds(c.topics),
        featured: true,
        order: i + 1,
      },
    })
    await payload.update({ collection: 'courses', id: doc.id, locale: 'en', data: { title: c.titleEn } })
  }
  log('courses ✓')

  /* sessions */
  for (const s of sessions) {
    const cover = await image(`session-${s.slug}`, () => wideCover({ seed: s.slug, bg: palette.lapis700, bg2: palette.lapis900, motif: 'table', label: 'Davra suhbati' }), s.title)
    await payload.create({
      collection: 'sessions',
      locale: 'uz',
      data: {
        ...published,
        title: s.title,
        question: s.question,
        summary: s.summary,
        takeaways: s.takeaways.map((text) => ({ text })),
        notes: s.notes ? md(s.notes) : undefined,
        cover,
        slug: s.slug,
        date: s.date,
        format: s.format,
        location: s.location,
        speakers: aIds(s.speakers),
        participants: s.participants,
        topics: tIds(s.topics),
        featured: s.featured ?? false,
      },
    })
  }
  log('sessions ✓')

  /* competitions */
  let currentCompetition: number | undefined
  for (const c of competitions) {
    const cover = await image(`competition-${c.number}`, () => wideCover({ seed: c.slug, bg: palette.terracottaDark, bg2: palette.lapis900, motif: 'pen', big: `#${c.number}` }), `Tanlov #${c.number}`)
    const winners = []
    for (const w of c.winners) {
      const photo = await image(`winner-${slugify(w.name)}`, () => avatar({ name: w.name }), w.name)
      winners.push({ ...w, essay: w.essay ? md(w.essay) : undefined, photo })
    }
    const doc = await payload.create({
      collection: 'competitions',
      locale: 'uz',
      data: {
        ...published,
        title: c.title,
        prompt: c.prompt,
        description: md(c.description),
        rules: competitionRules.map((text) => ({ text })),
        criteria: competitionCriteria,
        prizes: competitionPrizes.map((text) => ({ text })),
        cover,
        winners,
        slug: c.slug,
        number: c.number,
        startDate: new Date(c.startDate).toISOString(),
        deadline: c.deadline,
        minWords: c.minWords,
        maxWords: c.maxWords,
        audience: c.audience,
        judges: aIds(c.judges),
        acceptSubmissions: c.acceptSubmissions,
        topics: tIds(c.topics),
        featured: c.featured ?? false,
      },
    })
    if (c.acceptSubmissions && !currentCompetition) currentCompetition = doc.id as number
  }
  log('competitions ✓')

  /* example inbox items so editors see how they look */
  if (currentCompetition) {
    await payload.create({
      collection: 'submissions',
      overrideAccess: true,
      data: {
        competition: currentCompetition,
        fullName: 'Namuna Ishtirokchi',
        age: 17,
        email: 'namuna@example.com',
        region: 'Toshkent shahri',
        school: 'Akademik litsey',
        essayTitle: 'Namuna insho: ovoz va masʼuliyat',
        essay: 'Bu admin panelda topshirilgan insholar qanday koʻrinishini koʻrsatish uchun namuna yozuv.',
        wordCount: 14,
        status: 'new',
      },
    })
  }
  await payload.create({
    collection: 'proposals',
    overrideAccess: true,
    data: { topic: 'Iqlim oʻzgarishi va Orol muammosi: yoshlar nima qila oladi?', description: 'Namuna taklif.', name: 'Namuna', contact: '@namuna', region: 'Nukus' },
  })

  /* globals */
  const spotlight = pubId['islomiy-liberal-demokratiya-konseptual-asoslar']
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'uz',
    data: {
      siteName: 'AL-FOROB AVLODIDAN',
      tagline: settings.tagline,
      description: settings.description,
      announcement: { enabled: true, text: settings.announcement, link: '/uz/musobaqalar' },
      contact: { email: 'info@alforob.uz', phone: '+998 00 000 00 00', address: 'Toshkent, Oʻzbekiston' },
      socials: {
        telegramChannel: 'https://t.me/alforob_avlodidan',
        telegramGroup: 'https://t.me/alforob_hub',
        instagram: 'https://instagram.com/alforob_avlodidan',
        youtube: 'https://youtube.com/@alforob_avlodidan',
      },
      hubQuestion: settings.hubQuestion,
      hubQuestionContext: settings.hubQuestionContext,
      hubRules: settings.hubRules.map((text) => ({ text })),
      partners: [],
    },
  })
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      tagline: 'A home for knowledge, critical thinking and heritage',
      announcement: { text: 'Weekly essay competition #12 is open — deadline 20 November' },
    },
  })
  await payload.updateGlobal({
    slug: 'home-page',
    locale: 'uz',
    data: {
      hero: {
        eyebrow: 'Forobiy merosidan — zamonaviy tafakkurga',
        title: 'Yoshlar uchun siyosat, iqtisod va falsafa boʻyicha ishonchli bilim maydoni',
        highlight: 'ishonchli bilim',
        subtitle:
          'Akademik kurslar, ochiq tadqiqotlar, raqamli kutubxona, davra suhbatlari va haftalik insho tanlovlari — barchasi bitta platformada, oʻzbek tilida va bepul.',
      },
      spotlight: spotlight ? { relationTo: 'publications', value: spotlight } : undefined,
      stats: [],
    },
  })
  await payload.updateGlobal({
    slug: 'home-page',
    locale: 'en',
    data: {
      hero: {
        eyebrow: 'From the heritage of al-Farabi to modern thought',
        title: 'A trusted place for young people to learn politics, economics and philosophy',
        highlight: 'trusted place',
        subtitle: 'Courses, open research, a digital library, roundtables and weekly essay competitions — in one free platform.',
      },
    },
  })
  await payload.updateGlobal({
    slug: 'about-page',
    locale: 'uz',
    data: {
      intro: about.intro,
      manifesto: md(about.manifesto),
      mission: about.mission,
      vision: about.vision,
      values: about.values,
      team: aIds(['jasur', 'malika', 'behruz', 'nodira', 'rustam', 'dilshod', 'zarina', 'sardor', 'kamola']),
      faq: about.faq,
    },
  })
  log('globals ✓')
  log(`done. Admin: ${email} / ${password === 'alforob-demo-2026' ? password + ' (change it!)' : '(from env)'}`)
}

try {
  await run()
  process.exit(0)
} catch (e) {
  console.error(e)
  process.exit(1)
}
