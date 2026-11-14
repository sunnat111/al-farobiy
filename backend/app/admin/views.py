"""
Admin screens. Each class = one item in the admin menu, built from a database model.
`category` groups them in the sidebar the same way as the website menu.
"""

from markupsafe import Markup
from sqladmin import ModelView
from starlette.requests import Request
from wtforms import PasswordField, SelectField

from .. import models as m
from ..security import hash_password, is_hashed
from .auth import is_admin
from .fields import RichTextField

ACADEMIC = "Akademik dasturlar"
RESEARCH = "Tadqiqot va nazariya"
LIBRARY = "Kutubxona"
HUB = "Virtual Hub"
COMPETITIONS = "Musobaqalar"
COMMON = "Umumiy maʼlumotlar"
INBOX = "Murojaatlar (kiruvchi)"
SYSTEM = "Tizim"

# Field labels shown in the admin (same names reused across screens).
LABELS = {
    "title": "Sarlavha", "title_en": "Sarlavha (EN)", "slug": "URL (slug)", "status": "Holati",
    "featured": "Bosh sahifada koʻrsatish", "order": "Tartib raqami", "cover": "Rasm / muqova",
    "topics": "Mavzular", "created_at": "Yaratilgan", "updated_at": "Oʻzgartirilgan",
    "name": "Ism-familiya", "kind": "Turi", "position": "Lavozimi / maqomi", "position_en": "Lavozimi (EN)",
    "bio": "Qisqacha biografiya", "bio_en": "Biografiya (EN)", "photo": "Surat", "region": "Shahar / viloyat",
    "telegram": "Telegram", "email": "Email", "website": "Veb-sayt",
    "description": "Tavsif", "description_en": "Tavsif (EN)", "color": "Rangi", "icon": "Belgisi",
    "code": "Qisqa kod (masalan POL-101)", "tagline": "Bir qatorli tavsif", "tagline_en": "Bir qatorli tavsif (EN)",
    "summary": "Qisqa mazmuni", "summary_en": "Qisqa mazmuni (EN)", "outcomes": "Kurs natijalari",
    "outcomes_en": "Kurs natijalari (EN)", "level": "Darajasi", "duration": "Davomiyligi",
    "instructors": "Oʻqituvchilar", "reading_books": "Adabiyotlar: kitoblar",
    "reading_classics": "Adabiyotlar: mumtoz asarlar", "reading_publications": "Adabiyotlar: nashrlar",
    "course": "Kurs", "video_url": "YouTube havolasi", "content": "Matn", "content_en": "Matn (EN)",
    "question": "Savol", "question_en": "Savol (EN)", "options": "Javob variantlari", "options_en": "Javob variantlari (EN)",
    "correct": "Toʻgʻri javob raqami", "explanation": "Izoh", "explanation_en": "Izoh (EN)",
    "series": "Tadqiqot yoʻnalishi", "subtitle": "Kichik sarlavha", "subtitle_en": "Kichik sarlavha (EN)",
    "excerpt": "Qisqa tavsif (kartochkada)", "excerpt_en": "Qisqa tavsif (EN)", "key_points": "Asosiy fikrlar",
    "key_points_en": "Asosiy fikrlar (EN)", "references": "Manbalar", "pdf": "PDF fayl", "journal": "Jurnal nomi",
    "external_authors": "Tashqi mualliflar", "external_url": "Asl manbaga havola", "doi": "DOI",
    "published_date": "Eʼlon qilingan sana", "read_time": "Oʻqish vaqti (daqiqa)", "language": "Asl tili",
    "authors": "Mualliflar", "title_translated": "Nomi tarjimada", "title_translated_en": "Nomi tarjimada (EN)",
    "authors_text": "Muallif(lar)", "year": "Nashr yili", "pages": "Sahifalar", "publisher": "Nashriyot",
    "why_read": "Nega oʻqish kerak", "why_read_en": "Nega oʻqish kerak (EN)", "file": "PDF fayl",
    "category": "Boʻlim", "badge": "Belgi", "original_title": "Asl nomi", "thinker": "Mutafakkir",
    "thinker_en": "Mutafakkir (EN)", "era": "Davri", "era_en": "Davri (EN)", "original_language": "Asl tili",
    "original_language_en": "Asl tili (EN)", "intro": "Kirish", "intro_en": "Kirish (EN)",
    "context": "Tarixiy kontekst", "context_en": "Tarixiy kontekst (EN)", "key_ideas": "Asosiy gʻoyalar",
    "key_ideas_en": "Asosiy gʻoyalar (EN)", "commentary": "Ilmiy sharh", "commentary_en": "Ilmiy sharh (EN)",
    "questions": "Muhokama savollari", "questions_en": "Muhokama savollari (EN)",
    "full_text_url": "Toʻliq matnga havola", "takeaways": "Xulosalar", "takeaways_en": "Xulosalar (EN)",
    "notes": "Batafsil qayd", "notes_en": "Batafsil qayd (EN)", "recording_url": "YouTube yozuvi",
    "join_url": "Qoʻshilish havolasi", "audio": "Audio yozuv", "guests": "Qoʻshimcha ishtirokchilar",
    "date": "Sana va vaqt (Toshkent)", "format": "Format", "location": "Joy", "participants": "Ishtirokchilar soni",
    "speakers": "Spikerlar", "number": "Tanlov raqami", "prompt": "Insho savoli", "prompt_en": "Insho savoli (EN)",
    "rules": "Qoidalar", "rules_en": "Qoidalar (EN)", "criteria": "Baholash mezonlari",
    "criteria_en": "Baholash mezonlari (EN)", "prizes": "Mukofotlar", "prizes_en": "Mukofotlar (EN)",
    "start_date": "Boshlanish sanasi", "deadline": "Topshirish muddati (Toshkent vaqti)", "min_words": "Min soʻz",
    "max_words": "Maks soʻz", "audience": "Kimlar uchun", "audience_en": "Kimlar uchun (EN)",
    "accept_submissions": "Saytda insho qabul qilish", "judges": "Hakamlar", "winners": "Gʻoliblar",
    "competition": "Tanlov", "place": "Oʻrin", "age": "Yoshi", "school": "Maktab / OTM",
    "essay_title": "Insho sarlavhasi", "essay_excerpt": "Inshodan parcha", "essay": "Insho matni",
    "full_name": "Ism-familiya", "phone": "Telefon / Telegram", "word_count": "Soʻzlar soni", "score": "Ball (0–100)",
    "judge_notes": "Hakam izohi (ichki)", "topic": "Mavzu", "contact": "Email yoki Telegram", "reason": "Murojaat turi",
    "subject": "Mavzu", "message": "Xabar", "site_name": "Loyiha nomi", "announcement_enabled": "Eʼlon qatorini koʻrsatish",
    "announcement_text": "Eʼlon matni", "announcement_text_en": "Eʼlon matni (EN)", "announcement_link": "Eʼlon havolasi",
    "address": "Manzil", "address_en": "Manzil (EN)", "telegram_channel": "Telegram kanal",
    "telegram_group": "Telegram muhokama guruhi", "instagram": "Instagram", "youtube": "YouTube", "facebook": "Facebook",
    "hub_question": "Haftaning munozarali savoli", "hub_question_en": "Haftaning savoli (EN)",
    "hub_question_context": "Savol konteksti", "hub_question_context_en": "Savol konteksti (EN)",
    "hub_rules": "Muhokama qoidalari", "hub_rules_en": "Muhokama qoidalari (EN)", "partners": "Hamkorlar",
    "hero_eyebrow": "Banner: ustki yozuv", "hero_eyebrow_en": "Banner: ustki yozuv (EN)",
    "hero_title": "Banner: sarlavha", "hero_title_en": "Banner: sarlavha (EN)",
    "hero_highlight": "Banner: ajratilgan soʻz", "hero_highlight_en": "Banner: ajratilgan soʻz (EN)",
    "hero_subtitle": "Banner: matn", "hero_subtitle_en": "Banner: matn (EN)", "spotlight": "Diqqat markazidagi nashr",
    "stats": "Raqamlar", "manifesto": "Manifest", "manifesto_en": "Manifest (EN)", "mission": "Missiya",
    "mission_en": "Missiya (EN)", "vision": "Maqsad", "vision_en": "Maqsad (EN)", "values": "Qadriyatlar",
    "values_en": "Qadriyatlar (EN)", "faq": "Koʻp soʻraladigan savollar", "faq_en": "Savollar (EN)", "team": "Jamoa",
    "password": "Parol", "role": "Rol", "is_active": "Faol",
}

