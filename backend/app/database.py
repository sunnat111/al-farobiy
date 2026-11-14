"""Database connection (SQLAlchemy). One engine for the whole app, one session per request."""

from collections.abc import Iterator

from sqlalchemy import create_engine, event
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from .config import DATABASE_URL

is_sqlite = DATABASE_URL.startswith("sqlite")
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if is_sqlite else {},
)

if is_sqlite:

    @event.listens_for(engine, "connect")
    def _sqlite_foreign_keys(dbapi_connection, _record):  # enforce ON DELETE rules in SQLite
        dbapi_connection.execute("PRAGMA foreign_keys=ON")


SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    """Parent class of every database table in app/models.py."""


def get_db() -> Iterator[Session]:
    """FastAPI dependency: opens a session for one request and always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
