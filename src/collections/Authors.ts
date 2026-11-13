import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access'
import { slugField } from '../fields'
import { groups } from './shared'

export const Authors: CollectionConfig = {
  slug: 'authors',
  labels: { singular: 'Muallif', plural: 'Mualliflar va jamoa' },
  admin: { useAsTitle: 'name', group: groups.common, defaultColumns: ['name', 'kind', 'position'] },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'name', type: 'text', label: 'Ism-familiya', required: true },
    slugField('name'),
    {
      name: 'kind',
      type: 'select',
      label: 'Turi',
      required: true,
      defaultValue: 'researcher',
      options: [
        { label: 'Jamoa aʼzosi', value: 'team' },
        { label: 'Mentor', value: 'mentor' },
        { label: 'Tadqiqotchi', value: 'researcher' },
        { label: 'Talaba / yosh muallif', value: 'student' },
        { label: 'Mehmon spiker', value: 'guest' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'position', type: 'text', label: 'Lavozimi / maqomi', localized: true },
    { name: 'bio', type: 'textarea', label: 'Qisqacha biografiya', localized: true },
    { name: 'photo', type: 'upload', relationTo: 'media', label: 'Surat' },
    { name: 'region', type: 'text', label: 'Shahar / viloyat' },
    {
      name: 'links',
      type: 'group',
      label: 'Havolalar',
      fields: [
        { name: 'telegram', type: 'text', label: 'Telegram' },
        { name: 'email', type: 'email', label: 'Email' },
        { name: 'website', type: 'text', label: 'Veb-sayt' },
      ],
    },
    { name: 'order', type: 'number', label: 'Tartib raqami', defaultValue: 100, admin: { position: 'sidebar' } },
  ],
}
