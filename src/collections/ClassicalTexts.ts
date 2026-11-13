import type { CollectionConfig } from 'payload'
import { coverField, featuredField, slugField, topicsField } from '../fields'
import { contentDefaults, groups } from './shared'

export const ClassicalTexts: CollectionConfig = {
  slug: 'classical-texts',
  labels: { singular: 'Mumtoz asar', plural: 'Mumtoz asarlar' },
  ...contentDefaults,
  defaultSort: 'order',
  admin: {
    useAsTitle: 'title',
    group: groups.library,
    defaultColumns: ['title', 'thinker', 'era', '_status'],
    description: 'Kutubxona II: Platon, Aristotel, Forobiy, Ibn Xaldun, Lokk, Mill va boshqalar — kirish, asosiy gʻoyalar va ilmiy sharh bilan.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Asar',
          fields: [
            { name: 'title', type: 'text', label: 'Asar nomi', required: true, localized: true },
            { name: 'originalTitle', type: 'text', label: 'Asl nomi' },
            {
              type: 'row',
              fields: [
                { name: 'thinker', type: 'text', label: 'Mutafakkir', localized: true },
                { name: 'era', type: 'text', label: 'Davri (masalan: mil. avv. IV asr)', localized: true },
                { name: 'originalLanguage', type: 'text', label: 'Asl tili', localized: true },
              ],
            },
            { name: 'intro', type: 'textarea', label: 'Kirish (kartochkada chiqadi)', localized: true },
            coverField('Rasm'),
          ],
        },
        {
          label: 'Sharh',
          fields: [
            { name: 'context', type: 'richText', label: 'Tarixiy kontekst', localized: true },
            {
              name: 'keyIdeas',
              type: 'array',
              label: 'Asosiy gʻoyalar',
              fields: [
                { name: 'title', type: 'text', label: 'Gʻoya', localized: true },
                { name: 'text', type: 'textarea', label: 'Izoh', localized: true },
              ],
            },
            { name: 'commentary', type: 'richText', label: 'Ilmiy sharh', localized: true },
            {
              name: 'questions',
              type: 'array',
              label: 'Muhokama uchun savollar',
              fields: [{ name: 'text', type: 'text', label: 'Savol', localized: true }],
            },
          ],
        },
        {
          label: 'Matn va havolalar',
          fields: [
            { name: 'excerpt', type: 'richText', label: 'Asardan parcha (ommaviy mulk tarjimasi)', localized: true },
            { name: 'file', type: 'upload', relationTo: 'media', label: 'Toʻliq matn PDF' },
            { name: 'fullTextUrl', type: 'text', label: 'Toʻliq matnga havola' },
          ],
        },
      ],
    },
    slugField(),
    topicsField,
    featuredField,
    { name: 'order', type: 'number', label: 'Tartib (xronologik)', defaultValue: 10, admin: { position: 'sidebar' } },
  ],
}
