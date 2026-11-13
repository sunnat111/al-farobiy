import type { CollectionConfig } from 'payload'
import { coverField, featuredField, languageField, slugField, topicsField } from '../fields'
import { contentDefaults, groups } from './shared'

export const bookCategories = [
  { label: 'Siyosatshunoslik va demokratiya', value: 'political-science' },
  { label: 'Iqtisodiy nazariya va rivojlanish', value: 'economics' },
  { label: 'Falsafa va huquq', value: 'philosophy-law' },
  { label: 'Islom va zamonaviylik', value: 'islam-modernity' },
] as const

export const Books: CollectionConfig = {
  slug: 'books',
  labels: { singular: 'Kitob', plural: 'Zamonaviy kitoblar' },
  ...contentDefaults,
  defaultSort: 'title',
  admin: {
    useAsTitle: 'title',
    group: groups.library,
    defaultColumns: ['title', 'authorsText', 'year', 'category', '_status'],
    description: 'Kutubxona I: zamonaviy kitoblar katalogi. Toʻliq PDF faqat huquqi boʻlsa yuklansin, aks holda “Qayerdan topish” havolasini qoʻying.',
    listSearchableFields: ['title', 'authorsText'],
  },
  fields: [
    { name: 'title', type: 'text', label: 'Kitob nomi (asl tilda)', required: true },
    { name: 'titleTranslated', type: 'text', label: 'Nomi tarjimada', localized: true },
    { name: 'authorsText', type: 'text', label: 'Muallif(lar)', required: true },
    {
      type: 'row',
      fields: [
        { name: 'year', type: 'number', label: 'Nashr yili', required: true },
        { name: 'pages', type: 'number', label: 'Sahifalar soni' },
        { name: 'publisher', type: 'text', label: 'Nashriyot' },
      ],
    },
    { name: 'summary', type: 'textarea', label: 'Qisqacha mazmuni', localized: true },
    { name: 'whyRead', type: 'textarea', label: 'Nega oʻqish kerak (tahririyat izohi)', localized: true },
    coverField('Muqova'),
    { name: 'file', type: 'upload', relationTo: 'media', label: 'PDF (faqat ruxsat boʻlsa)' },
    { name: 'externalUrl', type: 'text', label: 'Qayerdan topish mumkin (havola)' },
    slugField(),
    {
      name: 'category',
      type: 'select',
      label: 'Boʻlim',
      required: true,
      options: [...bookCategories],
      admin: { position: 'sidebar' },
    },
    {
      name: 'badge',
      type: 'select',
      label: 'Belgi',
      options: [
        { label: 'Yangi', value: 'new' },
        { label: 'Tavsiya', value: 'recommended' },
        { label: 'Kitob klubi', value: 'book-club' },
      ],
      admin: { position: 'sidebar' },
    },
    topicsField,
    languageField,
    featuredField,
  ],
}
