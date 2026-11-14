"""
Endpoints for the three forms on the website. All rules are checked here, on the server.
Each returns {"ok": bool, "message": str, "errors": {field: message}}.
"""

import re
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session as DbSession

from .. import models as m
from ..config import TZ_HOURS
from ..database import get_db
from ..utils import word_count

router = APIRouter(prefix="/api/forms", tags=["forms"])

EMAIL = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def say(locale: str, uz: str, en: str) -> str:
    return en if locale == "en" else uz


def result(ok: bool, message: str, errors: dict | None = None) -> dict:
    return {"ok": ok, "message": message, "errors": errors or {}}


def tashkent_now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(hours=TZ_HOURS)


class FormBase(BaseModel):
    locale: str = "uz"
    website: str = ""  # hidden "honeypot" field: people leave it empty, spam bots fill it in


class EssayIn(FormBase):
    competition: int
    fullName: str = ""
    email: str = ""
    phone: str = ""
    age: int | None = None
    region: str = ""
    school: str = ""
    essayTitle: str = ""
    essay: str = ""
    consent: bool = False


@router.post("/essay")
def submit_essay(data: EssayIn, db: DbSession = Depends(get_db)):
    L = data.locale
    if data.website:
        return result(True, "ok")
    errors = {}
    if not data.fullName.strip():
        errors["fullName"] = say(L, "Ismingizni kiriting", "Enter your name")
    if not EMAIL.match(data.email.strip()):
        errors["email"] = say(L, "Email notoʻgʻri", "Invalid email")
    if not data.essayTitle.strip():
        errors["essayTitle"] = say(L, "Sarlavha kiriting", "Enter a title")
    if not data.consent:
        errors["consent"] = say(L, "Qoidalarga rozilik bildiring", "Please accept the rules")

    comp = db.get(m.Competition, data.competition)
    if not comp or comp.status != "published" or not comp.accept_submissions or comp.deadline < tashkent_now():
        return result(False, say(L, "Bu tanlovga insho qabul qilish yakunlangan.", "This competition is no longer accepting essays."))

    words = word_count(data.essay)
    if not comp.min_words <= words <= comp.max_words:
        errors["essay"] = say(
            L,
            f"Insho {comp.min_words}–{comp.max_words} soʻz boʻlishi kerak (hozir {words}).",
            f"Essay must be {comp.min_words}–{comp.max_words} words (now {words}).",
        )
    if errors:
        return result(False, say(L, "Formani tekshiring.", "Please check the form."), errors)

    email = data.email.strip().lower()
    duplicate = db.scalar(
        select(func.count()).select_from(m.Submission).where(m.Submission.competition_id == comp.id, m.Submission.email == email)
    )
    if duplicate:
        return result(False, say(L, "Bu email bilan ushbu tanlovga insho allaqachon yuborilgan.", "An essay with this email was already submitted to this competition."))

    db.add(
        m.Submission(
            competition_id=comp.id, full_name=data.fullName.strip()[:200], email=email, phone=data.phone[:100],
            age=data.age, region=data.region[:120], school=data.school[:200], essay_title=data.essayTitle.strip()[:300],
            essay=data.essay[:40000], word_count=words,
        )
    )
    db.commit()
    return result(True, say(L, "Rahmat! Inshoingiz qabul qilindi. Natijalar tanlov sahifasida eʼlon qilinadi.", "Thank you! Your essay has been received. Results will be announced on the competition page."))


class ProposalIn(FormBase):
    topic: str = ""
    description: str = ""
    name: str = ""
    contact: str = ""
    region: str = ""


@router.post("/proposal")
def submit_proposal(data: ProposalIn, db: DbSession = Depends(get_db)):
    L = data.locale
    if data.website:
        return result(True, "ok")
    errors = {}
    if not data.topic.strip():
        errors["topic"] = say(L, "Mavzuni yozing", "Enter a topic")
    if not data.name.strip():
        errors["name"] = say(L, "Ismingizni kiriting", "Enter your name")
    if not data.contact.strip():
        errors["contact"] = say(L, "Aloqa uchun maʼlumot kiriting", "Enter a contact")
    if errors:
        return result(False, say(L, "Formani tekshiring.", "Please check the form."), errors)
    db.add(m.Proposal(topic=data.topic.strip()[:300], description=data.description[:3000], name=data.name.strip()[:200], contact=data.contact.strip()[:200], region=data.region[:120]))
    db.commit()
    return result(True, say(L, "Rahmat! Taklifingiz jamoaga yuborildi.", "Thank you! Your proposal was sent to the team."))


class MessageIn(FormBase):
    name: str = ""
    email: str = ""
    reason: str = "general"
    subject: str = ""
    message: str = ""


@router.post("/message")
def submit_message(data: MessageIn, db: DbSession = Depends(get_db)):
    L = data.locale
    if data.website:
        return result(True, "ok")
    errors = {}
    if not data.name.strip():
        errors["name"] = say(L, "Ismingizni kiriting", "Enter your name")
    if not EMAIL.match(data.email.strip()):
        errors["email"] = say(L, "Email notoʻgʻri", "Invalid email")
    if not data.subject.strip():
        errors["subject"] = say(L, "Mavzuni yozing", "Enter a subject")
    if len(data.message.strip()) < 10:
        errors["message"] = say(L, "Xabar juda qisqa", "Message is too short")
    if errors:
        return result(False, say(L, "Formani tekshiring.", "Please check the form."), errors)
    reason = data.reason if data.reason in dict(m.MESSAGE_REASONS) else "general"
    db.add(m.Message(name=data.name.strip()[:200], email=data.email.strip()[:200], reason=reason, subject=data.subject.strip()[:300], message=data.message[:5000]))
    db.commit()
    return result(True, say(L, "Xabaringiz yuborildi. Tez orada javob beramiz!", "Your message was sent. We will reply soon!"))
