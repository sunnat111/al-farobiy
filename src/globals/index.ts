import type { GlobalConfig } from 'payload'
import { anyone, loggedIn } from '../access'
import { groups } from '../collections/shared'

const access = { read: anyone, update: loggedIn }

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Sayt sozlamalari',
  admin: { group: groups.common },
  access,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Umumiy',
          fields: [
            { name: 'siteName', type: 'text', label: 'Loyiha nomi', required: true, defaultValue: 'AL-FOROB AVLODIDAN' },
            { name: 'tagline', type: 'text', label: 'Shior', localized: true },
            { name: 'description', type: 'textarea', label: 'Sayt tavsifi (SEO)', localized: true },
            {
              name: 'announcement',
              type: 'group',
              label: 'Yuqoridagi eʼlon qatori',
              fields: [
                { name: 'enabled', type: 'checkbox', label: 'Koʻrsatish', defaultValue: true },
                { name: 'text', type: 'text', label: 'Matn', localized: true },
                { name: 'link', type: 'text', label: 'Havola (masalan /uz/musobaqalar)' },
              ],
            },
          ],
        },
        {
          label: 'Aloqa va tarmoqlar',
          fields: [
            {
              name: 'contact',
              type: 'group',
              label: 'Aloqa',
              fields: [
                { name: 'email', type: 'email', label: 'Email' },
                { name: 'phone', type: 'text', label: 'Telefon' },
                { name: 'address', type: 'text', label: 'Manzil', localized: true },
              ],
            },
            {
              name: 'socials',
              type: 'group',
              label: 'Ijtimoiy tarmoqlar',
              fields: [
                { name: 'telegramChannel', type: 'text', label: 'Telegram kanal' },
                { name: 'telegramGroup', type: 'text', label: 'Telegram muhokama guruhi' },
                { name: 'instagram', type: 'text', label: 'Instagram' },
                { name: 'youtube', type: 'text', label: 'YouTube' },
                { name: 'facebook', type: 'text', label: 'Facebook' },
              ],
            },
          ],
        },
        {
          label: 'Virtual Hub',
          fields: [
            { name: 'hubQuestion', type: 'text', label: 'Haftaning munozarali savoli', localized: true },
            { name: 'hubQuestionContext', type: 'textarea', label: 'Savol konteksti', localized: true },
            {
              name: 'hubRules',
              type: 'array',
              label: 'Muhokama madaniyati qoidalari',
              fields: [{ name: 'text', type: 'text', label: 'Qoida', localized: true }],
            },
          ],
        },
        {
          label: 'Hamkorlar',
          fields: [
            {
              name: 'partners',
              type: 'array',
              label: 'Hamkorlar',
              fields: [
                { name: 'name', type: 'text', label: 'Nomi', required: true },
                { name: 'url', type: 'text', label: 'Havola' },
                { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logotip' },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Bosh sahifa',
  admin: { group: groups.common },
  access,
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Bosh banner',
      fields: [
        { name: 'eyebrow', type: 'text', label: 'Ustki yozuv', localized: true },
        { name: 'title', type: 'text', label: 'Sarlavha', localized: true },
        { name: 'highlight', type: 'text', label: 'Ajratilgan soʻz (sarlavha ichidan)', localized: true },
        { name: 'subtitle', type: 'textarea', label: 'Matn', localized: true },
      ],
    },
    {
      name: 'spotlight',
      type: 'relationship',
      label: 'Diqqat markazida (katta kartochka)',
      relationTo: ['publications', 'courses', 'sessions', 'competitions', 'classical-texts'],
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Raqamlar',
      maxRows: 4,
      fields: [
        { name: 'value', type: 'text', label: 'Qiymat', required: true },
        { name: 'label', type: 'text', label: 'Izoh', localized: true },
      ],
    },
  ],
}

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'Loyiha haqida',
  admin: { group: groups.common },
  access,
  fields: [
    { name: 'intro', type: 'textarea', label: 'Kirish matni', localized: true },
    { name: 'manifesto', type: 'richText', label: 'Manifest', localized: true },
    {
      type: 'row',
      fields: [
        { name: 'mission', type: 'textarea', label: 'Missiya', localized: true },
        { name: 'vision', type: 'textarea', label: 'Maqsad (vizyon)', localized: true },
      ],
    },
    {
      name: 'values',
      type: 'array',
      label: 'Qadriyatlar',
      fields: [
        { name: 'title', type: 'text', label: 'Qadriyat', localized: true },
        { name: 'text', type: 'textarea', label: 'Izoh', localized: true },
      ],
    },
    { name: 'team', type: 'relationship', relationTo: 'authors', hasMany: true, label: 'Jamoa (tartib boʻyicha)' },
    {
      name: 'faq',
      type: 'array',
      label: 'Koʻp soʻraladigan savollar',
      fields: [
        { name: 'q', type: 'text', label: 'Savol', localized: true },
        { name: 'a', type: 'textarea', label: 'Javob', localized: true },
      ],
    },
  ],
}
