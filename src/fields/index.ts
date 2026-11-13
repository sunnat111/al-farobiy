import type { Field } from 'payload'
import { slugify } from '../lib/slugify'

/** URL slug, filled automatically from the title if left empty. */
export const slugField = (from = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  label: 'URL (slug)',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Boʻsh qoldirsangiz, sarlavhadan avtomatik yaratiladi.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (value) return slugify(String(value))
        const source = data?.[from]
        if (typeof source === 'string' && source) return slugify(source)
        if (source && typeof source === 'object') {
          const first = Object.values(source as Record<string, string>).find(Boolean)
          if (first) return slugify(first)
        }
        return value
      },
    ],
  },
})

export const featuredField: Field = {
  name: 'featured',
  type: 'checkbox',
  label: 'Bosh sahifada koʻrsatish',
  defaultValue: false,
  admin: { position: 'sidebar' },
}

export const topicsField: Field = {
  name: 'topics',
  type: 'relationship',
  relationTo: 'topics',
  hasMany: true,
  label: 'Mavzular',
  admin: { position: 'sidebar' },
}

export const coverField = (label = 'Muqova / rasm'): Field => ({
  name: 'cover',
  type: 'upload',
  relationTo: 'media',
  label,
})

export const languageField: Field = {
  name: 'language',
  type: 'select',
  label: 'Asl tili',
  defaultValue: 'uz',
  options: [
    { label: 'Oʻzbekcha', value: 'uz' },
    { label: 'Inglizcha', value: 'en' },
    { label: 'Ruscha', value: 'ru' },
    { label: 'Arabcha', value: 'ar' },
    { label: 'Forscha', value: 'fa' },
  ],
  admin: { position: 'sidebar' },
}
