import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminField, loggedIn } from '../access'
import { groups } from './shared'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Foydalanuvchi', plural: 'Admin foydalanuvchilar' },
  admin: {
    useAsTitle: 'email',
    group: groups.system,
    defaultColumns: ['name', 'email', 'role'],
  },
  auth: true,
  access: {
    read: loggedIn,
    create: isAdmin,
    update: ({ req, id }) => req.user?.role === 'admin' || req.user?.id === id,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Ism' },
    {
      name: 'role',
      type: 'select',
      label: 'Rol',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Administrator (hamma narsa)', value: 'admin' },
        { label: 'Muharrir (kontent)', value: 'editor' },
      ],
      access: { update: isAdminField },
      saveToJWT: true,
    },
  ],
}
