// Regular page/post data
import { parse, evaluate } from 'groq-js'
import sanityData from '../.data/sanity.json'
import { homeQuery, configQuery } from '../utils/queries.js'

export async function get(req, res) {
  const lang = (req.query && req.query.lang) || 'default'
  const tree = parse(`
  {
    "content": *[_id == 'home-${lang}'] { ${homeQuery} }[0],
    "config": *[_id == "config-${lang}"] { ${configQuery} }[0]
  }
`)
  const values = await evaluate(tree, { dataset: sanityData })
  const results = await values.get()

  if (results && results.content && results.config) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    })

    res.end(JSON.stringify(results))
  } else {
    res.writeHead(404, {
      'Content-Type': 'application/json'
    })

    res.end(
      JSON.stringify({
        message: `Not found`
      })
    )
  }
}
