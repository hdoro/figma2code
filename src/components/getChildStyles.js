module.exports = function({
  styles,
  type,
  constraints,
  absoluteBoundingBox: bBox,
  style: textStyle
}) {
  let parsed = {}

  /*
    Styles come from figma as references to ids (such as `fill: '36:93'`), but in `processData` we expand them to the actual style name.
  */
  for (const styleType of Object.keys(styles || {})) {
    // We don't use Figma's grid styles in CSS, so ignore them
    if (styleType === 'grid') {
      continue
    } else if (styleType === 'fill') {
      // Color mixins have an optional parameter for the property you want to apply the color for
      // Fill styles can be applied as CSS color (for text) or background (for everything else)
      // So we need to
      const property = type === 'TEXT' ? 'color' : 'background'
      parsed.extended = {
        ...(parsed.extended || {}),
        [property]: `${styles[styleType]}(${property})`
      }
    } else {
      // Text, effect and stroke styles have no complications
      parsed.extended = {
        ...(parsed.extended || {}),
        [styleType]: styles[styleType]
      }
    }
  }

  // For center-aligned or right-aligned items, treat them as blocks and set their max-width
  if (constraints.horizontal === 'CENTER') {
    parsed['margin-left'] = 'auto'
    parsed['margin-right'] = 'auto'
    parsed.display = 'block'
    parsed[`max-width`] = `getRem(${bBox.width}px)`
  } else if (constraints.horizontal === 'RIGHT') {
    parsed['margin-left'] = 'auto'
    parsed.display = 'block'
    parsed[`max-width`] = `getRem(${bBox.width}px)`
  }

  if (type === 'TEXT' && textStyle) {
    if (textStyle.textAlignHorizontal === 'CENTER') {
      parsed['text-align'] = 'center'
    } else if (textStyle.textAlignHorizontal === 'RIGHT') {
      parsed['text-align'] = 'right'
    }
  }

  return parsed
}
