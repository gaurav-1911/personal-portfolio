import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/

/**
 * Canonical site URL used for robots.txt + sitemap.xml generation.
 * Points to the official production GitHub Pages deployment.
 */
const SITE_URL_FALLBACK = 'https://gauravchavdavhits.github.io/personal-portfolio-'

/**
 * Generates robots.txt and sitemap.xml from the configured site URL at build time.
 */
function seoFilesPlugin(siteUrl) {
  const SITE_URL = (siteUrl || SITE_URL_FALLBACK).replace(/\/+$/, '')
  const SITE_PATHS = [
    { path: '/', changefreq: 'monthly', priority: '1.0' },
    { path: '/about', changefreq: 'monthly', priority: '0.8' },
    { path: '/skills', changefreq: 'monthly', priority: '0.8' },
    { path: '/experience', changefreq: 'monthly', priority: '0.8' },
    { path: '/projects', changefreq: 'weekly', priority: '0.9' },
    { path: '/projects/solar-management-system', changefreq: 'monthly', priority: '0.85' },
    { path: '/projects/bidirectional-chat-platform', changefreq: 'monthly', priority: '0.85' },
    { path: '/resume', changefreq: 'monthly', priority: '0.9' },
    { path: '/contact', changefreq: 'monthly', priority: '0.7' },
  ]

  const robots = `# robots.txt for Gaurav Chavda Portfolio
User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITE_PATHS.map(
  (u) => `  <url>
    <loc>${SITE_URL}${u.path === '/' ? '/' : u.path}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
).join('\n')}
</urlset>
`

  return {
    name: 'portfolio-seo-files',
    configResolved(config) {
      if (!siteUrl && config.command === 'build' && config.mode === 'production') {
        console.log(`\n[SEO Plugin] Using production site URL for robots.txt & sitemap.xml: ${SITE_URL}\n`)
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/robots.txt') {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end(robots)
          return
        }
        if (req.url === '/sitemap.xml') {
          res.setHeader('Content-Type', 'application/xml; charset=utf-8')
          res.end(sitemap)
          return
        }
        next()
      })
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || '').replace(/\/+$/, '')

  return {
    base: '/personal-portfolio-/',
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      seoFilesPlugin(siteUrl),
    ],
    server: {
      proxy: {
        // Dev-only: proxy API calls to the local backend so the frontend can
        // use a relative /api/v1 base URL (works identically in production).
        '/api/v1': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
  }
})