# AL-FOROB AVLODIDAN — MVP

An open learning and research platform for young people, inspired by the heritage of Abu Nasr al-Farabi.
The structure follows the client's six menu sections and the Yaqeen Institute teardown, with its own visual identity.

**Status:** MVP for client review. All content is demo content (people, winners and contacts are fictional placeholders; book entries are real books with editorial annotations).

## How the project is built

Two separate programs that talk over a REST API:

```
Browser ──▶ Website (Next.js / React, JavaScript) ──REST API──▶ Backend (FastAPI, Python) ──▶ SQLite database
            port 3000, folder ./                                 port 8000, folder ./backend
                                                                 also serves /admin (admin panel) and /media (uploads)
```

| Part | Language | Tech |
| --- | --- | --- |
| Website | JavaScript | Next.js 16 (React framework), React 19, Tailwind CSS 4 |
| Backend + REST API | Python 3.10+ | FastAPI, SQLAlchemy 2, Pydantic |
| Admin panel | Python | SQLAdmin (fully in Uzbek), Quill rich-text editor |
| Database | — | SQLite file for the MVP (PostgreSQL for production) |
| Images | — | Uploaded in the admin panel, resized to WebP automatically (Pillow) |
| Languages | — | Uzbek (default, `/uz`) and English (`/en`); every text field has an "(EN)" version in the admin |

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

## Run it on your computer

You need **Python 3.10 or newer** (`python3 --version`), **Node.js 22+** and **pnpm** (`npm install -g pnpm`).
Use two terminal windows: one for the backend, one for the website.

### 1. Backend (Python)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # then set SECRET_KEY to a long random string
python -m app.seed                 # creates the database with the demo content and an admin user
uvicorn app.main:app --reload --port 8000
```

- Admin panel: <http://localhost:8000/admin> — demo login `admin@alforob.uz` / `alforob-demo-2026` (**change it**, or set `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` before seeding)
- Interactive API documentation: <http://localhost:8000/docs>
- `python -m app.seed` wipes and recreates all content (admin users are kept).

### 2. Website (JavaScript)

```bash
pnpm install
cp .env.example .env               # API_URL=http://localhost:8000
pnpm dev
```

Open <http://localhost:3000>. The backend must be running, because every page gets its data from it.

## The REST API

| Method | Address | What it returns |
| --- | --- | --- |
| GET | `/api/{collection}?locale=uz&sort=-publishedDate&limit=10&…` | List: `{docs, totalDocs}`. Collections: `courses`, `publications`, `books`, `classical-texts`, `sessions`, `competitions`, `topics`, `authors`. Filters: `kind`, `series`, `category`, `featured`, `topic`, `author`, `exclude` |
| GET | `/api/{collection}/{slug}?locale=en` | One item |
| GET | `/api/globals/{site-settings\|home-page\|about-page}` | Settings pages |
| GET | `/api/stats` | Counts for the home page |
| POST | `/api/forms/essay`, `/api/forms/proposal`, `/api/forms/message` | Saves a form; returns `{ok, message, errors}` |

Only published items are returned. All form rules (required fields, word limits, deadline, one essay per email) are checked in Python in `backend/app/api/forms.py`.

## Admin panel guide (for the client)

Everything on the site is editable at `/admin`. The left menu follows the site:

| Admin group | What it controls |
| --- | --- |
| Akademik dasturlar → Kurslar, Darslar, Test savollari | Courses; their lessons (with optional YouTube link) and quiz questions are separate lists linked to a course |
| Tadqiqot va nazariya → Nashrlar | Research papers, articles, journal picks and policy briefs. **Turi** (type) decides where it appears |
| Kutubxona → Zamonaviy kitoblar, Mumtoz asarlar | Book catalogue and classical texts with commentary |
| Virtual Hub → Davra suhbatlari, Muhokama uchun takliflar | Roundtables and topic proposals sent from the site |
| Musobaqalar → Haftalik tanlovlar, Gʻoliblar, Topshirilgan insholar | Competitions, their winners (shown in the Hall of Fame), essays submitted from the site |
| Umumiy maʼlumotlar | Authors & team, topics, home page banner, About page, site settings (announcement bar, contacts, social links, question of the week) |
| Murojaatlar → Aloqa xabarlari | Contact form messages |
| Tizim → Admin foydalanuvchilar | Accounts (only for Administrators). Roles: **Administrator** and **Muharrir** (editor) |

- **Holati** (status): "Eʼlon qilingan" shows on the site, "Qoralama" (draft) hides it.
- Fields marked **(EN)** hold the English text; if empty, the Uzbek text is shown on the English site.
- Fields marked "Har qatorga bittadan" take one item per line; "chap qism | oʻng qism" fields take two parts separated by `|`.

## Placeholders to replace before launch

- Contacts and social links in **Sayt sozlamalari** (`info@alforob.uz`, phone, Telegram/Instagram/YouTube handles are placeholders).
- All authors, team members, competition winners and their essays (fictional).
- Generated artwork (covers, portraits, avatars) — replace with real photos and covers via the admin.
- The "Demo kontent" note in the footer (`src/i18n/dict.js`, `common.demoNote`).
- Only upload full PDFs of modern books if the project holds the rights; otherwise keep the "where to find" link.

## Deploying

Both parts need a server (e.g. a VPS, Railway or Render):

- **Backend:** `uvicorn app.main:app --host 0.0.0.0 --port 8000`, with `SECRET_KEY`, `DATABASE_URL`, `PUBLIC_URL` (the backend's public address, used in image links) and `FRONTEND_URL` set. Keep the database file and `backend/media/` on persistent storage, or use PostgreSQL. For schema changes in production, add Alembic migrations.
- **Website:** `pnpm build && pnpm start`, with `API_URL` pointing to the backend.

### Read-only preview on GitHub Pages

GitHub Pages only serves static files (no server, no database), so it hosts a **snapshot**: every page, menu, filter, search, quiz and countdown works, but forms show a "demo" notice and there is no admin panel.

```bash
pnpm export:static          # backend must be running; builds ./out for https://sunnat111.github.io/al-farobiy/
```

The snapshot is published on the `gh-pages` branch; to update it, run the export and replace that branch's contents with `./out`.
The snapshot is frozen at export time — e.g. a competition shown as "open" stays open until you re-export.

## Project layout

```
backend/                     Python
  app/main.py                FastAPI app: mounts /api, /admin, /media
  app/models.py              database tables (SQLAlchemy)
  app/api/content.py         read endpoints (lists, single items, settings, stats)
  app/api/serialize.py       database rows -> JSON for the website
  app/api/forms.py           form endpoints with all validation rules
  app/admin/                 admin panel screens, login, Uzbek translation, editor
  app/seed.py + seed_data/   demo content loader
  seed-assets/               demo images
src/                         JavaScript (Next.js / React)
  app/(frontend)/[lang]/     pages, one folder per URL
  app/(frontend)/actions.js  sends forms to the backend
  lib/api.js                 every call to the backend goes through here
  components/                header, footer, cards, forms, filters, rich text
  i18n/dict.js               interface texts in Uzbek and English
scripts/export-static.mjs    GitHub Pages snapshot
```
