import type { CollectionConfig, Field } from 'payload'
import { loggedIn } from '../access'
import { groups } from './shared'

const statusField = (options: { label: string; value: string }[]): Field => ({
  name: 'status',
  type: 'select',
  label: 'Holati',
  defaultValue: options[0].value,
  options,
  admin: { position: 'sidebar' },
})

/** Forms on the public site write here; only logged-in staff can read them. */
const inboxAccess: CollectionConfig['access'] = {
  create: () => false, // the site writes through server actions (with validation), not the open API
  read: loggedIn,
  update: loggedIn,
  delete: loggedIn,
}

export const Submissions: CollectionConfig = {
  slug: 'submissions',
  labels: { singular: 'Insho', plural: 'Topshirilgan insholar' },
  access: inboxAccess,
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'essayTitle',
    group: groups.competitions,
    defaultColumns: ['essayTitle', 'fullName', 'competition', 'wordCount', 'status', 'createdAt'],
    description: 'Saytdagi forma orqali kelgan insholar. Holatini oʻzgartirib, saralashni shu yerda olib boring.',
  },
  fields: [
    { name: 'competition', type: 'relationship', relationTo: 'competitions', label: 'Tanlov', required: true },
    {
      type: 'row',
      fields: [
        { name: 'fullName', type: 'text', label: 'Ism-familiya', required: true },
        { name: 'age', type: 'number', label: 'Yoshi' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', label: 'Email', required: true },
        { name: 'phone', type: 'text', label: 'Telefon / Telegram' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'region', type: 'text', label: 'Viloyat' },
        { name: 'school', type: 'text', label: 'Maktab / OTM' },
      ],
    },
    { name: 'essayTitle', type: 'text', label: 'Insho sarlavhasi', required: true },
    { name: 'essay', type: 'textarea', label: 'Insho matni', required: true },
    { name: 'wordCount', type: 'number', label: 'Soʻzlar soni', admin: { readOnly: true, position: 'sidebar' } },
    statusField([
      { label: 'Yangi', value: 'new' },
      { label: 'Koʻrib chiqilmoqda', value: 'review' },
      { label: 'Saralangan', value: 'shortlisted' },
      { label: 'Gʻolib', value: 'winner' },
      { label: 'Rad etilgan', value: 'rejected' },
    ]),
    { name: 'score', type: 'number', label: 'Ball (0–100)', min: 0, max: 100, admin: { position: 'sidebar' } },
    { name: 'judgeNotes', type: 'textarea', label: 'Hakam izohi (ichki)', admin: { position: 'sidebar' } },
  ],
}

export const Proposals: CollectionConfig = {
  slug: 'proposals',
  labels: { singular: 'Taklif', plural: 'Muhokama uchun takliflar' },
  access: inboxAccess,
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'topic',
    group: groups.hub,
    defaultColumns: ['topic', 'name', 'status', 'createdAt'],
    description: 'Virtual Hub sahifasidagi “Mavzu taklif qiling” formasi orqali kelgan gʻoyalar.',
  },
  fields: [
    { name: 'topic', type: 'text', label: 'Taklif qilingan mavzu', required: true },
    { name: 'description', type: 'textarea', label: 'Nega muhim?' },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', label: 'Ism', required: true },
        { name: 'contact', type: 'text', label: 'Email yoki Telegram', required: true },
        { name: 'region', type: 'text', label: 'Viloyat' },
      ],
    },
    statusField([
      { label: 'Yangi', value: 'new' },
      { label: 'Rejaga olindi', value: 'planned' },
      { label: 'Oʻtkazildi', value: 'done' },
      { label: 'Arxiv', value: 'archived' },
    ]),
  ],
}

export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: { singular: 'Xabar', plural: 'Aloqa xabarlari' },
  access: inboxAccess,
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'subject',
    group: groups.inbox,
    defaultColumns: ['subject', 'name', 'email', 'status', 'createdAt'],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', label: 'Ism', required: true },
        { name: 'email', type: 'email', label: 'Email', required: true },
      ],
    },
    {
      name: 'reason',
      type: 'select',
      label: 'Murojaat turi',
      defaultValue: 'general',
      options: [
        { label: 'Umumiy savol', value: 'general' },
        { label: 'Hamkorlik', value: 'partnership' },
        { label: 'Maqola/tahlilnoma yuborish', value: 'publish' },
        { label: 'Mentor yoki koʻngilli boʻlish', value: 'volunteer' },
      ],
    },
    { name: 'subject', type: 'text', label: 'Mavzu', required: true },
    { name: 'message', type: 'textarea', label: 'Xabar', required: true },
    statusField([
      { label: 'Yangi', value: 'new' },
      { label: 'Javob berildi', value: 'answered' },
      { label: 'Arxiv', value: 'archived' },
    ]),
  ],
}
