"""
Database tables (SQLAlchemy models).

Conventions used everywhere:
- Translatable text has two columns: `title` (Uzbek, main) and `title_en` (English, optional).
  If the English one is empty, the site shows the Uzbek text.
- Simple lists (rules, key points, takeaways…) are stored as text with one item per line.
- Public content has `status` = "published" or "draft"; drafts never reach the website.
"""

from datetime import date, datetime

from sqlalchemy import Boolean, Column, Date, DateTime, ForeignKey, Integer, String, Table, Text, event, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base
from .storage import file_column, image_column
from .utils import slugify

# --------------------------------------------------------------------------- choices
# (value stored in the database, label shown in the admin panel)

STATUS = [("published", "Eʼlon qilingan"), ("draft", "Qoralama (saytda koʻrinmaydi)")]
TOPIC_COLORS = [(c, c) for c in ("lapis", "turquoise", "gold", "terracotta", "emerald", "plum")]
TOPIC_ICONS = [(c, c) for c in ("landmark", "scale", "coins", "book-open", "moon-star", "flag", "globe", "users")]
AUTHOR_KINDS = [
    ("team", "Jamoa aʼzosi"),
    ("mentor", "Mentor"),
    ("researcher", "Tadqiqotchi"),
    ("student", "Talaba / yosh muallif"),
    ("guest", "Mehmon spiker"),
]
LEVELS = [("beginner", "Boshlangʻich"), ("intermediate", "Oʻrta"), ("advanced", "Yuqori")]
PUBLICATION_KINDS = [
    ("research", "Tadqiqot ishi (Tadqiqot va nazariya)"),
    ("article", "Ilmiy maqola (Kutubxona III)"),
    ("curated", "Xalqaro jurnaldan tanlangan maqola (Kutubxona III)"),
    ("brief", "Siyosiy tahlilnoma (Kutubxona IV)"),
]
RESEARCH_SERIES = [
    ("", "—"),
    ("islamic-liberal-democracy", "Islamic Liberal Democracy"),
    ("national-statehood", "Milliy davlatchilik va meros"),
    ("other", "Boshqa tadqiqotlar"),
]
BOOK_CATEGORIES = [
    ("political-science", "Siyosatshunoslik va demokratiya"),
    ("economics", "Iqtisodiy nazariya va rivojlanish"),
    ("philosophy-law", "Falsafa va huquq"),
    ("islam-modernity", "Islom va zamonaviylik"),
]
BOOK_BADGES = [("", "—"), ("new", "Yangi"), ("recommended", "Tavsiya"), ("book-club", "Kitob klubi")]
LANGUAGES = [("uz", "Oʻzbekcha"), ("en", "Inglizcha"), ("ru", "Ruscha"), ("ar", "Arabcha"), ("fa", "Forscha")]
SESSION_FORMATS = [("online", "Onlayn"), ("offline", "Oflayn"), ("hybrid", "Gibrid"), ("audio", "Audio (Telegram)")]
PLACES = [("1", "1-oʻrin"), ("2", "2-oʻrin"), ("3", "3-oʻrin"), ("special", "Maxsus nominatsiya")]
SUBMISSION_STATUS = [
    ("new", "Yangi"),
    ("review", "Koʻrib chiqilmoqda"),
    ("shortlisted", "Saralangan"),
    ("winner", "Gʻolib"),
    ("rejected", "Rad etilgan"),
]
PROPOSAL_STATUS = [("new", "Yangi"), ("planned", "Rejaga olindi"), ("done", "Oʻtkazildi"), ("archived", "Arxiv")]
MESSAGE_STATUS = [("new", "Yangi"), ("answered", "Javob berildi"), ("archived", "Arxiv")]
MESSAGE_REASONS = [
    ("general", "Umumiy savol"),
    ("partnership", "Hamkorlik"),
    ("publish", "Maqola/tahlilnoma yuborish"),
    ("volunteer", "Mentor yoki koʻngilli boʻlish"),
]
ROLES = [("admin", "Administrator (hamma narsa)"), ("editor", "Muharrir (kontent)")]


