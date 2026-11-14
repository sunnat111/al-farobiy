/** Next.js settings for the website (the React frontend). */

const nextConfig = {
  // Serve the site under a sub-path, e.g. "/al-farobiy" on GitHub Pages (empty for a normal deployment)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  // separate output folder for the static snapshot so it never overwrites the normal build
  distDir: process.env.NEXT_DIST_DIR || '.next',
  async redirects() {
    return [{ source: '/', destination: '/uz', permanent: false }]
  },
}

export default nextConfig
