// Regular page/post data
import { parse, evaluate } from 'groq-js'

import sanityData from '../../.data/sanity.json'
import { pageQuery, configQuery } from '../../utils/queries.js'
import { formatDate } from '../../utils/date.js'
import { getHtml } from '../../utils/portableText.js'

/*
	If we're in a page with a slug pointing to a subdirectory (such as /case-studies/project), slug is going to be an array with a single string items, with each subdirectory divided by commas (["case-studies,project"], in this case).
*/
export async function get({ params: { pageSlug: slug } }, res) {
  // Then we get a document with the page type and the current slug
  const tree = parse(`
  {
    "content": *[meta.slug.current == '${slug.join('/')}'] { ${pageQuery} }[0],
    "config": *[_id == "config"] { ${configQuery} }[0]
  }
`)
  const values = await evaluate(tree, { dataset: sanityData })
  const results = await values.get()

  // If we have results, return them, else 404!
  if (results && results.config && results.content) {
    results.content.createdAtFormatted = formatDate(results.content._createdAt)
    if (results.content._type === 'post') {
      results.content.body = getHtml(results.content.body)
    }
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
