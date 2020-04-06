import { sanityId } from './config'

// See https://www.sanity.io/docs/reference/image-urls
const possibleParams = {
  width: 'w',
  height: 'h',
  minHeight: 'min-h',
  minWidth: 'min-w',
  maxHeight: 'max-h',
  maxWidth: 'max-w',
  fit: 'fit',
  crop: 'crop',
  format: 'fm',
  quality: 'q'
}

// Sanity's image API doesn't allow fractions for these values
// It needs integers, and so we round them below
const paramsToBeRounded = [
  'width',
  'height',
  'minHeight',
  'minWidth',
  'maxHeight',
  'maxWidth'
]

const getQueryStrings = (params = {}) => {
  let queryParams = []

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      let value = params[key]
      if (paramsToBeRounded.indexOf(key) >= 0 && typeof value === 'number') {
        value = Math.round(value)
      }
      queryParams.push(`${possibleParams[key]}=${value}`)
    }
  }

  return (queryParams.length && `?${queryParams.join('&')}`) || ''
}

// The _ref structure is as follows: image-{assetId}-{width}x{height}-{format}
// asset._ref example:
// image-4f6af302e9dde5f3b590b22f75bbbc3805e8b786-986x342-png

// Desired URL example:
// https://cdn.sanity.io/images/SANITY_ID/production/4f6af302e9dde5f3b590b22f75bbbc3805e8b786-986x342.png?w=1200

const getImageUrl = ({ image = {}, ...params }) => {
  // Split the ref by - to find each param
  const [_image, assetId, dimensions, format] =
    image.asset && image.asset._ref ? image.asset._ref.split('-') : []
  const imagePath = `${assetId}-${dimensions}.${format}`

  return `https://cdn.sanity.io/images/${sanityId}/production/${imagePath}${getQueryStrings(
    params
  )}`
}

export default getImageUrl
