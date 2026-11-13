import type { CollectionConfig } from 'payload'
import { coverField, featuredField, slugField, topicsField } from '../fields'
import { contentDefaults, groups } from './shared'

export const Competitions: CollectionConfig = {
  slug: 'competitions',
  labels: { singular: 'Tanlov', plural: 'Haftalik tanlovlar' },
  ...contentDefaults,
  defaultSort: '-deadline',
  admin: {
    useAsTitle: 'title',
    group: groups.competitions,
    defaultColumns: ['title', 'startDate', 'deadline', '_status'],
    description: 'Har haftalik insho tanlovi: mavzu, qoidalar, muddat va gʻoliblar. Gʻoliblar “Shon-sharaf zali”da avtomatik chiqadi.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Tanlov',
          fields: [
            { name: 'title', type: 'text', label: 'Tanlov nomi', required: true, localized: true },
            { name: 'prompt', type: 'textarea', label: 'Insho savoli / mavzusi', localized: true },
            { name: 'description', type: 'richText', label: 'Tavsif', localized: true },
            {
              name: 'rules',
              type: 'array',
              label: 'Qoidalar',
              fields: [{ name: 'text', type: 'text', label: 'Qoida', localized: true }],
            },
            {
              name: 'criteria',
              type: 'array',
              label: 'Baholash mezonlari',
              fields: [
                { name: 'title', type: 'text', label: 'Mezon', localized: true },
                { name: 'weight', type: 'number', label: 'Ulushi (%)' },
              ],
            },
            {
              name: 'prizes',
              type: 'array',
              label: 'Mukofotlar',
              fields: [{ name: 'text', type: 'text', label: 'Mukofot', localized: true }],
            },
            coverField(),
          ],
        },
        {
          label: 'Gʻoliblar',
          fields: [
            {
              name: 'winners',
              type: 'array',
              label: 'Gʻoliblar',
              labels: { singular: 'Gʻolib', plural: 'Gʻoliblar' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'place',
                      type: 'select',
                      label: 'Oʻrin',
                      required: true,
                      options: [
                        { label: '1-oʻrin', value: '1' },
                        { label: '2-oʻrin', value: '2' },
                        { label: '3-oʻrin', value: '3' },
                        { label: 'Maxsus nominatsiya', value: 'special' },
                      ],
                    },
                    { name: 'name', type: 'text', label: 'Ism-familiya', required: true },
                    { name: 'age', type: 'number', label: 'Yoshi' },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'school', type: 'text', label: 'Maktab / OTM' },
                    { name: 'region', type: 'text', label: 'Viloyat' },
                  ],
                },
                { name: 'essayTitle', type: 'text', label: 'Insho sarlavhasi', required: true },
                { name: 'essayExcerpt', type: 'textarea', label: 'Inshodan parcha' },
                { name: 'essay', type: 'richText', label: 'Toʻliq insho' },
                { name: 'photo', type: 'upload', relationTo: 'media', label: 'Surat' },
              ],
            },
          ],
        },
      ],
    },
    slugField(),
    { name: 'number', type: 'number', label: 'Tanlov raqami (#)', admin: { position: 'sidebar' } },
    { name: 'startDate', type: 'date', label: 'Boshlanish sanasi', required: true, admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } } },
    { name: 'deadline', type: 'date', label: 'Topshirish muddati', required: true, admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } } },
    {
      type: 'row',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'minWords', type: 'number', label: 'Min soʻz', defaultValue: 600 },
        { name: 'maxWords', type: 'number', label: 'Maks soʻz', defaultValue: 1200 },
      ],
    },
    { name: 'audience', type: 'text', label: 'Kimlar uchun', localized: true, admin: { position: 'sidebar' } },
    { name: 'judges', type: 'relationship', relationTo: 'authors', hasMany: true, label: 'Hakamlar', admin: { position: 'sidebar' } },
    { name: 'acceptSubmissions', type: 'checkbox', label: 'Saytda insho qabul qilish', defaultValue: true, admin: { position: 'sidebar' } },
    topicsField,
    featuredField,
  ],
}
