import { CAT_MIN_SIZE } from './config'

const showCategory = `"showCategory": count(*[meta.category._ref == ^.meta.category._ref && meta.live]) >= ${CAT_MIN_SIZE}`

const category = `
category-> {
  "slug": slug.current,
  "title": meta.title
}`

export const pageQuery = `
...,
${showCategory},
meta {
  ...,
  ${category}
},
body[] {
  ...,
  "icon": icon->svg,
  items[] {
    ...,
    "icon": icon->svg
  },
}
`

export const homeQuery = pageQuery

export const configQuery = `
...
`

export const postListQuery = `
  _createdAt,
  meta {
    title,
    slug,
    ${category}
  },
  ${showCategory},
  "excerpt": body[0..1][_type == "block"]
`

export const allPagesQuery = `
  {
    "pages": *[(_type == 'page' || _type == 'post') && meta.live == true] {
      meta { title, slug }
    },
    "categories": *[_type == 'category' && count(*[_type == 'post' && ^._id == meta.category._ref]) > ${CAT_MIN_SIZE}] {
      "slug": slug.current,
      "title": meta.title
    }
  }
`