ONE_PER_LINE = "Har qatorga bittadan yozing."
PIPE_PAIR = "Har qatorga bittadan, “chap qism | oʻng qism” koʻrinishida."


def build_form(choices=None, rich=(), lines=(), pairs=(), help=None):
    """Turns short declarations into SQLAdmin's form_overrides / form_args / form_widget_args."""
    overrides, args, widgets = {}, {}, {}
    for field, options in (choices or {}).items():
        overrides[field] = SelectField
        args[field] = {"choices": options}
    for field in rich:
        overrides[field] = RichTextField
    for field in lines:
        args.setdefault(field, {})["description"] = ONE_PER_LINE
        widgets[field] = {"rows": 5}
    for field in pairs:
        args.setdefault(field, {})["description"] = PIPE_PAIR
        widgets[field] = {"rows": 5}
    for field, text in (help or {}).items():
        args.setdefault(field, {})["description"] = text
    return overrides, args, widgets


def choice_label(options):
    lookup = dict(options)
    return lambda model, attr: lookup.get(getattr(model, attr), getattr(model, attr))


def status_badge(model, _attr):
    if model.status == "published":
        return Markup('<span class="badge bg-green-lt">Eʼlon qilingan</span>')
    return Markup('<span class="badge bg-yellow-lt">Qoralama</span>')


