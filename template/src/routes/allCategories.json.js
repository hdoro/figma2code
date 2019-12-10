import { parse, evaluate } from 'groq-js'

import sanityData from '../.data/sanity.json'

export async function get(req, res) {
  const tree = parse(`
    {
      "categories": *[_type == 'category'] { "slug": slug.current }
    }
  `)
  const values = await evaluate(tree, { dataset: sanityData })
  const results = await values.get()

  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify(results))
}
