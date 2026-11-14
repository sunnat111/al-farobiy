"""Small helpers shared by models, API and seed."""

import re
import unicodedata

_CYRILLIC = {
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo", "ж": "j", "з": "z", "и": "i",
    "й": "y", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t",
    "у": "u", "ф": "f", "х": "x", "ц": "s", "ч": "ch", "ш": "sh", "щ": "sh", "ъ": "", "ы": "i", "ь": "",
    "э": "e", "ю": "yu", "я": "ya", "ў": "o", "қ": "q", "ғ": "g", "ҳ": "h",
}


def slugify(text: str) -> str:
    """Uzbek-aware URL slug: "Oʻzbek davlatchiligi" -> "ozbek-davlatchiligi"."""
    text = text.lower()
    text = re.sub(r"[ʻʼ‘’'`]", "", text)
    text = "".join(_CYRILLIC.get(ch, ch) for ch in text)
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text[:80]


def lines(value: str | None) -> list[str]:
    """Admin "one item per line" fields -> list of non-empty lines."""
    return [ln.strip() for ln in (value or "").splitlines() if ln.strip()]


def pairs(value: str | None) -> list[tuple[str, str]]:
    """Lines written as "left | right" -> list of (left, right)."""
    out = []
    for ln in lines(value):
        left, _, right = ln.partition("|")
        out.append((left.strip(), right.strip()))
    return out


def word_count(text: str) -> int:
    return len(text.split())