SLUG_HELP = {"slug": "Boʻsh qoldirsangiz, sarlavhadan avtomatik yaratiladi."}

# Searchable "type to find" pickers for links to other records (instead of long select boxes).
AUTHORS = {"fields": ("name",), "order_by": "name"}
TOPICS = {"fields": ("title",), "order_by": "order"}
BOOKS = {"fields": ("title", "authors_text"), "order_by": "title"}
TITLES = {"fields": ("title",), "order_by": "title"}


class BaseView(ModelView):
    column_labels = LABELS
    page_size = 25
    form_include_pk = False
    save_as = False


# --------------------------------------------------------------------------- 1. Courses


class CourseAdmin(BaseView, model=m.Course):
    name, name_plural, icon, category = "Kurs", "Kurslar", "fa-solid fa-graduation-cap", ACADEMIC
    form_ajax_refs = {"instructors": AUTHORS, "topics": TOPICS, "reading_books": BOOKS, "reading_classics": TITLES, "reading_publications": TITLES}
    column_list = ["title", "code", "level", "status", "order"]
    column_searchable_list = ["title", "code"]
    column_default_sort = "order"
    column_formatters = {"status": status_badge, "level": choice_label(m.LEVELS)}
    form_columns = [
        "title", "title_en", "code", "tagline", "tagline_en", "summary", "summary_en", "description", "description_en",
        "outcomes", "outcomes_en", "cover", "level", "duration", "instructors", "topics",
        "reading_books", "reading_classics", "reading_publications", "slug", "status", "featured", "order",
    ]
    form_overrides, form_args, form_widget_args = build_form(
        choices={"level": m.LEVELS, "status": m.STATUS},
        rich=["description", "description_en"],
        lines=["outcomes", "outcomes_en"],
        help=SLUG_HELP,
    )


