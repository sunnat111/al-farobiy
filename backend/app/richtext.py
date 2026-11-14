"""Rich text: Markdown -> HTML (demo content) and cleaning HTML from the admin editor."""

import re

import markdown as md_lib
import nh3

ALLOWED_TAGS = {
    "p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "a",
    "ul", "ol", "li", "blockquote", "code", "pre", "hr",
}
ALLOWED_ATTRIBUTES = {"a": {"href", "title", "target"}, "li": {"data-list"}}


def markdown_to_html(text: str | None) -> str:
    """Used by the seed script: demo texts are written in Markdown."""
    return md_lib.markdown(text or "", extensions=["sane_lists"])


_OL_BLOCK = re.compile(r"<ol>(.*?)</ol>", re.S)


def _fix_quill_lists(html: str) -> str:
    """The Quill editor writes bullet lists as <ol><li data-list="bullet">; turn them back into <ul>."""

    def repl(match: re.Match) -> str:
        inner = match.group(1)
        if 'data-list="bullet"' in inner and 'data-list="ordered"' not in inner:
            return f"<ul>{inner}</ul>"
        return match.group(0)

    return _OL_BLOCK.sub(repl, html)


def clean_html(html: str | None) -> str | None:
    """Remove anything unsafe (scripts, styles, event handlers) before HTML reaches the website."""
    if not html or not html.strip() or html.strip() in ("<p><br></p>", "<p></p>"):
        return None
    html = _fix_quill_lists(html)
    html = nh3.clean(html, tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRIBUTES, link_rel="noopener noreferrer")
    html = re.sub(r'\s*data-list="[^"]*"', "", html)
    html = html.replace("<p><br></p>", "")
    return html
