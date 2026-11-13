/** Sub-path the site is served under, e.g. "/al-farobiy" on GitHub Pages. Empty for a normal deployment. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

/**
 * Read-only snapshot build (GitHub Pages): no server, so forms and the admin panel are disabled.
 * Set NEXT_PUBLIC_STATIC_DEMO=1 at build time — see scripts/export-static.mjs.
 */
export const STATIC_DEMO = process.env.NEXT_PUBLIC_STATIC_DEMO === '1'

/** Prefix for plain <form action> / <a href> targets that Next.js does not prefix itself. */
export const withBase = (path: string) => `${BASE_PATH}${path}`
