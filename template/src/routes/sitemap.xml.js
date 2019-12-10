import { parse, evaluate } from 'groq-js'

import sanityData from '../.data/sanity.json'
import getSitemap from '../utils/getSitemap'
import { url as baseUrl } from '../utils/config'

export async function get(req, res) {
  const tree = parse(`
    {
      "pages": *[_type == 'page'],
      "home": *[_id == 'home']
    }
  `)
  const results = await evaluate(tree, { documents: sanityData }).get()

  let allPages = [
    {
      loc: baseUrl,
      lastMod: results.home[0]._updatedAt,
      priority: 1
    },
    ...results.pages.map(p => ({
      loc: `${baseUrl}/${p.meta.slug.current}`,
      lastMod: p._updatedAt
    }))
  ]
  const sitemap = getSitemap(allPages)
  res.writeHead(200, {
    'Content-Type': 'application/rss+xml'
  })
  res.end(sitemap)
}
