"""Uploaded files (images, PDFs, audio) and automatic image resizing."""

import secrets
from pathlib import Path

from fastapi_storages import FileSystemStorage
from fastapi_storages.integrations.sqlalchemy import FileType, ImageType
from PIL import Image

from .config import MEDIA_DIR, PUBLIC_URL

storage = FileSystemStorage(path=str(MEDIA_DIR))


def _unique_name(filename: str) -> str:
    """Prefix uploads with a short random code so two files called "cover.jpg" never overwrite each other."""
    return f"{secrets.token_hex(4)}-{filename}"


def image_column() -> ImageType:
    return ImageType(storage=storage, upload_to=_unique_name)


def file_column() -> FileType:
    return FileType(storage=storage, upload_to=_unique_name)


def media_url(name: str) -> str:
    return f"{PUBLIC_URL}/media/{name}"


SIZES = {"thumb": 400, "card": 900, "hero": 1800}


def file_info(stored) -> dict | None:
    """JSON for a downloadable file (PDF, audio)."""
    if not stored:
        return None
    return {"url": media_url(stored.name), "filename": Path(stored.name).name}


def image_info(stored, alt: str = "") -> dict | None:
    """
    JSON for an image, in the shape the website expects:
    {url, alt, width, height, sizes: {thumb, card, hero}}.
    Smaller WebP copies are created the first time they are needed and then reused.
    """
    if not stored:
        return None
    original = MEDIA_DIR / stored.name
    if not original.exists():
        return None
    with Image.open(original) as img:
        width, height = img.size
        sizes = {}
        for key, target in SIZES.items():
            if width <= target:
                continue
            resized_name = f"_sizes/{original.stem}-{target}.webp"
            resized_path = MEDIA_DIR / resized_name
            new_height = round(height * target / width)
            if not resized_path.exists() or resized_path.stat().st_mtime < original.stat().st_mtime:
                resized_path.parent.mkdir(parents=True, exist_ok=True)
                copy = img.convert("RGBA" if img.mode in ("RGBA", "LA", "P") else "RGB")
                copy.resize((target, new_height), Image.Resampling.LANCZOS).save(resized_path, "WEBP", quality=80)
            sizes[key] = {"url": media_url(resized_name), "width": target, "height": new_height}
    return {"url": media_url(stored.name), "alt": alt, "width": width, "height": height, "sizes": sizes}
