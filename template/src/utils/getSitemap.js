export default links => `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
>
  ${links
    .map(
      l => `
      <url>
        <loc>${l.loc}</loc>
        ${l.lastMod ? `<lastmod>${l.lastMod}</lastmod>` : ''}
        ${l.priority ? `<priority>${l.priority}</priority>` : ''}
      </url>
    `
    )
    .join('')}
</urlset>
`