# --------------------------------------------------------------------------- helpers


def link_table(name: str, left: str, right: str) -> Table:
    """Many-to-many link table, e.g. which authors wrote which publication."""
    return Table(
        name,
        Base.metadata,
        Column(f"{left}_id", ForeignKey(f"{left}s.id", ondelete="CASCADE"), primary_key=True),
        Column(f"{right}_id", ForeignKey(f"{right}s.id", ondelete="CASCADE"), primary_key=True),
    )


class Timestamps:
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())


class Publishable(Timestamps):
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True, default="")
    status: Mapped[str] = mapped_column(String(20), default="published", index=True)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)


@event.listens_for(Base, "before_insert", propagate=True)
@event.listens_for(Base, "before_update", propagate=True)
def _fill_slug(_mapper, _connection, target) -> None:
    """Empty slug -> generated from the title (or name)."""
    if hasattr(target, "slug") and not getattr(target, "slug", None):
        source = getattr(target, "title", None) or getattr(target, "name", None) or ""
        target.slug = slugify(source)


# --------------------------------------------------------------------------- shared


class Topic(Base):
    __tablename__ = "topics"
    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, default="")
    title: Mapped[str] = mapped_column(String(200))
    title_en: Mapped[str | None] = mapped_column(String(200))
    description: Mapped[str | None] = mapped_column(Text)
    description_en: Mapped[str | None] = mapped_column(Text)
    color: Mapped[str] = mapped_column(String(20), default="lapis")
    icon: Mapped[str] = mapped_column(String(20), default="book-open")
    order: Mapped[int] = mapped_column(Integer, default=10)

    def __str__(self) -> str:
        return self.title


class Author(Base, Timestamps):
    __tablename__ = "authors"
    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, default="")
    name: Mapped[str] = mapped_column(String(200))
    kind: Mapped[str] = mapped_column(String(20), default="researcher")
    position: Mapped[str | None] = mapped_column(String(200))
    position_en: Mapped[str | None] = mapped_column(String(200))
    bio: Mapped[str | None] = mapped_column(Text)
    bio_en: Mapped[str | None] = mapped_column(Text)
    photo = mapped_column(image_column(), nullable=True)
    region: Mapped[str | None] = mapped_column(String(120))
    telegram: Mapped[str | None] = mapped_column(String(200))
    email: Mapped[str | None] = mapped_column(String(200))
    website: Mapped[str | None] = mapped_column(String(300))
    order: Mapped[int] = mapped_column(Integer, default=100)

    def __str__(self) -> str:
        return self.name


# --------------------------------------------------------------------------- 1. Courses

course_instructors = link_table("course_instructors", "course", "author")
course_topics = link_table("course_topics", "course", "topic")
course_books = link_table("course_books", "course", "book")
course_classics = link_table("course_classics", "course", "classical_text")
course_publications = link_table("course_publications", "course", "publication")


class Course(Base, Publishable):
    __tablename__ = "courses"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(300))
    title_en: Mapped[str | None] = mapped_column(String(300))
    code: Mapped[str | None] = mapped_column(String(40))
    tagline: Mapped[str | None] = mapped_column(String(300))
    tagline_en: Mapped[str | None] = mapped_column(String(300))
    summary: Mapped[str | None] = mapped_column(Text)
    summary_en: Mapped[str | None] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text)  # HTML
    description_en: Mapped[str | None] = mapped_column(Text)
    outcomes: Mapped[str | None] = mapped_column(Text)  # one per line
    outcomes_en: Mapped[str | None] = mapped_column(Text)
    cover = mapped_column(image_column(), nullable=True)
    level: Mapped[str] = mapped_column(String(20), default="beginner")
    duration: Mapped[str | None] = mapped_column(String(60))
    order: Mapped[int] = mapped_column(Integer, default=10)

    instructors: Mapped[list["Author"]] = relationship(secondary=course_instructors, order_by="Author.order")
    topics: Mapped[list["Topic"]] = relationship(secondary=course_topics, order_by="Topic.order")
    reading_books: Mapped[list["Book"]] = relationship(secondary=course_books)
    reading_classics: Mapped[list["ClassicalText"]] = relationship(secondary=course_classics)
    reading_publications: Mapped[list["Publication"]] = relationship(secondary=course_publications)
    lessons: Mapped[list["Lesson"]] = relationship(back_populates="course", order_by="Lesson.order", cascade="all, delete-orphan")
    quiz: Mapped[list["QuizQuestion"]] = relationship(back_populates="course", order_by="QuizQuestion.order", cascade="all, delete-orphan")

    def __str__(self) -> str:
        return f"{self.code} · {self.title}" if self.code else self.title