class LessonAdmin(BaseView, model=m.Lesson):
    name, name_plural, icon, category = "Dars", "Darslar", "fa-solid fa-chalkboard", ACADEMIC
    column_list = ["course", "order", "title", "duration"]
    column_searchable_list = ["title"]
    column_default_sort = [("course_id", False), ("order", False)]
    form_columns = ["course", "order", "title", "title_en", "duration", "summary", "summary_en", "video_url", "content", "content_en"]
    form_overrides, form_args, form_widget_args = build_form(rich=["content", "content_en"])


class QuizQuestionAdmin(BaseView, model=m.QuizQuestion):
    name, name_plural, icon, category = "Test savoli", "Test savollari", "fa-solid fa-list-check", ACADEMIC
    column_list = ["course", "order", "question", "correct"]
    column_default_sort = [("course_id", False), ("order", False)]
    form_columns = ["course", "order", "question", "question_en", "options", "options_en", "correct", "explanation", "explanation_en"]
    form_overrides, form_args, form_widget_args = build_form(
        lines=["options", "options_en"],
        help={"correct": "Toʻgʻri variantning tartib raqami (1 dan boshlab)."},
    )


# --------------------------------------------------------------------------- 2/3. Publications


class PublicationAdmin(BaseView, model=m.Publication):
    name, name_plural, icon, category = "Nashr", "Nashrlar (tadqiqot, maqola, tahlilnoma)", "fa-solid fa-file-lines", RESEARCH
    form_ajax_refs = {"authors": AUTHORS, "topics": TOPICS}
    column_list = ["title", "kind", "published_date", "status"]
    column_searchable_list = ["title", "excerpt", "external_authors"]
    column_default_sort = ("published_date", True)
    column_formatters = {"status": status_badge, "kind": choice_label(m.PUBLICATION_KINDS)}
    form_columns = [
        "kind", "series", "title", "title_en", "subtitle", "subtitle_en", "excerpt", "excerpt_en",
        "content", "content_en", "summary", "summary_en", "key_points", "key_points_en", "references",
        "authors", "external_authors", "journal", "external_url", "doi", "cover", "pdf",
        "published_date", "read_time", "language", "topics", "slug", "status", "featured",
    ]
    form_overrides, form_args, form_widget_args = build_form(
        choices={"kind": m.PUBLICATION_KINDS, "series": m.RESEARCH_SERIES, "language": m.LANGUAGES, "status": m.STATUS},
        rich=["content", "content_en"],
        lines=["key_points", "key_points_en", "references"],
        help={
            **SLUG_HELP,
            "kind": "Saytning qaysi boʻlimida chiqishini belgilaydi.",
            "series": "Faqat “Tadqiqot ishi” uchun.",
            "journal": "Faqat xalqaro jurnaldan tanlangan maqolalar uchun.",
        },
    )


# --------------------------------------------------------------------------- 3. Library


class BookAdmin(BaseView, model=m.Book):
    name, name_plural, icon, category = "Kitob", "Zamonaviy kitoblar", "fa-solid fa-book", LIBRARY
    form_ajax_refs = {"topics": TOPICS}
    column_list = ["title", "authors_text", "year", "category", "status"]
    column_searchable_list = ["title", "authors_text"]
    column_default_sort = "title"
    column_formatters = {"status": status_badge, "category": choice_label(m.BOOK_CATEGORIES)}
    form_columns = [
        "title", "title_translated", "title_translated_en", "authors_text", "year", "pages", "publisher",
        "summary", "summary_en", "why_read", "why_read_en", "cover", "file", "external_url",
        "category", "badge", "language", "topics", "slug", "status", "featured",
    ]
    form_overrides, form_args, form_widget_args = build_form(
        choices={"category": m.BOOK_CATEGORIES, "badge": m.BOOK_BADGES, "language": m.LANGUAGES, "status": m.STATUS},
        help={**SLUG_HELP, "file": "Toʻliq PDF faqat mualliflik huquqi boʻlsa yuklansin.", "title": "Asl tildagi nomi"},
    )


