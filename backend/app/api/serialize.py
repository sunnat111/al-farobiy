"""
Turns database rows into the JSON the website reads.
Keys are camelCase because the frontend is JavaScript.
"""

from datetime import date, datetime

from .. import models as m
from ..config import TZ_OFFSET
from ..richtext import clean_html
from ..storage import file_info, image_info
from ..utils import lines, pairs


def tr(obj, field: str, locale: str):
    """Translated value: `field_en` for English if filled in, otherwise the Uzbek `field`."""
    if locale == "en":
        value = getattr(obj, f"{field}_en", None)
        if value not in (None, ""):
            return value
    return getattr(obj, field)


def html(obj, field: str, locale: str):
    return clean_html(tr(obj, field, locale))


def items(obj, field: str, locale: str) -> list[dict]:
    """One-per-line text -> [{id, text}] (the shape the frontend lists use)."""
    return [{"id": f"{field}-{i}", "text": t} for i, t in enumerate(lines(tr(obj, field, locale)))]


def when(value) -> str | None:
    """Tashkent local datetime -> ISO string with timezone, e.g. 2026-11-20T23:59:00+05:00."""
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.replace(microsecond=0).isoformat() + TZ_OFFSET
    if isinstance(value, date):
        return value.isoformat()
    return str(value)


def topic(t: m.Topic, locale: str) -> dict:
    return {
        "id": t.id, "slug": t.slug, "title": tr(t, "title", locale), "description": tr(t, "description", locale),
        "color": t.color, "icon": t.icon, "order": t.order,
    }


def author(a: m.Author, locale: str) -> dict:
    return {
        "id": a.id, "slug": a.slug, "name": a.name, "kind": a.kind,
        "position": tr(a, "position", locale), "bio": tr(a, "bio", locale),
        "photo": image_info(a.photo, a.name), "region": a.region,
        "links": {"telegram": a.telegram, "email": a.email, "website": a.website},
    }


def _common(obj, locale: str) -> dict:
    return {"id": obj.id, "slug": obj.slug, "featured": obj.featured, "status": obj.status}


def _topics(obj, locale):
    return [topic(t, locale) for t in obj.topics]


def course(c: m.Course, locale: str) -> dict:
    readings = (
        [{"relationTo": "books", "value": book(b, locale)} for b in c.reading_books if b.status == "published"]
        + [{"relationTo": "classical-texts", "value": classic(x, locale)} for x in c.reading_classics if x.status == "published"]
        + [{"relationTo": "publications", "value": publication(p, locale)} for p in c.reading_publications if p.status == "published"]
    )
    return {
        **_common(c, locale),
        "title": tr(c, "title", locale), "code": c.code, "tagline": tr(c, "tagline", locale),
        "summary": tr(c, "summary", locale), "description": html(c, "description", locale),
        "outcomes": items(c, "outcomes", locale), "cover": image_info(c.cover, c.title),
        "level": c.level, "duration": c.duration, "order": c.order,
        "instructors": [author(a, locale) for a in c.instructors], "topics": _topics(c, locale),
        "lessons": [
            {
                "id": f"lesson-{ls.id}", "title": tr(ls, "title", locale), "duration": ls.duration,
                "summary": tr(ls, "summary", locale), "videoUrl": ls.video_url, "content": html(ls, "content", locale),
            }
            for ls in c.lessons
        ],
        "quiz": [
            {
                "id": f"q-{q.id}", "question": tr(q, "question", locale),
                "options": [{"text": t} for t in lines(tr(q, "options", locale))],
                "correct": q.correct, "explanation": tr(q, "explanation", locale),
            }
            for q in c.quiz
        ],
        "readings": readings,
    }


def publication(p: m.Publication, locale: str) -> dict:
    return {
        **_common(p, locale),
        "kind": p.kind, "series": p.series or None,
        "title": tr(p, "title", locale), "subtitle": tr(p, "subtitle", locale), "excerpt": tr(p, "excerpt", locale),
        "content": html(p, "content", locale), "summary": tr(p, "summary", locale),
        "keyPoints": items(p, "key_points", locale),
        "references": [{"id": f"ref-{i}", "text": t} for i, t in enumerate(lines(p.references))],
        "cover": image_info(p.cover, p.title), "pdf": file_info(p.pdf),
        "journal": p.journal, "externalAuthors": p.external_authors, "externalUrl": p.external_url, "doi": p.doi,
        "publishedDate": when(p.published_date), "readTime": p.read_time, "language": p.language,
        "authors": [author(a, locale) for a in p.authors], "topics": _topics(p, locale),
    }


def book(b: m.Book, locale: str) -> dict:
    return {
        **_common(b, locale),
        "title": b.title, "titleTranslated": tr(b, "title_translated", locale), "authorsText": b.authors_text,
        "year": b.year, "pages": b.pages, "publisher": b.publisher,
        "summary": tr(b, "summary", locale), "whyRead": tr(b, "why_read", locale),
        "cover": image_info(b.cover, b.title), "file": file_info(b.file), "externalUrl": b.external_url,
        "category": b.category, "badge": b.badge or None, "language": b.language, "topics": _topics(b, locale),
    }