class Lesson(Base):
    __tablename__ = "lessons"
    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id", ondelete="CASCADE"))
    course: Mapped[Course] = relationship(back_populates="lessons")
    order: Mapped[int] = mapped_column(Integer, default=1)
    title: Mapped[str] = mapped_column(String(300))
    title_en: Mapped[str | None] = mapped_column(String(300))
    duration: Mapped[str | None] = mapped_column(String(40))
    summary: Mapped[str | None] = mapped_column(Text)
    summary_en: Mapped[str | None] = mapped_column(Text)
    video_url: Mapped[str | None] = mapped_column(String(300))
    content: Mapped[str | None] = mapped_column(Text)  # HTML
    content_en: Mapped[str | None] = mapped_column(Text)

    def __str__(self) -> str:
        return f"{self.order}. {self.title}"


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"
    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id", ondelete="CASCADE"))
    course: Mapped[Course] = relationship(back_populates="quiz")
    order: Mapped[int] = mapped_column(Integer, default=1)
    question: Mapped[str] = mapped_column(String(500))
    question_en: Mapped[str | None] = mapped_column(String(500))
    options: Mapped[str] = mapped_column(Text, default="")  # one option per line
    options_en: Mapped[str | None] = mapped_column(Text)
    correct: Mapped[int] = mapped_column(Integer, default=1)  # 1-based number of the right option
    explanation: Mapped[str | None] = mapped_column(Text)
    explanation_en: Mapped[str | None] = mapped_column(Text)

    def __str__(self) -> str:
        return self.question


# --------------------------------------------------------------------------- 2/3. Publications

publication_authors = link_table("publication_authors", "publication", "author")
publication_topics = link_table("publication_topics", "publication", "topic")


class Publication(Base, Publishable):
    """Research papers, articles, journal picks and policy briefs — `kind` decides the site section."""

    __tablename__ = "publications"
    id: Mapped[int] = mapped_column(primary_key=True)
    kind: Mapped[str] = mapped_column(String(20), default="article", index=True)
    series: Mapped[str | None] = mapped_column(String(40), index=True)
    title: Mapped[str] = mapped_column(String(400))
    title_en: Mapped[str | None] = mapped_column(String(400))
    subtitle: Mapped[str | None] = mapped_column(String(400))
    subtitle_en: Mapped[str | None] = mapped_column(String(400))
    excerpt: Mapped[str | None] = mapped_column(Text)
    excerpt_en: Mapped[str | None] = mapped_column(Text)
    content: Mapped[str | None] = mapped_column(Text)  # HTML
    content_en: Mapped[str | None] = mapped_column(Text)
    summary: Mapped[str | None] = mapped_column(Text)
    summary_en: Mapped[str | None] = mapped_column(Text)
    key_points: Mapped[str | None] = mapped_column(Text)  # one per line
    key_points_en: Mapped[str | None] = mapped_column(Text)
    references: Mapped[str | None] = mapped_column(Text)  # one per line
    cover = mapped_column(image_column(), nullable=True)
    pdf = mapped_column(file_column(), nullable=True)
    journal: Mapped[str | None] = mapped_column(String(300))
    external_authors: Mapped[str | None] = mapped_column(String(300))
    external_url: Mapped[str | None] = mapped_column(String(500))
    doi: Mapped[str | None] = mapped_column(String(120))
    published_date: Mapped[date] = mapped_column(Date, default=date.today)
    read_time: Mapped[int | None] = mapped_column(Integer)
    language: Mapped[str] = mapped_column(String(5), default="uz")

    authors: Mapped[list["Author"]] = relationship(secondary=publication_authors, order_by="Author.order")
    topics: Mapped[list["Topic"]] = relationship(secondary=publication_topics, order_by="Topic.order")

    def __str__(self) -> str:
        return self.title


