import type { CollectionConfig } from 'payload'
import { coverField, featuredField, slugField, topicsField } from '../fields'
import { contentDefaults, groups } from './shared'

export const Courses: CollectionConfig = {
  slug: 'courses',
  labels: { singular: 'Kurs', plural: 'Kurslar' },
  ...contentDefaults,
  defaultSort: 'order',
  admin: {
    useAsTitle: 'title',
    group: groups.academic,
    defaultColumns: ['title', 'code', 'level', '_status', 'updatedAt'],
    description: 'Akademik dasturlar boʻlimidagi kurslar: darslar, adabiyotlar va test savollari bilan.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Asosiy',
          fields: [
            { name: 'title', type: 'text', label: 'Kurs nomi', required: true, localized: true },
            { name: 'code', type: 'text', label: 'Qisqa kod (masalan POL-101)' },
            { name: 'tagline', type: 'text', label: 'Bir qatorli tavsif', localized: true },
            { name: 'summary', type: 'textarea', label: 'Qisqa mazmuni', localized: true },
            { name: 'description', type: 'richText', label: 'Batafsil tavsif', localized: true },
            {
              name: 'outcomes',
              type: 'array',
              label: 'Kurs yakunida talaba nimani biladi',
              fields: [{ name: 'text', type: 'text', label: 'Natija', localized: true }],
            },
            coverField('Kurs banneri'),
          ],
        },
        {
          label: 'Darslar',
          fields: [
            {
              name: 'lessons',
              type: 'array',
              label: 'Darslar',
              labels: { singular: 'Dars', plural: 'Darslar' },
              admin: { initCollapsed: true },
              fields: [
                { name: 'title', type: 'text', label: 'Dars mavzusi', localized: true },
                { name: 'duration', type: 'text', label: 'Davomiyligi (masalan 45 daq)' },
                { name: 'summary', type: 'textarea', label: 'Qisqacha', localized: true },
                { name: 'videoUrl', type: 'text', label: 'YouTube havolasi (ixtiyoriy)' },
                { name: 'content', type: 'richText', label: 'Dars matni', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Adabiyotlar va test',
          fields: [
            {
              name: 'readings',
              type: 'relationship',
              label: 'Tavsiya etilgan adabiyotlar (kutubxonadan)',
              relationTo: ['books', 'classical-texts', 'publications'],
              hasMany: true,
            },
            {
              name: 'quiz',
              type: 'array',
              label: 'Oʻz-oʻzini tekshirish testi',
              labels: { singular: 'Savol', plural: 'Savollar' },
              admin: { initCollapsed: true },
              fields: [
                { name: 'question', type: 'text', label: 'Savol', localized: true },
                {
                  name: 'options',
                  type: 'array',
                  label: 'Javob variantlari',
                  minRows: 2,
                  maxRows: 5,
                  fields: [{ name: 'text', type: 'text', label: 'Variant', localized: true }],
                },
                {
                  name: 'correct',
                  type: 'number',
                  label: 'Toʻgʻri javob raqami (1 dan boshlab)',
                  required: true,
                  min: 1,
                  max: 5,
                },
                { name: 'explanation', type: 'textarea', label: 'Izoh', localized: true },
              ],
            },
          ],
        },
      ],
    },
    slugField(),
    {
      name: 'level',
      type: 'select',
      label: 'Darajasi',
      defaultValue: 'beginner',
      options: [
        { label: 'Boshlangʻich', value: 'beginner' },
        { label: 'Oʻrta', value: 'intermediate' },
        { label: 'Yuqori', value: 'advanced' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'duration', type: 'text', label: 'Kurs davomiyligi (masalan 8 hafta)', admin: { position: 'sidebar' } },
    { name: 'instructors', type: 'relationship', relationTo: 'authors', hasMany: true, label: 'Oʻqituvchilar', admin: { position: 'sidebar' } },
    topicsField,
    featuredField,
    { name: 'order', type: 'number', label: 'Tartib', defaultValue: 10, admin: { position: 'sidebar' } },
  ],
}
