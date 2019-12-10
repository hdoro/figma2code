import { parse, evaluate } from 'groq-js'
import { configQuery, postListQuery } from '../../utils/queries.js'
import { PAGINATION_SIZE } from '../../utils/config.js'

import sanityData from '../../.data/sanity.json'
import { formatDate } from '../../utils/date.js'

/*
  We'll only hit this endpoint for routes:
  ✅ /blog/1 (/blog/pageNum)
  ✅ /blog/catName (/blog/catName)
  ✅ /blog/catName/1 (/blog/catName/pageNum)
  ❌ /blog/catName/anotherPath
  ❌ /blog/catName/1/anotherPath
*/
export async function get({ params: { blogSlug: slug } }, res) {
  console.time('Fetching blog data:')
  const isCategory = isNaN(slug[0])

  // If category, the pageNum won't be in the slug if it's the first page (/blog/catName instead of /blog/catName/1)
  const pageNum = isCategory ? +slug[1] || 1 : +slug[0]
  const pgStart = (pageNum - 1) * PAGINATION_SIZE
  const pgEnd = pageNum * PAGINATION_SIZE - 1

  const baseFilter = `_type == 'post' && meta.live == true && defined(meta.category)`
  const catFilter = isCategory
    ? `&& meta.category->slug.current == "${slug[0]}"`
    : ''
  const order = 'order(_createdAt desc, _updatedAt desc)'
  const pageInfo = isCategory
    ? `*[_type == "category" && slug.current == "${slug[0]}"]{
      "meta": {
        ...meta,
        "slug": slug.current
      }
    }[0]`
    : `*[_id == "config"]{ "meta": blog }[0]`
  const tree = parse(`
    {
      "posts": *[${baseFilter} ${catFilter}] | ${order} [${pgStart}..${pgEnd}] {
        ${postListQuery}
      },
      "config": *[_id == "config"] { ${configQuery} }[0],
      "pageInfo": ${pageInfo},
      "pageCount": round(count(*[${baseFilter} ${catFilter}]) / ${PAGINATION_SIZE})
    }
  `)
  const values = await evaluate(tree, { dataset: sanityData })
  const results = await values.get()
  results.pageNum = pageNum
  results.isCategory = isCategory
  results.posts = results.posts.map(p => ({
    ...p,
    createdAtFormatted: formatDate(p._createdAt)
  }))
  console.timeEnd('Fetching blog data:')

  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify(results))
}
