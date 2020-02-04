// See https://www.figma.com/developers/api#effect-type
const { getRgba } = require('./getColor')

function getShadow(effect) {
  const { type, color, offset, radius } = effect

  return (
    `${type === 'INNER_SHADOW' ? 'inset ' : ''}${offset.x || 0}px ${offset.y ||
      0}px ${radius}px ${getRgba(color)}`
      // Minify the shadow by replacing 0px with 0
      .replace(/0px/g, '0')
  )
}

// Return variables for shadows
// Return a mixin if we have blur effects
function getEffect(style) {
  const effects = style.effect
    // Ignore invisible effects
    .filter(({ visible = true }) => visible)

  let shadows = []
  let shadowVarName = style.name
  let mixinProps = {}

  for (const effect of effects) {
    const { type } = effect
    if (type === 'DROP_SHADOW' || type === 'INNER_SHADOW') {
      shadows.push(getShadow(effect))
      // If we have a shadow, we can add it to the mixin
      mixinProps['box-shadow'] = '$' + shadowVarName
    } else if (type === 'LAYER_BLUR') {
      // Figma only allows one LAYER_BLUR per effect
      mixinProps.filter = `blur(${effect.radius}px)`
    } else if (type === 'BACKGROUND_BLUR') {
      // Figma only allows one BACKGROUND_BLUR per effect
      mixinProps['backdrop-filter'] = `blur(${effect.radius}px)`
    }
  }

  return Object.assign(
    {},
    shadows.length
      ? {
          variable: {
            name: shadowVarName,
            value: shadows.join(', ')
          }
        }
      : {},
    {
      mixin: {
        name: style.name,
        props: mixinProps
      }
    }
  )
}

exports.getEffect = getEffect
