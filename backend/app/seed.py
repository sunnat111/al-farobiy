"""
Fills the database with the demo content.

    python -m app.seed

WARNING: deletes all existing content (admin users are kept).
Texts come from app/seed_data/*.json, images from seed-assets/.
"""

import json
import shutil
from datetime import date, datetime, timedelta

from sqlalchemy import select

from . import models as m
from .config import ADMIN_EMAIL, ADMIN_PASSWORD, BASE_DIR, MEDIA_DIR, TZ_HOURS
from .database import Base, SessionLocal, engine
from .richtext import markdown_to_html as md
from .security import hash_password
from .utils import slugify

DATA = BASE_DIR / "app" / "seed_data"
ASSETS = BASE_DIR / "seed-assets"


def load(name: str):
    return json.loads((DATA / f"{name}.json").read_text(encoding="utf-8"))


def image(name: str) -> str | None:
    """Copy a demo image into media/ and return the name stored in the database."""
    src = ASSETS / f"{name}.webp"
    if not src.exists():
        print(f"  ! missing demo image {src.name}")
        return None
    dest = MEDIA_DIR / "demo" / src.name
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(src, dest)
    return f"demo/{src.name}"


def local_time(iso_utc: str) -> datetime:
    """'2026-11-20T18:59:00.000Z' (UTC) -> Tashkent local time without timezone."""
    utc = datetime.fromisoformat(iso_utc.replace("Z", "+00:00")).replace(tzinfo=None)
    return utc + timedelta(hours=TZ_HOURS)


def lines(values) -> str:
    return "\n".join(values)


def reset_database() -> None:
    keep = {m.User.__table__}
    Base.metadata.drop_all(engine, tables=[t for t in Base.metadata.sorted_tables if t not in keep])
    Base.metadata.create_all(engine)
    if MEDIA_DIR.exists():
        shutil.rmtree(MEDIA_DIR)
    MEDIA_DIR.mkdir(parents=True)


