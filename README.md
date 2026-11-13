# AL-FOROB AVLODIDAN — MVP

An open learning and research platform for young people, inspired by the heritage of Abu Nasr al-Farabi.
The structure follows the client's six menu sections and the Yaqeen Institute teardown, with its own visual identity.

**Status:** MVP for client review. All content is demo content (people, winners and contacts are fictional placeholders; book entries are real books with editorial annotations).

## What's inside

| Part | Tech |
| --- | --- |
| Website | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| Admin panel + API | Payload CMS 3, mounted at `/admin` in the same app |
| Database | SQLite file for the MVP (swap to Postgres for production) |
| Images | Uploaded through the admin panel, resized automatically (WebP) |
| Languages | Uzbek (default, `/uz`) and English (`/en`); every text field can be translated in the admin |

### Site map

| Section | URL |
| --- | --- |
| Home | `/uz` |
| 1. Akademik dasturlar — courses with lessons, readings, self-check quiz | `/uz/dasturlar`, `/uz/dasturlar/[slug]` |
| 2. Tadqiqot va nazariya — Islamic Liberal Democracy, Milliy davlatchilik | `/uz/tadqiqot`, `/uz/tadqiqot/[slug]` |
| 3. Kutubxona — I books, II classical texts, III articles, IV policy briefs | `/uz/kutubxona/…` |
| 4. Virtual Hub — question of the week, roundtables, topic proposals | `/uz/hub`, `/uz/hub/[slug]` |
| 5. Musobaqalar — weekly competitions with submission form, Hall of Fame | `/uz/musobaqalar`, `/uz/musobaqalar/shon-sharaf` |
| 6. Loyiha haqida — manifesto, mission, team, FAQ, contact form | `/uz/loyiha` |
| Topic pages, author pages, search | `/uz/mavzular/[slug]`, `/uz/mualliflar/[slug]`, `/uz/qidiruv` |

## Run locally

Requires Node.js 22+ and pnpm.

```bash
pnpm install
cp .env.example .env        # then set PAYLOAD_SECRET to a long random string
pnpm seed                   # creates the database, demo content and an admin user
pnpm dev                    # http://localhost:3000
```

Admin panel: <http://localhost:3000/admin>
Demo login: `admin@alforob.uz` / `alforob-demo-2026` — **change it** (or set `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` before seeding).

`pnpm seed` wipes and recreates all content (users are kept). Generated demo images are cached in `seed-assets/`.

## Admin panel guide (for the client)

Everything on the site is editable in `/admin`. Section names in the left menu match the site:

| Admin group | What it controls |
| --- | --- |
| Akademik dasturlar → Kurslar | Courses: description, outcomes, lessons (with optional YouTube link), readings from the library, quiz |
| Tadqiqot va nazariya → Nashrlar | One place for research papers, articles, journal picks and policy briefs. The **Turi** (type) field decides where it appears on the site |
| Kutubxona → Zamonaviy kitoblar / Mumtoz asarlar | Book catalogue (cover, summary, “where to find” link, optional PDF) and classical texts with commentary |
| Virtual Hub → Davra suhbatlari / Muhokama uchun takliflar | Roundtables (date, speakers, takeaways, recording) and topic proposals sent from the site |
| Musobaqalar → Haftalik tanlovlar / Topshirilgan insholar | Competitions (prompt, deadline, word limits, rules, winners) and essays submitted through the site, with status and score |
| Umumiy maʼlumotlar | Authors & team, topics, media library, home page hero, About page, site settings (announcement bar, contacts, social links, question of the week) |
| Murojaatlar → Aloqa xabarlari | Messages from the contact form |
| Tizim → Admin foydalanuvchilar | Admin accounts. Roles: **Administrator** (everything) and **Muharrir** (content) |

- **Save Draft** keeps a change hidden; **Publish changes** puts it on the site immediately.
- Use the **Locale** switch (top right) to enter English text. Empty English fields fall back to Uzbek.
- Winners added to a competition appear automatically in the Hall of Fame and on the home page.

## Placeholders to replace before launch

- Contacts and social links in **Sayt sozlamalari** (`info@alforob.uz`, phone, Telegram/Instagram/YouTube handles are placeholders).
- All authors, team members, competition winners and their essays (fictional).
- Generated artwork (covers, portraits, avatars) — replace with real photos and covers via the admin.
- The “Demo kontent” note in the footer (`src/i18n/dict.ts`, `common.demoNote`).
- Only upload full PDFs of modern books if the project holds the rights; otherwise keep the “where to find” link.

## Deploying

The MVP runs anywhere Node.js runs with a persistent disk (VPS, Railway, Render, Fly.io):

```bash
pnpm build
pnpm start
```

Set `PAYLOAD_SECRET`, `DATABASE_URL` and `NEXT_PUBLIC_SERVER_URL` in the environment, and keep the database file and the `media/` folder on persistent storage.

For a serverless host such as Vercel, switch to Postgres (`@payloadcms/db-postgres`) and a cloud storage adapter for uploads (e.g. `@payloadcms/storage-s3` or Vercel Blob), then use Payload migrations instead of the automatic schema push.

## Project layout

```
src/
  app/(frontend)/[lang]/   public site pages (uz / en)
  app/(frontend)/actions.ts  form handlers (essay, proposal, contact)
  app/(payload)/            admin panel + REST/GraphQL API (generated by Payload)
  collections/, globals/    CMS content model (labels in Uzbek)
  components/               UI: header, footer, cards, forms, rich text
  i18n/dict.ts              interface texts in Uzbek and English
  seed/                     demo content and generated artwork
```
