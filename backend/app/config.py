"""Settings read from environment variables (or a .env file next to requirements.txt)."""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent  # the backend/ folder


def _load_dotenv() -> None:
    """Tiny .env reader so the project needs no extra package for it."""
    env_file = BASE_DIR / ".env"
    if not env_file.exists():
        return
    for line in env_file.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip())


_load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'al-forob.db'}")
SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-secret-change-me")
PUBLIC_URL = os.getenv("PUBLIC_URL", "http://localhost:8000").rstrip("/")
MEDIA_DIR = Path(os.getenv("MEDIA_DIR", BASE_DIR / "media"))
# Address of the Next.js website (used for the "open site" link in the admin)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@alforob.uz")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "alforob-demo-2026")

LANGUAGES = ("uz", "en")  # content languages; "uz" is the default and the fallback

# Dates and times are stored as Tashkent local time (UTC+5, no daylight saving)
TZ_OFFSET = "+05:00"
TZ_HOURS = 5