class ClassicalTextAdmin(BaseView, model=m.ClassicalText):
    name, name_plural, icon, category = "Mumtoz asar", "Mumtoz asarlar", "fa-solid fa-scroll", LIBRARY
    form_ajax_refs = {"topics": TOPICS}
    column_list = ["title", "thinker", "era", "status", "order"]
    column_default_sort = "order"
    column_formatters = {"status": status_badge}
    form_columns = [
        "title", "title_en", "original_title", "thinker", "thinker_en", "era", "era_en", "original_language",
        "original_language_en", "intro", "intro_en", "context", "context_en", "key_ideas", "key_ideas_en",
        "commentary", "commentary_en", "questions", "questions_en", "excerpt", "excerpt_en", "cover", "file",
        "full_text_url", "topics", "slug", "status", "featured", "order",
    ]
    form_overrides, form_args, form_widget_args = build_form(
        choices={"status": m.STATUS},
        rich=["context", "context_en", "commentary", "commentary_en", "excerpt", "excerpt_en"],
        lines=["questions", "questions_en"],
        pairs=["key_ideas", "key_ideas_en"],
        help=SLUG_HELP,
    )


# --------------------------------------------------------------------------- 4. Hub


class SessionAdmin(BaseView, model=m.Session):
    name, name_plural, icon, category = "Davra suhbati", "Davra suhbatlari", "fa-solid fa-people-group", HUB
    form_ajax_refs = {"speakers": AUTHORS, "topics": TOPICS}
    column_list = ["title", "date", "format", "status"]
    column_default_sort = ("date", True)
    column_formatters = {"status": status_badge, "format": choice_label(m.SESSION_FORMATS)}
    form_columns = [
        "title", "title_en", "question", "question_en", "summary", "summary_en", "takeaways", "takeaways_en",
        "notes", "notes_en", "cover", "recording_url", "join_url", "audio", "date", "format", "location",
        "speakers", "guests", "participants", "topics", "slug", "status", "featured",
    ]
    form_overrides, form_args, form_widget_args = build_form(
        choices={"format": m.SESSION_FORMATS, "status": m.STATUS},
        rich=["notes", "notes_en"],
        lines=["takeaways", "takeaways_en"],
        help=SLUG_HELP,
    )


class ProposalAdmin(BaseView, model=m.Proposal):
    name, name_plural, icon, category = "Taklif", "Muhokama uchun takliflar", "fa-solid fa-lightbulb", HUB
    can_create = False
    column_list = ["topic", "name", "status", "created_at"]
    column_default_sort = ("created_at", True)
    column_formatters = {"status": choice_label(m.PROPOSAL_STATUS)}
    form_columns = ["topic", "description", "name", "contact", "region", "status"]
    form_overrides, form_args, form_widget_args = build_form(choices={"status": m.PROPOSAL_STATUS})


# --------------------------------------------------------------------------- 5. Competitions


class CompetitionAdmin(BaseView, model=m.Competition):
    name, name_plural, icon, category = "Tanlov", "Haftalik tanlovlar", "fa-solid fa-pen-nib", COMPETITIONS
    form_ajax_refs = {"judges": AUTHORS, "topics": TOPICS}
    column_list = ["number", "title", "start_date", "deadline", "status"]
    column_default_sort = ("deadline", True)
    column_formatters = {"status": status_badge}
    form_columns = [
        "number", "title", "title_en", "prompt", "prompt_en", "description", "description_en", "rules", "rules_en",
        "criteria", "criteria_en", "prizes", "prizes_en", "cover", "start_date", "deadline", "min_words", "max_words",
        "audience", "audience_en", "judges", "accept_submissions", "topics", "slug", "status", "featured",
    ]
    form_overrides, form_args, form_widget_args = build_form(
        choices={"status": m.STATUS},
        rich=["description", "description_en"],
        lines=["rules", "rules_en", "prizes", "prizes_en"],
        pairs=["criteria", "criteria_en"],
        help={**SLUG_HELP, "criteria": "Masalan: “Dalillar va manbalar | 30”."},
    )


