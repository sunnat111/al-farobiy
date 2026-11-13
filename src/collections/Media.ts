import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access'
import { groups } from './shared'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Fayl', plural: 'Media (rasm, PDF, audio)' },
  admin: { group: groups.common, defaultColumns: ['filename', 'alt', 'mimeType', 'updatedAt'] },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Tavsif (alt matn)',
      required: true,
      admin: { description: 'Rasmda nima borligini qisqacha yozing (koʻzi ojiz foydalanuvchilar va SEO uchun).' },
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'application/pdf', 'audio/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumb', width: 400, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'card', width: 900, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'hero', width: 1800, formatOptions: { format: 'webp', options: { quality: 78 } } },
    ],
    adminThumbnail: 'thumb',
  },
}
