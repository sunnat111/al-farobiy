import type { CollectionConfig } from 'payload'
import { coverField, featuredField, slugField, topicsField } from '../fields'
import { contentDefaults, groups } from './shared'

export const Sessions: CollectionConfig = {
  slug: 'sessions',
  labels: { singular: 'Davra suhbati', plural: 'Davra suhbatlari' },
  ...contentDefaults,
  defaultSort: '-date',
  admin: {
    useAsTitle: 'title',
    group: groups.hub,
    defaultColumns: ['title', 'date', 'format', '_status'],
    description: 'Virtual Hub: oylik davra suhbatlari va muhokamalar arxivi (audio/video, xulosalar).',
  },
  fields: [
    { name: 'title', type: 'text', label: 'Mavzu', required: true, localized: true },
    { name: 'question', type: 'text', label: 'Asosiy savol', localized: true },
    { name: 'summary', type: 'textarea', label: 'Qisqacha', localized: true },
    {
      name: 'takeaways',
      type: 'array',
      label: 'Muhokama xulosalari',
      fields: [{ name: 'text', type: 'text', label: 'Xulosa', localized: true }],
    },
    { name: 'notes', type: 'richText', label: 'Batafsil qayd', localized: true },
    coverField(),
    {
      type: 'row',
      fields: [
        { name: 'recordingUrl', type: 'text', label: 'YouTube yozuvi havolasi' },
        { name: 'joinUrl', type: 'text', label: 'Qoʻshilish havolasi (Zoom / Telegram)' },
      ],
    },
    { name: 'audio', type: 'upload', relationTo: 'media', label: 'Audio yozuv (mp3)' },
    { name: 'guests', type: 'text', label: 'Qoʻshimcha ishtirokchilar (matn)' },
    slugField(),
    { name: 'date', type: 'date', label: 'Sana va vaqt', required: true, admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } } },
    {
      name: 'format',
      type: 'select',
      label: 'Format',
      defaultValue: 'online',
      options: [
        { label: 'Onlayn', value: 'online' },
        { label: 'Oflayn', value: 'offline' },
        { label: 'Gibrid', value: 'hybrid' },
        { label: 'Audio (Telegram)', value: 'audio' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'location', type: 'text', label: 'Joy', admin: { position: 'sidebar' } },
    { name: 'speakers', type: 'relationship', relationTo: 'authors', hasMany: true, label: 'Spikerlar', admin: { position: 'sidebar' } },
    { name: 'participants', type: 'number', label: 'Ishtirokchilar soni', admin: { position: 'sidebar' } },
    topicsField,
    featuredField,
  ],
}
