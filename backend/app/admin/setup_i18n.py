"""Adds an Uzbek translation of the admin interface (SQLAdmin ships without one)."""

from io import BytesIO
from pathlib import Path

from babel.messages.mofile import write_mo
from babel.messages.pofile import read_po
from babel.support import Translations
from sqladmin import i18n

PO_FILE = Path(__file__).resolve().parent.parent / "locale" / "uz" / "LC_MESSAGES" / "admin.po"


def install_uzbek() -> None:
    with PO_FILE.open("rb") as f:
        catalog = read_po(f, locale="uz", domain="admin")
    buffer = BytesIO()
    write_mo(buffer, catalog)
    buffer.seek(0)
    i18n.translations["uz"] = Translations(buffer, domain="admin")
    if "uz" not in i18n.SUPPORTED_LOCALES:
        i18n.SUPPORTED_LOCALES.append("uz")
