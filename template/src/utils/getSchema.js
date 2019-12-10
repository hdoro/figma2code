import getImageUrl from './getImageUrl'
import { url as defaultUrl, siteName } from './config'

export default ({
  type = 'WebPage',
  name = siteName,
  url = defaultUrl,
  logo = `${defaultUrl}/logo.png`,
  socialMedia = {},
  image,
  lang = 'pt',
  breadcrumbLinks,
  ...rest
}) => {
  let schema = {
    '@context': 'https://schema.org',
    '@type': type,
    url,
    ...rest
  }

  if (image) {
    schema = {
      ...schema,
      image: getImageUrl({ image, maxWidth: 1200, fit: 'max' })
    }
  }

  if (['WebPage', 'Organization'].indexOf(type) >= 0) {
    schema = { ...schema, name }
  }

  if (breadcrumbLinks && breadcrumbLinks.length) {
    const parentItems = breadcrumbLinks.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@id': `${defaultUrl}/${b.url}`,
        name: b.label
      }
    }))
    const breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        ...parentItems,
        // The current item in the breadcrumb is the current page which exposes
        // the url param
        {
          '@type': 'ListItem',
          position: breadcrumbLinks.length + 1,
          item: {
            '@id': url,
            name: rest.title || 'Current'
          }
        }
      ]
    }
    schema = {
      ...schema,
      breadcrumb
    }
  }

  if (type === 'Organization') {
    schema = {
      ...schema,
      name,
      logo,
      // Show all the social profiles as alias
      sameAs: Object.keys(socialMedia)
        .filter(k => k !== '_type')
        .map(k => socialMedia[k])
    }
  }

  return `
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
  `
}