# --------------------------------------------------------------------------- 3. Library

book_topics = link_table("book_topics", "book", "topic")
classic_topics = link_table("classic_topics", "classical_text", "topic")


class Book(Base, Publishable):
    __tablename__ = "books"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(400))  # original title, not translated
    title_translated: Mapped[str | None] = mapped_column(String(400))
    title_translated_en: Mapped[str | None] = mapped_column(String(400))
    authors_text: Mapped[str] = mapped_column(String(300))
    year: Mapped[int] = mapped_column(Integer)
    pages: Mapped[int | None] = mapped_column(Integer)
    publisher: Mapped[str | None] = mapped_column(String(200))
    summary: Mapped[str | None] = mapped_column(Text)
    summary_en: Mapped[str | None] = mapped_column(Text)
    why_read: Mapped[str | None] = mapped_column(Text)
    why_read_en: Mapped[str | None] = mapped_column(Text)
    cover = mapped_column(image_column(), nullable=True)
    file = mapped_column(file_column(), nullable=True)
    external_url: Mapped[str | None] = mapped_column(String(500))
    category: Mapped[str] = mapped_column(String(30), index=True)
    badge: Mapped[str | None] = mapped_column(String(20))
    language: Mapped[str] = mapped_column(String(5), default="en")

    topics: Mapped[list["Topic"]] = relationship(secondary=book_topics, order_by="Topic.order")

    def __str__(self) -> str:
        return f"{self.title} ({self.authors_text})"


class ClassicalText(Base, Publishable):
    __tablename__ = "classical_texts"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(300))
    title_en: Mapped[str | None] = mapped_column(String(300))
    original_title: Mapped[str | None] = mapped_column(String(300))
    thinker: Mapped[str] = mapped_column(String(200))
    thinker_en: Mapped[str | None] = mapped_column(String(200))
    era: Mapped[str | None] = mapped_column(String(100))
    era_en: Mapped[str | None] = mapped_column(String(100))
    original_language: Mapped[str | None] = mapped_column(String(100))
    original_language_en: Mapped[str | None] = mapped_column(String(100))
    intro: Mapped[str | None] = mapped_column(Text)
    intro_en: Mapped[str | None] = mapped_column(Text)
    context: Mapped[str | None] = mapped_column(Text)  # HTML
    context_en: Mapped[str | None] = mapped_column(Text)
    key_ideas: Mapped[str | None] = mapped_column(Text)  # lines "Idea | explanation"
    key_ideas_en: Mapped[str | None] = mapped_column(Text)
    commentary: Mapped[str | None] = mapped_column(Text)  # HTML
    commentary_en: Mapped[str | None] = mapped_column(Text)
    questions: Mapped[str | None] = mapped_column(Text)  # one per line
    questions_en: Mapped[str | None] = mapped_column(Text)
    excerpt: Mapped[str | None] = mapped_column(Text)  # HTML
    excerpt_en: Mapped[str | None] = mapped_column(Text)
    file = mapped_column(file_column(), nullable=True)
    full_text_url: Mapped[str | None] = mapped_column(String(500))
    cover = mapped_column(image_column(), nullable=True)
    order: Mapped[int] = mapped_column(Integer, default=10)

    topics: Mapped[list["Topic"]] = relationship(secondary=classic_topics, order_by="Topic.order")

    def __str__(self) -> str:
        return f"{self.thinker}: {self.title}"


