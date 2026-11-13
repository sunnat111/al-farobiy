import { RichText as LexicalRichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import React from 'react'
import { slugify } from '@/lib/slugify'

type LexNode = { type?: string; tag?: string; text?: string; children?: LexNode[] }

function textOf(node: LexNode): string {
  if (node.text) return node.text
  return (node.children ?? []).map(textOf).join('')
}

/** h2 headings of a rich text field, for a table of contents. */
export function headingsOf(data: unknown): { id: string; text: string }[] {
  const root = (data as { root?: LexNode } | null)?.root
  if (!root) return []
  return (root.children ?? []).filter((n) => n.type === 'heading' && n.tag === 'h2').map((n) => ({ id: slugify(textOf(n)), text: textOf(n) }))
}

const withAnchors: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const Tag = (['h2', 'h3', 'h4'].includes(node.tag) ? node.tag : 'h2') as 'h2' | 'h3' | 'h4'
    const id = Tag === 'h2' ? slugify(textOf(node as unknown as LexNode)) : undefined
    return (
      <Tag id={id} className={id ? 'scroll-mt-28' : undefined}>
        {children}
      </Tag>
    )
  },
})

export function RichText({ data, className = 'reader' }: { data: unknown; className?: string }) {
  if (!data || typeof data !== 'object') return null
  return <LexicalRichText data={data as SerializedEditorState} className={className} converters={withAnchors} />
}
