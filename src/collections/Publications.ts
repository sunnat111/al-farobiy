import type { CollectionConfig } from 'payload'
import { coverField, featuredField, languageField, slugField, topicsField } from '../fields'
import { contentDefaults, groups } from './shared'

export const publicationKinds = [
  { label: 'Tadqiqot ishi (Tadqiqot va nazariya)', value: 'research' },
  { label: 'Ilmiy maqola (Kutubxona III)', value: 'article' },
  { label: 'Xalqaro jurnaldan tanlangan maqola (Kutubxona III)', value: 'curated' },
  { label: 'Siyosiy tahlilnoma / Policy brief (Kutubxona IV)', value: 'brief' },
] as const

export const researchSeries = [
  { label: 'Islamic Liberal Democracy', value: 'islamic-liberal-democracy' },
  { label: 'Milliy davlatchilik va meros', value: 'national-statehood' },
  { label: 'Boshqa tadqiqotlar', value: 'other' },
] as const

export const Publications: CollectionConfig = {
  slug: 'publications',
  labels: { singular: 'Nashr', plural: 'Nashrlar (tadqiqot, maqola, tahlilnoma)' },
  ...contentDefaults,
  defaultSort: '-publishedDate',
  admin: {
    useAsTitle: 'title',
    group: groups.research,
    defaultColumns: ['title', 'kind', 'publishedDate', '_status'],
    description:
      'Bitta joyda: tadqiqot ishlari, ilmiy maqolalar, xalqaro jurnallardan tanlovlar va siyosiy tahlilnomalar. “Turi” maydoni saytning qaysi boʻlimida chiqishini belgilaydi.',
    listSearchableFields: ['title', 'excerpt'],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Matn',
          fields: [
            { name: 'title', type: 'text', label: 'Sarlavha', required: true, localized: true },
            { name: 'subtitle', type: 'text', label: 'Kichik sarlavha', localized: true },
            { name: 'excerpt', type: 'textarea', label: 'Qisqa tavsif (kartochkada chiqadi)', localized: true },
            { name: 'content', type: 'richText', label: 'Toʻliq matn', localized: true },
          ],
        },
        {
          label: 'Xulosa va asosiy fikrlar',
          fields: [
            { name: 'summary', type: 'textarea', label: 'Qisqa xulosa', localized: true },
            {
              name: 'keyPoints',
              type: 'array',
              label: 'Asosiy fikrlar',
              fields: [{ name: 'text', type: 'text', label: 'Fikr', localized: true }],
            },
            {
              name: 'references',
              type: 'array',
              label: 'Manbalar / izohlar',
              fields: [{ name: 'text', type: 'textarea', label: 'Manba', required: true }],
            },
          ],
        },
        {
          label: 'Fayllar va havolalar',
          fields: [
            coverField(),
            { name: 'pdf', type: 'upload', relationTo: 'media', label: 'PDF fayl' },
            { name: 'journal', type: 'text', label: 'Jurnal nomi (tanlangan maqolalar uchun)' },
            { name: 'externalAuthors', type: 'text', label: 'Tashqi mualliflar (matn sifatida)' },
            { name: 'externalUrl', type: 'text', label: 'Asl manbaga havola' },
            { name: 'doi', type: 'text', label: 'DOI' },
          ],
        },
      ],
    },
    slugField(),
    {
      name: 'kind',
      type: 'select',
      label: 'Turi',
      required: true,
      defaultValue: 'article',
      options: [...publicationKinds],
      admin: { position: 'sidebar' },
    },
    {
      name: 'series',
      type: 'select',
      label: 'Tadqiqot yoʻnalishi',
      options: [...researchSeries],
      admin: { position: 'sidebar', condition: (data) => data?.kind === 'research' },
    },
    { name: 'publishedDate', type: 'date', label: 'Eʼlon qilingan sana', required: true, defaultValue: () => new Date().toISOString(), admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } } },
    { name: 'authors', type: 'relationship', relationTo: 'authors', hasMany: true, label: 'Mualliflar', admin: { position: 'sidebar' } },
    { name: 'readTime', type: 'number', label: 'Oʻqish vaqti (daqiqa)', admin: { position: 'sidebar' } },
    topicsField,
    languageField,
    featuredField,
  ],
}