# --------------------------------------------------------------------------- 4. Virtual Hub

session_speakers = link_table("session_speakers", "session", "author")
session_topics = link_table("session_topics", "session", "topic")


class Session(Base, Publishable):
    """A roundtable / discussion. (Not a database session — just the name of the content type.)"""

    __tablename__ = "sessions"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(300))
    title_en: Mapped[str | None] = mapped_column(String(300))
    question: Mapped[str | None] = mapped_column(String(500))
    question_en: Mapped[str | None] = mapped_column(String(500))
    summary: Mapped[str | None] = mapped_column(Text)
    summary_en: Mapped[str | None] = mapped_column(Text)
    takeaways: Mapped[str | None] = mapped_column(Text)  # one per line
    takeaways_en: Mapped[str | None] = mapped_column(Text)
    notes: Mapped[str | None] = mapped_column(Text)  # HTML
    notes_en: Mapped[str | None] = mapped_column(Text)
    cover = mapped_column(image_column(), nullable=True)
    recording_url: Mapped[str | None] = mapped_column(String(300))
    join_url: Mapped[str | None] = mapped_column(String(300))
    audio = mapped_column(file_column(), nullable=True)
    guests: Mapped[str | None] = mapped_column(String(300))
    date: Mapped[datetime] = mapped_column(DateTime, index=True)  # Tashkent local time
    format: Mapped[str] = mapped_column(String(20), default="online")
    location: Mapped[str | None] = mapped_column(String(200))
    participants: Mapped[int | None] = mapped_column(Integer)

    speakers: Mapped[list["Author"]] = relationship(secondary=session_speakers, order_by="Author.order")
    topics: Mapped[list["Topic"]] = relationship(secondary=session_topics, order_by="Topic.order")

    def __str__(self) -> str:
        return self.title


# --------------------------------------------------------------------------- 5. Competitions

competition_judges = link_table("competition_judges", "competition", "author")
competition_topics = link_table("competition_topics", "competition", "topic")


class Competition(Base, Publishable):
    __tablename__ = "competitions"
    id: Mapped[int] = mapped_column(primary_key=True)
    number: Mapped[int | None] = mapped_column(Integer)
    title: Mapped[str] = mapped_column(String(300))
    title_en: Mapped[str | None] = mapped_column(String(300))
    prompt: Mapped[str] = mapped_column(Text, default="")
    prompt_en: Mapped[str | None] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text)  # HTML
    description_en: Mapped[str | None] = mapped_column(Text)
    rules: Mapped[str | None] = mapped_column(Text)  # one per line
    rules_en: Mapped[str | None] = mapped_column(Text)
    criteria: Mapped[str | None] = mapped_column(Text)  # lines "Criterion | 25"
    criteria_en: Mapped[str | None] = mapped_column(Text)
    prizes: Mapped[str | None] = mapped_column(Text)  # one per line
    prizes_en: Mapped[str | None] = mapped_column(Text)
    cover = mapped_column(image_column(), nullable=True)
    start_date: Mapped[date] = mapped_column(Date)
    deadline: Mapped[datetime] = mapped_column(DateTime, index=True)  # Tashkent local time
    min_words: Mapped[int] = mapped_column(Integer, default=600)
    max_words: Mapped[int] = mapped_column(Integer, default=1200)
    audience: Mapped[str | None] = mapped_column(String(200))
    audience_en: Mapped[str | None] = mapped_column(String(200))
    accept_submissions: Mapped[bool] = mapped_column(Boolean, default=True)

    judges: Mapped[list["Author"]] = relationship(secondary=competition_judges, order_by="Author.order")
    topics: Mapped[list["Topic"]] = relationship(secondary=competition_topics, order_by="Topic.order")
    winners: Mapped[list["Winner"]] = relationship(back_populates="competition", order_by="Winner.order", cascade="all, delete-orphan")

    def __str__(self) -> str:
        return f"#{self.number} {self.title}" if self.number else self.title


