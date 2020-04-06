import { url } from '../../src/utils/config'

export default function getPreviewUrl(document) {
  if (
    // Only add previews for pages, posts and home, and if they're in a draft state
    ['page', 'home', 'post'].indexOf(document._type) > -1 &&
    document._id.includes('drafts')
  ) {
    return `${url}/previa?id=${document._id}`
  }
  return undefined
}
