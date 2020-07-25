import client from 'part:@sanity/base/client'

const SLUGFUL_TYPES = `["page","caseStudy","post"]`

export default function(slug, options) {
  const { document } = options

  const id = document._id.replace(/^drafts\./, '')
  const params = {
    draft: `drafts.${id}`,
    published: id,
    slug
  }

  const query = `!defined(*[!(_id in [$draft, $published]) && _type in ${SLUGFUL_TYPES} && meta.slug.current == $slug][0]._id)`

  return client.fetch(query, params)
}