class Winner(Base):
    __tablename__ = "winners"
    id: Mapped[int] = mapped_column(primary_key=True)
    competition_id: Mapped[int] = mapped_column(ForeignKey("competitions.id", ondelete="CASCADE"))
    competition: Mapped[Competition] = relationship(back_populates="winners")
    order: Mapped[int] = mapped_column(Integer, default=1)
    place: Mapped[str] = mapped_column(String(10), default="1")
    name: Mapped[str] = mapped_column(String(200))
    age: Mapped[int | None] = mapped_column(Integer)
    school: Mapped[str | None] = mapped_column(String(200))
    region: Mapped[str | None] = mapped_column(String(120))
    essay_title: Mapped[str] = mapped_column(String(300))
    essay_excerpt: Mapped[str | None] = mapped_column(Text)
    essay: Mapped[str | None] = mapped_column(Text)  # HTML
    photo = mapped_column(image_column(), nullable=True)

    def __str__(self) -> str:
        return f"{self.name} — {self.essay_title}"


# --------------------------------------------------------------------------- inbox (from site forms)


class Submission(Base, Timestamps):
    __tablename__ = "submissions"
    id: Mapped[int] = mapped_column(primary_key=True)
    competition_id: Mapped[int] = mapped_column(ForeignKey("competitions.id", ondelete="CASCADE"), index=True)
    competition: Mapped[Competition] = relationship()
    full_name: Mapped[str] = mapped_column(String(200))
    age: Mapped[int | None] = mapped_column(Integer)
    email: Mapped[str] = mapped_column(String(200), index=True)
    phone: Mapped[str | None] = mapped_column(String(100))
    region: Mapped[str | None] = mapped_column(String(120))
    school: Mapped[str | None] = mapped_column(String(200))
    essay_title: Mapped[str] = mapped_column(String(300))
    essay: Mapped[str] = mapped_column(Text)
    word_count: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(20), default="new")
    score: Mapped[int | None] = mapped_column(Integer)
    judge_notes: Mapped[str | None] = mapped_column(Text)

    def __str__(self) -> str:
        return f"{self.essay_title} — {self.full_name}"


class Proposal(Base, Timestamps):
    __tablename__ = "proposals"
    id: Mapped[int] = mapped_column(primary_key=True)
    topic: Mapped[str] = mapped_column(String(300))
    description: Mapped[str | None] = mapped_column(Text)
    name: Mapped[str] = mapped_column(String(200))
    contact: Mapped[str] = mapped_column(String(200))
    region: Mapped[str | None] = mapped_column(String(120))
    status: Mapped[str] = mapped_column(String(20), default="new")

    def __str__(self) -> str:
        return self.topic


class Message(Base, Timestamps):
    __tablename__ = "messages"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    email: Mapped[str] = mapped_column(String(200))
    reason: Mapped[str] = mapped_column(String(20), default="general")
    subject: Mapped[str] = mapped_column(String(300))
    message: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(20), default="new")

    def __str__(self) -> str:
        return self.subject


# --------------------------------------------------------------------------- single-row settings pages

about_team = Table(
    "about_team",
    Base.metadata,
    Column("about_page_id", ForeignKey("about_page.id", ondelete="CASCADE"), primary_key=True),
    Column("author_id", ForeignKey("authors.id", ondelete="CASCADE"), primary_key=True),
)


