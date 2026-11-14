"""
Read-only REST endpoints the website uses.

  GET /api/{collection}?locale=uz&sort=-publishedDate&limit=10&kind=research,brief&topic=3
  GET /api/{collection}/{slug}?locale=en
  GET /api/globals/{site-settings|home-page|about-page}?locale=uz
  GET /api/stats

Only published items are returned.
"""

from collections.abc import Callable
from dataclasses import dataclass, field

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session as DbSession

from .. import models as m
from ..database import get_db
from . import serialize as s

router = APIRouter(prefix="/api", tags=["content"])


@dataclass
class Collection:
    model: type
    serializer: Callable
    sorts: dict[str, object]  # public sort name -> column
    default_sort: str
    published_only: bool = True
    filters: dict[str, Callable] = field(default_factory=dict)  # query param -> function(value) -> SQL condition


def _ids(value: str) -> list[int]:
    return [int(x) for x in value.split(",") if x.strip().isdigit()]


def _has_topic(relationship):
    """?topic=3 or ?topic=3,4 -> items linked to one of those topics."""
    return lambda v: relationship.any(m.Topic.id.in_(_ids(v)))


def _has_author(relationship):
    """?author=7 -> items linked to that author (as writer, instructor, speaker or judge)."""
    return lambda v: relationship.any(m.Author.id.in_(_ids(v)))


COLLECTIONS: dict[str, Collection] = {
    "courses": Collection(
        m.Course, s.course, {"order": m.Course.order, "title": m.Course.title}, "order",
        filters={"featured": lambda v: m.Course.featured.is_(v == "1"), "topic": _has_topic(m.Course.topics), "author": _has_author(m.Course.instructors)},
    ),
    "publications": Collection(
        m.Publication, s.publication,
        {"publishedDate": m.Publication.published_date, "title": m.Publication.title}, "-publishedDate",
        filters={
            "kind": lambda v: m.Publication.kind.in_(v.split(",")),
            "series": lambda v: m.Publication.series == v,
            "featured": lambda v: m.Publication.featured.is_(v == "1"),
            "topic": _has_topic(m.Publication.topics),
            "author": _has_author(m.Publication.authors),
        },
    ),
    "books": Collection(
        m.Book, s.book, {"title": m.Book.title, "year": m.Book.year}, "title",
        filters={
            "category": lambda v: m.Book.category == v,
            "featured": lambda v: m.Book.featured.is_(v == "1"),
            "topic": _has_topic(m.Book.topics),
        },
    ),
    "classical-texts": Collection(
        m.ClassicalText, s.classic, {"order": m.ClassicalText.order, "title": m.ClassicalText.title}, "order",
        filters={"featured": lambda v: m.ClassicalText.featured.is_(v == "1"), "topic": _has_topic(m.ClassicalText.topics)},
    ),
    "sessions": Collection(
        m.Session, s.session, {"date": m.Session.date}, "-date",
        filters={"topic": _has_topic(m.Session.topics), "author": _has_author(m.Session.speakers), "featured": lambda v: m.Session.featured.is_(v == "1")},
    ),
    "competitions": Collection(
        m.Competition, s.competition, {"deadline": m.Competition.deadline, "number": m.Competition.number}, "-deadline",
        filters={"topic": _has_topic(m.Competition.topics), "author": _has_author(m.Competition.judges)},
    ),
    "topics": Collection(m.Topic, s.topic, {"order": m.Topic.order}, "order", published_only=False),
    "authors": Collection(m.Author, s.author, {"order": m.Author.order, "name": m.Author.name}, "order", published_only=False),
}


def _get_collection(name: str) -> Collection:
    if name not in COLLECTIONS:
        raise HTTPException(404, f"Unknown collection '{name}'")
    return COLLECTIONS[name]


def _base_query(col: Collection):
    stmt = select(col.model)
    if col.published_only:
        stmt = stmt.where(col.model.status == "published")
    return stmt


def _locale(locale: str) -> str:
    return "en" if locale == "en" else "uz"


@router.get("/stats")
def stats(db: DbSession = Depends(get_db)):
    """Counts used on the home page and library page."""

    def n(model, *where):
        return db.scalar(select(func.count()).select_from(model).where(model.status == "published", *where))

    return {
        "courses": n(m.Course),
        "books": n(m.Book),
        "classicalTexts": n(m.ClassicalText),
        "publications": n(m.Publication),
        "articles": n(m.Publication, m.Publication.kind.in_(["article", "curated"])),
        "briefs": n(m.Publication, m.Publication.kind == "brief"),
        "competitions": n(m.Competition),
    }


GLOBALS = {
    "site-settings": (m.SiteSettings, s.site_settings),
    "home-page": (m.HomePage, s.home_page),
    "about-page": (m.AboutPage, s.about_page),
}


@router.get("/globals/{name}")
def get_global(name: str, locale: str = "uz", db: DbSession = Depends(get_db)):
    if name not in GLOBALS:
        raise HTTPException(404, f"Unknown page '{name}'")
    model, serializer = GLOBALS[name]
    row = db.scalar(select(model).limit(1))
    if row is None:
        raise HTTPException(404, "Not set up yet — run the seed script")
    return serializer(row, _locale(locale))


@router.get("/{collection}")
def list_items(
    collection: str,
    locale: str = "uz",
    sort: str | None = None,
    limit: int = Query(100, ge=1, le=1000),
    exclude: int | None = None,
    kind: str | None = None,
    series: str | None = None,
    category: str | None = None,
    featured: str | None = None,
    topic: str | None = None,
    author: str | None = None,
    db: DbSession = Depends(get_db),
):
    col = _get_collection(collection)
    stmt = _base_query(col)
    params = {"kind": kind, "series": series, "category": category, "featured": featured, "topic": topic, "author": author}
    for key, value in params.items():
        if value is None:
            continue
        if key not in col.filters:
            raise HTTPException(400, f"Filter '{key}' is not available for {collection}")
        stmt = stmt.where(col.filters[key](value))
    if exclude:
        stmt = stmt.where(col.model.id != exclude)

    sort = sort or col.default_sort
    name = sort.lstrip("-")
    if name not in col.sorts:
        raise HTTPException(400, f"Cannot sort {collection} by '{name}'. Options: {', '.join(col.sorts)}")
    column = col.sorts[name]
    stmt = stmt.order_by(column.desc() if sort.startswith("-") else column.asc(), col.model.id)

    total = db.scalar(select(func.count()).select_from(stmt.order_by(None).subquery()))
    rows = db.scalars(stmt.limit(limit)).unique().all()
    loc = _locale(locale)
    return {"docs": [col.serializer(r, loc) for r in rows], "totalDocs": total}


@router.get("/{collection}/{slug}")
def get_item(collection: str, slug: str, locale: str = "uz", db: DbSession = Depends(get_db)):
    col = _get_collection(collection)
    row = db.scalar(_base_query(col).where(col.model.slug == slug))
    if row is None:
        raise HTTPException(404, "Not found")
    return col.serializer(row, _locale(locale))
