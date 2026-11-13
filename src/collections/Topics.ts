import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access'
import { slugField } from '../fields'
import { groups } from './shared'

export const topicColors = ['lapis', 'turquoise', 'gold', 'terracotta', 'emerald', 'plum'] as const
export const topicIcons = ['landmark', 'scale', 'coins', 'book-open', 'moon-star', 'flag', 'globe', 'users'] as const

export const Topics: CollectionConfig = {
  slug: 'topics',
  labels: { singular: 'Mavzu', plural: 'Mavzular' },
  admin: { useAsTitle: 'title', group: groups.common, defaultColumns: ['title', 'slug', 'order'] },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', label: 'Nomi', required: true, localized: true },
    slugField(),
    { name: 'description', type: 'textarea', label: 'Tavsifi', localized: true },
    {
      type: 'row',
      fields: [
        { name: 'color', type: 'select', label: 'Rangi', defaultValue: 'lapis', options: topicColors.map((c) => ({ label: c, value: c })) },
        { name: 'icon', type: 'select', label: 'Belgisi', defaultValue: 'book-open', options: topicIcons.map((c) => ({ label: c, value: c })) },
        { name: 'order', type: 'number', label: 'Tartib', defaultValue: 10 },
      ],
    },
  ],
}
