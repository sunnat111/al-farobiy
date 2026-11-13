import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { ru } from '@payloadcms/translations/languages/ru'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Authors } from './collections/Authors'
import { Books } from './collections/Books'
import { ClassicalTexts } from './collections/ClassicalTexts'
import { Competitions } from './collections/Competitions'
import { Courses } from './collections/Courses'
import { Messages, Proposals, Submissions } from './collections/Inbox'
import { Media } from './collections/Media'
import { Publications } from './collections/Publications'
import { Sessions } from './collections/Sessions'
import { Topics } from './collections/Topics'
import { Users } from './collections/Users'
import { AboutPage, HomePage, SiteSettings } from './globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' · AL-FOROB admin',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' }],
    },
    components: {
      graphics: {
        Logo: '@/components/admin/AdminLogo#AdminLogo',
        Icon: '@/components/admin/AdminLogo#AdminIcon',
      },
      beforeDashboard: ['@/components/admin/Welcome#Welcome'],
    },
  },
  i18n: {
    supportedLanguages: { en, ru },
    fallbackLanguage: 'en',
  },
  localization: {
    locales: [
      { label: 'Oʻzbekcha', code: 'uz' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'uz',
    fallback: true,
  },
  collections: [
    Courses,
    Publications,
    Books,
    ClassicalTexts,
    Sessions,
    Proposals,
    Competitions,
    Submissions,
    Authors,
    Topics,
    Media,
    Messages,
    Users,
  ],
  globals: [HomePage, AboutPage, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URL || 'file:./al-forob.db' },
    push: true,
  }),
  upload: { limits: { fileSize: 25_000_000 } },
  sharp,
})
