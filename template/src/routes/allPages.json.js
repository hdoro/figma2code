import { parse, evaluate } from 'groq-js'

import sanityData from '../.data/sanity.json'
import { allPagesQuery } from '../utils/queries.js'

export async function get(req, res) {
  const tree = parse(allPagesQuery)
  const values = await evaluate(tree, { dataset: sanityData })
  const results = await values.get()

  // Get every CMS page plus the home and 404
  let allPages = [
    { url: '/', label: 'Página inicial' },
    { url: '/previa', label: 'Página de prévia' },
    { url: '/404', label: 'Página não encontrada' },
    ...results.pages.map(p => ({
      url: p.meta.slug.current,
      label: p.meta.title
    })),
    ...results.categories.map(c => ({
      url: `/blog/${c.slug}`,
      label: c.title
    }))
  ]
  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify(allPages))
}
