import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { pages } from './src/data.js'

const SITE = 'https://tinkeshwar.com'
const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

// Sets content="" on every <meta> whose name/property is in `keys`.
// Replacer fns everywhere: a string replacement would expand `$&`, `$'` etc. found in project text.
const setMeta = (html, keys, value) =>
  html.replace(
    new RegExp(`(<meta\\s+(?:name|property)="(?:${keys})"\\s+content=")[^"]*`, 'g'),
    (_, pre) => pre + value
  )

const sitemap = () => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>
${pages.map(p => `  <url><loc>${SITE}${p.path}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`).join('\n')}
</urlset>
`

// Build: dist/<path>.html per page (projects, /about, /contact) (own title/description/OG tags) + sitemap.xml.
function projectPages() {
  return {
    name: 'project-pages',
    enforce: 'post',
    // Dev: serve the sitemap too, so robots.txt's link isn't an SPA fallback.
    configureServer(server) {
      server.middlewares.use('/sitemap.xml', (_, res) => {
        res.setHeader('Content-Type', 'application/xml')
        res.end(sitemap())
      })
    },
    generateBundle(_, bundle) {
      const index = bundle['index.html'].source
      for (const p of pages) {
        const url = SITE + p.path
        const title = esc(`${p.name} — Tinkeshwar Singh`)
        const desc = esc(p.desc)
        const person = { '@type': 'Person', '@id': `${SITE}/#person`, name: 'Tinkeshwar Singh', url: `${SITE}/` }
        const ld = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': p.schema ?? 'CreativeWork',
          name: p.name,
          description: p.desc,
          url,
          ...(p.stack ? { keywords: p.stack.join(', '), author: person } : { mainEntity: person }),
        }).replace(/</g, '\\u003c')
        let html = index
          .replace(/<title>.*?<\/title>/s, () => `<title>${title}</title>`)
          .replace(/<link rel="canonical" href="[^"]*"/, () => `<link rel="canonical" href="${url}"`)
          .replace(/<noscript>.*?<\/noscript>/s, () => `<noscript><h1>${esc(p.name)}</h1><p>${desc}</p><p><a href="/">Tinkeshwar Singh</a></p></noscript>`)
          .replace(/(<script type="application\/ld\+json">).*?(<\/script>)/s, (_, a, b) => a + ld + b)
        html = setMeta(html, 'og:title|twitter:title', title)
        html = setMeta(html, 'description|og:description|twitter:description', desc)
        html = setMeta(html, 'og:url', url)
        html = setMeta(html, 'og:type', p.ogType ?? 'article')
        html = setMeta(html, 'og:image:alt', title)
        html = setMeta(html, 'keywords', esc(['Tinkeshwar Singh', p.name, ...(p.stack ?? [])].join(', ')))
        this.emitFile({ type: 'asset', fileName: `${p.path.slice(1)}.html`, source: html })
      }
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap() })
    },
  }
}

export default defineConfig({
  plugins: [react(), projectPages()],
})
