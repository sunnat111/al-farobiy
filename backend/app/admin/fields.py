"""Custom admin form pieces: a rich text editor with a useful toolbar, and an Uzbek file upload widget."""

from pathlib import PurePath

from markupsafe import Markup
from sqladmin import fields as sqladmin_fields
from sqladmin.editors import QuillField
from sqladmin.widgets import FileInputWidget

from ..storage import media_url

IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}


class RichTextField(QuillField):
    """Quill editor with headings, bold/italic, links, lists and quotes. Saves HTML."""

    editor_init_template = "admin_richtext.html"

    def __init__(self, *args, **kwargs):
        kwargs.setdefault("min_height", 260)
        super().__init__(*args, **kwargs)


class UzFileInputWidget(FileInputWidget):
    """Shows the current file (with a small preview for images) and an Uzbek "remove" checkbox."""

    def __call__(self, field, **kwargs):
        upload = super(FileInputWidget, self).__call__(field, **kwargs)  # the plain <input type="file">
        if not field.data:
            return upload
        name = getattr(field.data, "name", str(field.data))
        url = media_url(name)
        preview = (
            Markup('<img src="{}" alt="" style="max-height:120px;border-radius:6px;display:block;margin-bottom:6px">').format(url)
            if PurePath(name).suffix.lower() in IMAGE_SUFFIXES
            else Markup("")
        )
        current = Markup('<div class="mb-2">{}<a href="{}" target="_blank" rel="noreferrer">{}</a></div>').format(
            preview, url, PurePath(name).name
        )
        field.flags.required = False
        checkbox_id = f"{field.id}_checkbox"  # SQLAdmin clears the file when this box is ticked
        remove = Markup(
            '<div class="form-check mb-2"><input class="form-check-input" type="checkbox" id="{0}" name="{0}">'
            '<label class="form-check-label" for="{0}">Faylni oʻchirish</label></div>'
        ).format(checkbox_id)
        hint = Markup('<div class="form-hint">Almashtirish uchun yangi fayl tanlang.</div>')
        return current + remove + upload + hint


def install_widgets() -> None:
    """Use the Uzbek widget for every file and image field in the admin."""
    sqladmin_fields.FileField.widget = UzFileInputWidget()