def classic(c: m.ClassicalText, locale: str) -> dict:
    return {
        **_common(c, locale),
        "title": tr(c, "title", locale), "originalTitle": c.original_title, "thinker": tr(c, "thinker", locale),
        "era": tr(c, "era", locale), "originalLanguage": tr(c, "original_language", locale),
        "intro": tr(c, "intro", locale), "context": html(c, "context", locale),
        "keyIdeas": [
            {"id": f"idea-{i}", "title": left, "text": right}
            for i, (left, right) in enumerate(pairs(tr(c, "key_ideas", locale)))
        ],
        "commentary": html(c, "commentary", locale), "questions": items(c, "questions", locale),
        "excerpt": html(c, "excerpt", locale), "file": file_info(c.file), "fullTextUrl": c.full_text_url,
        "cover": image_info(c.cover, c.thinker), "order": c.order, "topics": _topics(c, locale),
    }


def session(s: m.Session, locale: str) -> dict:
    return {
        **_common(s, locale),
        "title": tr(s, "title", locale), "question": tr(s, "question", locale), "summary": tr(s, "summary", locale),
        "takeaways": items(s, "takeaways", locale), "notes": html(s, "notes", locale),
        "cover": image_info(s.cover, s.title), "recordingUrl": s.recording_url, "joinUrl": s.join_url,
        "audio": file_info(s.audio), "guests": s.guests, "date": when(s.date), "format": s.format,
        "location": s.location, "participants": s.participants,
        "speakers": [author(a, locale) for a in s.speakers], "topics": _topics(s, locale),
    }


def winner(w: m.Winner) -> dict:
    return {
        "id": f"w-{w.id}", "place": w.place, "name": w.name, "age": w.age, "school": w.school, "region": w.region,
        "essayTitle": w.essay_title, "essayExcerpt": w.essay_excerpt, "essay": clean_html(w.essay),
        "photo": image_info(w.photo, w.name),
    }


def competition(c: m.Competition, locale: str) -> dict:
    criteria = []
    for i, (title, weight) in enumerate(pairs(tr(c, "criteria", locale))):
        criteria.append({"id": f"crit-{i}", "title": title, "weight": int(weight) if weight.isdigit() else None})
    return {
        **_common(c, locale),
        "number": c.number, "title": tr(c, "title", locale), "prompt": tr(c, "prompt", locale),
        "description": html(c, "description", locale), "rules": items(c, "rules", locale), "criteria": criteria,
        "prizes": items(c, "prizes", locale), "cover": image_info(c.cover, f"#{c.number}"),
        "winners": [winner(w) for w in c.winners],
        "startDate": when(c.start_date), "deadline": when(c.deadline),
        "minWords": c.min_words, "maxWords": c.max_words, "audience": tr(c, "audience", locale),
        "acceptSubmissions": c.accept_submissions,
        "judges": [author(a, locale) for a in c.judges], "topics": _topics(c, locale),
    }


def site_settings(s: m.SiteSettings, locale: str) -> dict:
    return {
        "siteName": s.site_name, "tagline": tr(s, "tagline", locale), "description": tr(s, "description", locale),
        "announcement": {
            "enabled": s.announcement_enabled, "text": tr(s, "announcement_text", locale), "link": s.announcement_link,
        },
        "contact": {"email": s.email, "phone": s.phone, "address": tr(s, "address", locale)},
        "socials": {
            "telegramChannel": s.telegram_channel, "telegramGroup": s.telegram_group,
            "instagram": s.instagram, "youtube": s.youtube, "facebook": s.facebook,
        },
        "hubQuestion": tr(s, "hub_question", locale), "hubQuestionContext": tr(s, "hub_question_context", locale),
        "hubRules": items(s, "hub_rules", locale),
        "partners": [{"name": n, "url": u} for n, u in pairs(s.partners)],
    }


def home_page(h: m.HomePage, locale: str) -> dict:
    spot = h.spotlight if h.spotlight and h.spotlight.status == "published" else None
    return {
        "hero": {
            "eyebrow": tr(h, "hero_eyebrow", locale), "title": tr(h, "hero_title", locale),
            "highlight": tr(h, "hero_highlight", locale), "subtitle": tr(h, "hero_subtitle", locale),
        },
        "spotlight": {"relationTo": "publications", "value": publication(spot, locale)} if spot else None,
        "stats": [{"value": v, "label": label} for v, label in pairs(h.stats)],
    }


def about_page(a: m.AboutPage, locale: str) -> dict:
    return {
        "intro": tr(a, "intro", locale), "manifesto": html(a, "manifesto", locale),
        "mission": tr(a, "mission", locale), "vision": tr(a, "vision", locale),
        "values": [{"id": f"v-{i}", "title": t, "text": x} for i, (t, x) in enumerate(pairs(tr(a, "values", locale)))],
        "faq": [{"id": f"f-{i}", "q": q, "a": x} for i, (q, x) in enumerate(pairs(tr(a, "faq", locale)))],
        "team": [author(x, locale) for x in a.team],
    }