def run() -> None:
    print("resetting database…")
    reset_database()
    db = SessionLocal()

    # admin user ---------------------------------------------------------------
    if not db.scalar(select(m.User).where(m.User.email == ADMIN_EMAIL)):
        db.add(m.User(email=ADMIN_EMAIL, name="Administrator", password=hash_password(ADMIN_PASSWORD), role="admin"))
        print(f"admin user created: {ADMIN_EMAIL}")

    # topics & authors -----------------------------------------------------------
    people = load("people")
    topics = {}
    for i, t in enumerate(people["topics"]):
        topics[t["slug"]] = m.Topic(
            slug=t["slug"], title=t["uz"], title_en=t["en"], description=t["desc"], color=t["color"], icon=t["icon"], order=i + 1
        )
    db.add_all(topics.values())

    authors = {}
    for i, a in enumerate(people["authors"]):
        plain = a["name"].replace("Dr. ", "").replace("Prof. ", "")
        authors[a["key"]] = m.Author(
            slug=slugify(plain), name=a["name"], kind=a["kind"], position=a["position"], bio=a["bio"],
            region=a["region"], photo=image(f"author-{a['key']}"), order=i + 1,
        )
    db.add_all(authors.values())

    def T(slugs):
        return [topics[s] for s in slugs]

    def A(keys):
        return [authors[k] for k in keys or []]

    # library ----------------------------------------------------------------------
    library = load("library")
    books = {}
    for b in library["books"]:
        slug = slugify(b["title"])
        books[slug] = m.Book(
            slug=slug, title=b["title"], title_translated=b["titleUz"], authors_text=b["authors"], year=b["year"],
            category=b["category"], summary=b["summary"], why_read=b["whyRead"], badge=b.get("badge"),
            featured=b.get("featured", False), topics=T(b["topics"]), language="en", cover=image(f"book-{slug}"),
            external_url=f"https://www.google.com/search?tbm=bks&q={b['title']} {b['authors']}".replace(" ", "+"),
        )
    db.add_all(books.values())

    classics = {}
    for i, c in enumerate(library["classics"]):
        classics[c["slug"]] = m.ClassicalText(
            slug=c["slug"], title=c["title"], original_title=c["originalTitle"], thinker=c["thinker"], era=c["era"],
            original_language=c["originalLanguage"], intro=c["intro"], context=md(c["context"]),
            key_ideas=lines(f"{k['title']} | {k['text']}" for k in c["keyIdeas"]), commentary=md(c["commentary"]),
            questions=lines(c["questions"]), full_text_url=c.get("fullTextUrl"), featured=c.get("featured", False),
            topics=T(c["topics"]), order=i + 1, cover=image(f"classic-{c['slug']}"),
        )
    db.add_all(classics.values())

    # publications -------------------------------------------------------------------
    pubs = {}
    for p in load("publications"):
        pubs[p["slug"]] = m.Publication(
            slug=p["slug"], kind=p["kind"], series=p.get("series"), title=p["title"], subtitle=p.get("subtitle"),
            excerpt=p["excerpt"], content=md(p["content"]), summary=p["summary"], key_points=lines(p["keyPoints"]),
            references=lines(p.get("references", [])), authors=A(p.get("authors")),
            external_authors=p.get("externalAuthors"), journal=p.get("journal"), external_url=p.get("externalUrl"),
            published_date=date.fromisoformat(p["date"]), read_time=p["readTime"], topics=T(p["topics"]),
            language=p.get("language", "uz"), featured=p.get("featured", False), cover=image(f"pub-{p['slug']}"),
        )
    db.add_all(pubs.values())

    # courses ------------------------------------------------------------------------
    for i, c in enumerate(load("courses")):
        course = m.Course(
            slug=c["slug"], title=c["title"], title_en=c["titleEn"], code=c["code"], tagline=c["tagline"],
            summary=c["summary"], description=md(c["description"]), outcomes=lines(c["outcomes"]),
            level=c["level"], duration=c["duration"], instructors=A(c["instructors"]), topics=T(c["topics"]),
            featured=True, order=i + 1, cover=image(f"course-{c['slug']}"),
            reading_books=[books[s] for s in c["readings"] if s in books],
            reading_classics=[classics[s] for s in c["readings"] if s in classics],
            reading_publications=[pubs[s] for s in c["readings"] if s in pubs],
        )
        for n, ls in enumerate(c["lessons"]):
            bullets = "\n".join(f"- {pt}" for pt in ls["points"])
            course.lessons.append(
                m.Lesson(order=n + 1, title=ls["title"], duration=ls["duration"], summary=ls["summary"],
                         content=md(f"{ls['summary']}\n\n### Asosiy tushunchalar\n\n{bullets}"))
            )
        for n, q in enumerate(c["quiz"]):
            course.quiz.append(
                m.QuizQuestion(order=n + 1, question=q["q"], options=lines(q["options"]), correct=q["correct"], explanation=q["explanation"])
            )
        db.add(course)

    # hub ------------------------------------------------------------------------------
    hub = load("hub")
    for s in hub["sessions"]:
        db.add(
            m.Session(
                slug=s["slug"], title=s["title"], question=s["question"], summary=s["summary"],
                takeaways=lines(s["takeaways"]), notes=md(s["notes"]) if s.get("notes") else None,
                date=local_time(s["date"]), format=s["format"], location=s.get("location"),
                speakers=A(s["speakers"]), participants=s.get("participants"), topics=T(s["topics"]),
                featured=s.get("featured", False), cover=image(f"session-{s['slug']}"),
            )
        )

    current = None
    for c in hub["competitions"]:
        comp = m.Competition(
            slug=c["slug"], number=c["number"], title=c["title"], prompt=c["prompt"], description=md(c["description"]),
            rules=lines(hub["competitionRules"]),
            criteria=lines(f"{k['title']} | {k['weight']}" for k in hub["competitionCriteria"]),
            prizes=lines(hub["competitionPrizes"]), start_date=date.fromisoformat(c["startDate"]),
            deadline=local_time(c["deadline"]), min_words=c["minWords"], max_words=c["maxWords"],
            audience=c["audience"], judges=A(c["judges"]), accept_submissions=c["acceptSubmissions"],
            topics=T(c["topics"]), featured=c.get("featured", False), cover=image(f"competition-{c['number']}"),
        )
        for n, w in enumerate(c["winners"]):
            comp.winners.append(
                m.Winner(
                    order=n + 1, place=w["place"], name=w["name"], age=w["age"], school=w["school"], region=w["region"],
                    essay_title=w["essayTitle"], essay_excerpt=w["essayExcerpt"],
                    essay=md(w["essay"]) if w.get("essay") else None, photo=image(f"winner-{slugify(w['name'])}"),
                )
            )
        db.add(comp)
        if c["acceptSubmissions"] and current is None:
            current = comp

    # example inbox items (so editors see what they look like) --------------------------
    db.flush()
    if current:
        db.add(m.Submission(
            competition_id=current.id, full_name="Namuna Ishtirokchi", age=17, email="namuna@example.com",
            region="Toshkent shahri", school="Akademik litsey", essay_title="Namuna insho: ovoz va masʼuliyat",
            essay="Bu admin panelda topshirilgan insholar qanday koʻrinishini koʻrsatish uchun namuna yozuv.", word_count=14,
        ))
    db.add(m.Proposal(topic="Iqlim oʻzgarishi va Orol muammosi: yoshlar nima qila oladi?", description="Namuna taklif.", name="Namuna", contact="@namuna", region="Nukus"))

    # settings pages ------------------------------------------------------------------------
    st = hub["settings"]
    db.add(m.SiteSettings(
        site_name="AL-FOROB AVLODIDAN", tagline=st["tagline"], tagline_en="A home for knowledge, critical thinking and heritage",
        description=st["description"], announcement_enabled=True, announcement_text=st["announcement"],
        announcement_text_en="Weekly essay competition #12 is open — deadline 20 November", announcement_link="/uz/musobaqalar",
        email="info@alforob.uz", phone="+998 00 000 00 00", address="Toshkent, Oʻzbekiston",
        telegram_channel="https://t.me/alforob_avlodidan", telegram_group="https://t.me/alforob_hub",
        instagram="https://instagram.com/alforob_avlodidan", youtube="https://youtube.com/@alforob_avlodidan",
        hub_question=st["hubQuestion"], hub_question_context=st["hubQuestionContext"], hub_rules=lines(st["hubRules"]),
    ))
    db.add(m.HomePage(
        hero_eyebrow="Forobiy merosidan — zamonaviy tafakkurga",
        hero_eyebrow_en="From the heritage of al-Farabi to modern thought",
        hero_title="Yoshlar uchun siyosat, iqtisod va falsafa boʻyicha ishonchli bilim maydoni",
        hero_title_en="A trusted place for young people to learn politics, economics and philosophy",
        hero_highlight="ishonchli bilim", hero_highlight_en="trusted place",
        hero_subtitle="Akademik kurslar, ochiq tadqiqotlar, raqamli kutubxona, davra suhbatlari va haftalik insho tanlovlari — barchasi bitta platformada, oʻzbek tilida va bepul.",
        hero_subtitle_en="Courses, open research, a digital library, roundtables and weekly essay competitions — in one free platform.",
        spotlight=pubs.get("islomiy-liberal-demokratiya-konseptual-asoslar"),
    ))
    ab = hub["about"]
    db.add(m.AboutPage(
        intro=ab["intro"], manifesto=md(ab["manifesto"]), mission=ab["mission"], vision=ab["vision"],
        values=lines(f"{v['title']} | {v['text']}" for v in ab["values"]),
        faq=lines(f"{f['q']} | {f['a']}" for f in ab["faq"]),
        team=A(["jasur", "malika", "behruz", "nodira", "rustam", "dilshod", "zarina", "sardor", "kamola"]),
    ))

    db.commit()
    db.close()
    print("done.")
    print(f"admin panel: http://localhost:8000/admin  —  {ADMIN_EMAIL} / {ADMIN_PASSWORD}  (change the password!)")


if __name__ == "__main__":
    run()