class WinnerAdmin(BaseView, model=m.Winner):
    name, name_plural, icon, category = "Gʻolib", "Gʻoliblar (Shon-sharaf zali)", "fa-solid fa-trophy", COMPETITIONS
    column_list = ["competition", "place", "name", "essay_title"]
    column_default_sort = [("competition_id", True), ("order", False)]
    column_formatters = {"place": choice_label(m.PLACES)}
    form_columns = ["competition", "place", "order", "name", "age", "school", "region", "essay_title", "essay_excerpt", "essay", "photo"]
    form_overrides, form_args, form_widget_args = build_form(choices={"place": m.PLACES}, rich=["essay"])


class SubmissionAdmin(BaseView, model=m.Submission):
    name, name_plural, icon, category = "Insho", "Topshirilgan insholar", "fa-solid fa-inbox", COMPETITIONS
    can_create = False
    column_list = ["essay_title", "full_name", "competition", "word_count", "status", "score", "created_at"]
    column_searchable_list = ["essay_title", "full_name", "email"]
    column_default_sort = ("created_at", True)
    column_formatters = {"status": choice_label(m.SUBMISSION_STATUS)}
    form_columns = [
        "competition", "full_name", "age", "email", "phone", "region", "school", "essay_title", "essay",
        "status", "score", "judge_notes",
    ]
    form_overrides, form_args, form_widget_args = build_form(choices={"status": m.SUBMISSION_STATUS})
    form_widget_args = {**form_widget_args, "essay": {"rows": 18}}


# --------------------------------------------------------------------------- common


class AuthorAdmin(BaseView, model=m.Author):
    name, name_plural, icon, category = "Muallif", "Mualliflar va jamoa", "fa-solid fa-user-pen", COMMON
    column_list = ["name", "kind", "position", "order"]
    column_searchable_list = ["name", "position"]
    column_default_sort = "order"
    column_formatters = {"kind": choice_label(m.AUTHOR_KINDS)}
    form_columns = ["name", "kind", "position", "position_en", "bio", "bio_en", "photo", "region", "telegram", "email", "website", "slug", "order"]
    form_overrides, form_args, form_widget_args = build_form(choices={"kind": m.AUTHOR_KINDS}, help=SLUG_HELP)


class TopicAdmin(BaseView, model=m.Topic):
    name, name_plural, icon, category = "Mavzu", "Mavzular", "fa-solid fa-tags", COMMON
    column_list = ["title", "slug", "color", "order"]
    column_default_sort = "order"
    form_columns = ["title", "title_en", "description", "description_en", "color", "icon", "order", "slug"]
    form_overrides, form_args, form_widget_args = build_form(choices={"color": m.TOPIC_COLORS, "icon": m.TOPIC_ICONS}, help=SLUG_HELP)


class SingletonView(BaseView):
    """Settings pages that have exactly one row: no create / delete buttons."""

    can_create = False
    can_delete = False
    column_list = ["id"]
    column_formatters = {"id": lambda model, _a: str(model)}
    column_labels = {**LABELS, "id": "Sahifa"}


class HomePageAdmin(SingletonView, model=m.HomePage):
    name, name_plural, icon, category = "Bosh sahifa", "Bosh sahifa", "fa-solid fa-house", COMMON
    form_ajax_refs = {"spotlight": TITLES}
    form_columns = [
        "hero_eyebrow", "hero_eyebrow_en", "hero_title", "hero_title_en", "hero_highlight", "hero_highlight_en",
        "hero_subtitle", "hero_subtitle_en", "spotlight", "stats",
    ]
    form_overrides, form_args, form_widget_args = build_form(
        pairs=["stats"],
        help={
            "stats": "Masalan: “1200+ | ishtirokchi”. Boʻsh qolsa, raqamlar avtomatik hisoblanadi.",
            "hero_highlight": "Sarlavha ichidagi oltin rang bilan ajratiladigan soʻz(lar).",
        },
    )