class SiteSettings(Base):
    __tablename__ = "site_settings"
    id: Mapped[int] = mapped_column(primary_key=True)
    site_name: Mapped[str] = mapped_column(String(200), default="AL-FOROB AVLODIDAN")
    tagline: Mapped[str | None] = mapped_column(String(300))
    tagline_en: Mapped[str | None] = mapped_column(String(300))
    description: Mapped[str | None] = mapped_column(Text)
    description_en: Mapped[str | None] = mapped_column(Text)
    announcement_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    announcement_text: Mapped[str | None] = mapped_column(String(300))
    announcement_text_en: Mapped[str | None] = mapped_column(String(300))
    announcement_link: Mapped[str | None] = mapped_column(String(300))
    email: Mapped[str | None] = mapped_column(String(200))
    phone: Mapped[str | None] = mapped_column(String(60))
    address: Mapped[str | None] = mapped_column(String(300))
    address_en: Mapped[str | None] = mapped_column(String(300))
    telegram_channel: Mapped[str | None] = mapped_column(String(300))
    telegram_group: Mapped[str | None] = mapped_column(String(300))
    instagram: Mapped[str | None] = mapped_column(String(300))
    youtube: Mapped[str | None] = mapped_column(String(300))
    facebook: Mapped[str | None] = mapped_column(String(300))
    hub_question: Mapped[str | None] = mapped_column(String(400))
    hub_question_en: Mapped[str | None] = mapped_column(String(400))
    hub_question_context: Mapped[str | None] = mapped_column(Text)
    hub_question_context_en: Mapped[str | None] = mapped_column(Text)
    hub_rules: Mapped[str | None] = mapped_column(Text)  # one per line
    hub_rules_en: Mapped[str | None] = mapped_column(Text)
    partners: Mapped[str | None] = mapped_column(Text)  # lines "Name | https://link"

    def __str__(self) -> str:
        return "Sayt sozlamalari"


class HomePage(Base):
    __tablename__ = "home_page"
    id: Mapped[int] = mapped_column(primary_key=True)
    hero_eyebrow: Mapped[str | None] = mapped_column(String(200))
    hero_eyebrow_en: Mapped[str | None] = mapped_column(String(200))
    hero_title: Mapped[str | None] = mapped_column(String(300))
    hero_title_en: Mapped[str | None] = mapped_column(String(300))
    hero_highlight: Mapped[str | None] = mapped_column(String(100))
    hero_highlight_en: Mapped[str | None] = mapped_column(String(100))
    hero_subtitle: Mapped[str | None] = mapped_column(Text)
    hero_subtitle_en: Mapped[str | None] = mapped_column(Text)
    spotlight_id: Mapped[int | None] = mapped_column(ForeignKey("publications.id", ondelete="SET NULL"))
    spotlight: Mapped[Publication | None] = relationship()
    stats: Mapped[str | None] = mapped_column(Text)  # lines "120+ | ishtirokchi"; empty = counted automatically

    def __str__(self) -> str:
        return "Bosh sahifa"


class AboutPage(Base):
    __tablename__ = "about_page"
    id: Mapped[int] = mapped_column(primary_key=True)
    intro: Mapped[str | None] = mapped_column(Text)
    intro_en: Mapped[str | None] = mapped_column(Text)
    manifesto: Mapped[str | None] = mapped_column(Text)  # HTML
    manifesto_en: Mapped[str | None] = mapped_column(Text)
    mission: Mapped[str | None] = mapped_column(Text)
    mission_en: Mapped[str | None] = mapped_column(Text)
    vision: Mapped[str | None] = mapped_column(Text)
    vision_en: Mapped[str | None] = mapped_column(Text)
    values: Mapped[str | None] = mapped_column(Text)  # lines "Value | explanation"
    values_en: Mapped[str | None] = mapped_column(Text)
    faq: Mapped[str | None] = mapped_column(Text)  # lines "Question | answer"
    faq_en: Mapped[str | None] = mapped_column(Text)
    team: Mapped[list[Author]] = relationship(secondary=about_team, order_by="Author.order")

    def __str__(self) -> str:
        return "Loyiha haqida"


# --------------------------------------------------------------------------- admin users


class User(Base, Timestamps):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(200), unique=True)
    name: Mapped[str | None] = mapped_column(String(200))
    password: Mapped[str] = mapped_column(String(300))  # stored as a salted hash, never as plain text
    role: Mapped[str] = mapped_column(String(20), default="editor")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    def __str__(self) -> str:
        return self.email
