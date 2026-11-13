import type { CollectionConfig } from 'payload'
import { loggedIn, publishedOrLoggedIn } from '../access'

/** Defaults for public content: drafts + publish button, editors can write, public reads published. */
export const contentDefaults: Pick<CollectionConfig, 'access' | 'versions'> = {
  access: {
    read: publishedOrLoggedIn,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  versions: { drafts: true, maxPerDoc: 20 },
}

export const groups = {
  academic: 'Akademik dasturlar',
  research: 'Tadqiqot va nazariya',
  library: 'Kutubxona',
  hub: 'Virtual Hub',
  competitions: 'Musobaqalar',
  common: 'Umumiy maʼlumotlar',
  inbox: 'Murojaatlar (kiruvchi)',
  system: 'Tizim',
} as const
