import getImageUrl from '../../utils/getImageUrl'

export default ({ image, fixed, aspectRatio, format }) => {
  // Size multipliers for the fixed image to accomodate low-density and
  // high-density (retina) screens
  const multipliers = [0.5, 1, 1.5, 2, 3]

  let srcset = ''
  let webpsrcset = ''
  let src = ''

  // If no fixed.height, get fixed.width and divider by the aspect ratio to
  // find the desired height
  const finalHeight = fixed.height || fixed.width / aspectRatio
  // Same idea for the width
  const finalWidth = fixed.width || fixed.height * aspectRatio

  for (const m of multipliers) {
    const currWidth = fixed.width && fixed.width * m
    const currHeight = fixed.height && fixed.height * m
    let params = {}

    // If we have a fixed width, set it to the url
    if (currWidth) {
      params.width = currWidth
    }
    // Same for height
    if (currHeight) {
      params.height = currHeight
    }
    // And if we have both, we want the equivalent of object-fit: cover;
    // object-position: center, which in Sanity land is the same as fit: crop
    if (currWidth && currHeight) {
      params = { ...params, fit: 'crop', crop: 'center' }
    }

    // We need to make sure the default src isn't webp for browser support
    const nonWebpSrc =
      format === 'webp'
        ? getImageUrl({ image, format: 'jpg', ...params })
        : getImageUrl({ image, ...params })

    // for the default image src, we want the 1x multiplier value
    if (m === 1) {
      src = nonWebpSrc
    }

    // example srcset: ...?w=100 1x, ...?w=200 2x
    srcset = `${srcset ? `${srcset},` : ''} ${nonWebpSrc} ${m}x`
    webpsrcset = `${webpsrcset ? `${webpsrcset},` : ''} ${getImageUrl({
      image,
      format: 'webp',
      ...params
    })} ${m}x`
  }

  return {
    src,
    webpsrcset,
    srcset,
    width: finalWidth,
    height: finalHeight,
    style: `height: ${finalHeight}px`
  }
}
