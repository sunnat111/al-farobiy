/**
 * Tiny Markdown-ish → Lexical JSON converter for seed content.
 * Supports: "## h2", "### h3", "- bullet", "1. numbered", "> quote", blank-line paragraphs, **bold**, *italic*.
 */
type Node = Record<string, unknown>

const base = { format: '', indent: 0, version: 1, direction: 'ltr' as const }

function inline(text: string): Node[] {
  const out: Node[] = []
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g
  let last = 0
  let m: RegExpExecArray | null
  const push = (t: string, format: number) => t && out.push({ type: 'text', detail: 0, format, mode: 'normal', style: '', text: t, version: 1 })
  while ((m = re.exec(text))) {
    push(text.slice(last, m.index), 0)
    const tok = m[0]
    if (tok.startsWith('**')) push(tok.slice(2, -2), 1)
    else push(tok.slice(1, -1), 2)
    last = m.index + tok.length
  }
  push(text.slice(last), 0)
  return out
}

type LexicalDoc = {
  [k: string]: unknown
  root: { type: string; children: { [k: string]: unknown; type: any; version: number }[]; direction: 'ltr' | 'rtl' | null; format: ''; indent: number; version: number }
}

export function md(src: string): LexicalDoc {
  const blocks = src.trim().split(/\n\s*\n/)
  const children: Node[] = []
  while (blocks.length) {
    const raw = blocks.shift()!
    const lines = raw.trim().split('\n').map((l) => l.trim())
    const first = lines[0]
    if (first.startsWith('### ') || first.startsWith('## ')) {
      const tag = first.startsWith('### ') ? 'h3' : 'h2'
      children.push({ ...base, type: 'heading', tag, children: inline(first.replace(/^#+\s/, '')) })
      // text right under a heading becomes its own block (paragraph, list, quote…)
      if (lines.length > 1) blocks.unshift(lines.slice(1).join('\n'))
    } else if (lines.every((l) => l.startsWith('- '))) {
      children.push({
        ...base,
        type: 'list',
        listType: 'bullet',
        start: 1,
        tag: 'ul',
        children: lines.map((l, i) => ({ ...base, type: 'listitem', value: i + 1, children: inline(l.slice(2)) })),
      })
    } else if (lines.every((l) => /^\d+\.\s/.test(l))) {
      children.push({
        ...base,
        type: 'list',
        listType: 'number',
        start: 1,
        tag: 'ol',
        children: lines.map((l, i) => ({ ...base, type: 'listitem', value: i + 1, children: inline(l.replace(/^\d+\.\s/, '')) })),
      })
    } else if (first.startsWith('> ')) {
      children.push({ ...base, type: 'quote', children: inline(lines.map((l) => l.replace(/^>\s?/, '')).join(' ')) })
    } else {
      children.push({ ...base, type: 'paragraph', textFormat: 0, textStyle: '', children: inline(lines.join(' ')) })
    }
  }
  return { root: { ...base, format: '', type: 'root', children: children as LexicalDoc['root']['children'] } }
}
