"""Mounts the admin panel at /admin."""

from pathlib import Path

from fastapi import FastAPI
from sqladmin import Admin
from sqladmin.i18n import I18nConfig

from ..config import FRONTEND_URL, SECRET_KEY
from ..database import engine
from .auth import AdminAuth
from .fields import install_widgets
from .setup_i18n import install_uzbek
from .views import ALL_VIEWS

TEMPLATES = Path(__file__).resolve().parent.parent / "templates"


def setup_admin(app: FastAPI) -> Admin:
    install_uzbek()
    install_widgets()
    admin = Admin(
        app,
        engine,
        title="AL-FOROB admin",
        base_url="/admin",
        templates_dir=str(TEMPLATES),
        logo_url="/static/logo.svg",
        favicon_url="/static/favicon.svg",
        authentication_backend=AdminAuth(secret_key=SECRET_KEY),
        i18n_config=I18nConfig(default_locale="uz", language_header_name=None, language_cookie_name=None),
    )
    admin.templates.env.globals["site_url"] = f"{FRONTEND_URL}/uz"
    for view in ALL_VIEWS:
        admin.add_view(view)
    return admin