class AboutPageAdmin(SingletonView, model=m.AboutPage):
    name, name_plural, icon, category = "Loyiha haqida", "Loyiha haqida", "fa-solid fa-circle-info", COMMON
    form_ajax_refs = {"team": AUTHORS}
    form_columns = [
        "intro", "intro_en", "manifesto", "manifesto_en", "mission", "mission_en", "vision", "vision_en",
        "values", "values_en", "faq", "faq_en", "team",
    ]
    form_overrides, form_args, form_widget_args = build_form(
        rich=["manifesto", "manifesto_en"],
        pairs=["values", "values_en", "faq", "faq_en"],
    )


class SiteSettingsAdmin(SingletonView, model=m.SiteSettings):
    name, name_plural, icon, category = "Sayt sozlamalari", "Sayt sozlamalari", "fa-solid fa-gear", COMMON
    form_columns = [
        "site_name", "tagline", "tagline_en", "description", "description_en", "announcement_enabled",
        "announcement_text", "announcement_text_en", "announcement_link", "email", "phone", "address", "address_en",
        "telegram_channel", "telegram_group", "instagram", "youtube", "facebook", "hub_question", "hub_question_en",
        "hub_question_context", "hub_question_context_en", "hub_rules", "hub_rules_en", "partners",
    ]
    form_overrides, form_args, form_widget_args = build_form(
        lines=["hub_rules", "hub_rules_en"],
        pairs=["partners"],
        help={"announcement_link": "Masalan: /uz/musobaqalar", "partners": "Masalan: “Hamkor nomi | https://sayt.uz”."},
    )


# --------------------------------------------------------------------------- inbox + system


class MessageAdmin(BaseView, model=m.Message):
    name, name_plural, icon, category = "Xabar", "Aloqa xabarlari", "fa-solid fa-envelope", INBOX
    can_create = False
    column_list = ["subject", "name", "email", "reason", "status", "created_at"]
    column_default_sort = ("created_at", True)
    column_formatters = {"status": choice_label(m.MESSAGE_STATUS), "reason": choice_label(m.MESSAGE_REASONS)}
    form_columns = ["name", "email", "reason", "subject", "message", "status"]
    form_overrides, form_args, form_widget_args = build_form(choices={"reason": m.MESSAGE_REASONS, "status": m.MESSAGE_STATUS})


class UserAdmin(BaseView, model=m.User):
    name, name_plural, icon, category = "Foydalanuvchi", "Admin foydalanuvchilar", "fa-solid fa-user-shield", SYSTEM
    column_list = ["email", "name", "role", "is_active"]
    column_formatters = {"role": choice_label(m.ROLES)}
    column_details_exclude_list = ["password"]
    form_columns = ["email", "name", "password", "role", "is_active"]
    form_overrides, form_args, form_widget_args = build_form(
        choices={"role": m.ROLES},
        help={"password": "Yangi parol. Tahrirlashda boʻsh qoldirsangiz, eski parol saqlanadi."},
    )
    form_overrides = {**form_overrides, "password": PasswordField}

    def is_accessible(self, request: Request) -> bool:  # only administrators manage accounts
        return is_admin(request)

    def is_visible(self, request: Request) -> bool:
        return is_admin(request)

    async def on_model_change(self, data, model, is_created, request) -> None:
        password = data.get("password")
        if not password:
            data.pop("password", None)  # keep the old one
        elif not is_hashed(password):
            data["password"] = hash_password(password)
        if data.get("email"):
            data["email"] = data["email"].strip().lower()


ALL_VIEWS = [
    CourseAdmin, LessonAdmin, QuizQuestionAdmin,
    PublicationAdmin,
    BookAdmin, ClassicalTextAdmin,
    SessionAdmin, ProposalAdmin,
    CompetitionAdmin, WinnerAdmin, SubmissionAdmin,
    AuthorAdmin, TopicAdmin, HomePageAdmin, AboutPageAdmin, SiteSettingsAdmin,
    MessageAdmin,
    UserAdmin,
]
