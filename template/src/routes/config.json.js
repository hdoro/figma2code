// Regular page/post data
import { parse, evaluate } from 'groq-js'
import sanityData from '../.data/sanity.json'
import { configQuery } from '../utils/queries.js'

export async function get(req, res) {
  const tree = parse(`
  {
    "config": *[_id == "config"] { ${configQuery} }
  }
`)
  const values = await evaluate(tree, { dataset: sanityData })
  const results = await values.get()

  if (results && results.home && results.config) {
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
