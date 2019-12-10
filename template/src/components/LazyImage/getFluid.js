import getImageUrl from '../../utils/getImageUrl'

const MINIMUM_WIDTH = 100
const WIDTH_STEPS = 200
const MAX_MULTIPLIER = 3

export default ({ image, fluid, sizes, format }) => {
  // We can either set a custom `sizes` property or consider the maximum size
  // of containers, which is 1200px for this project. We're not going to have
  // fullscreen images, so the maximum size they'll have is that of the
  // container, unless specified otherwise
  const maxWidth = fluid.maxWidth || 1200
  const finalSizes = sizes || `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`

  let srcset = ''
  let webpsrcset = ''

  // total number of variations is based on the number of steps
  // we need to go from minimum width to maxWidth * 3 (retina)
  // Minimum number of variations is 3, hence Math.max
  const totalVariations = Math.max(
    Math.ceil((maxWidth * MAX_MULTIPLIER - MINIMUM_WIDTH) / WIDTH_STEPS),
    3
  )

  let params = {
    image,
    fit: 'max'
  }
  // Get the middle variation and use it as the default width
  const defaultWidth =
    MINIMUM_WIDTH + Math.floor(totalVariations / 2) * WIDTH_STEPS
  // Which is going to be used as the default src
  const src =
    format === 'webp'
      ? getImageUrl({ ...params, width: defaultWidth, format: 'jpg' })
      : getImageUrl({ ...params, width: defaultWidth })

  for (let i = 0; i < totalVariations; i++) {
    const currWidth = MINIMUM_WIDTH + WIDTH_STEPS * i
    params = { ...params, width: currWidth }

    srcset = `${srcset ? `${srcset},` : ''} ${
      format === 'webp'
        ? getImageUrl({ ...params, format: 'jpg' })
        : getImageUrl(params)
    } ${currWidth}w`
    webpsrcset = `${webpsrcset ? `${webpsrcset},` : ''} ${getImageUrl({
      ...params,
      format: 'webp'
    })} ${currWidth}w`
  }

  return {
    finalSizes,
    src,
    webpsrcset,
    srcset
  }
}
