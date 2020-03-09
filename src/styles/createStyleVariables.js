const { getColor } = require('./getColor')
const { getEffect } = require('./getEffect')

function getVarStr({ name, value }) {
  return `$${name}: ${value}`
}

function getMixinStr({ name, props }) {
  return `@mixin ${name}
  ${Object.keys(props)
    .map(k => `${k}: ${props[k]}`)
    .join('\n  ')}`
}

function getColorMixins({ name }) {
  return `@mixin ${name}($property: background)
  #{$property}: $${name}\n`
}

function getTypeVarNth(arr, varName, value) {
  const index = arr.indexOf(value)
  return `nth($${varName},${index + 1})`
}

function getTypeMixin(
  { name, style },
  { families, sizes, weights, lineHeights, letterSpacings }
) {
  return {
    name,
    props: Object.assign(
      {
        'font-family': getTypeVarNth(families, 'families', style.fontFamily),
        'font-weight': getTypeVarNth(weights, 'weights', style.fontWeight),
        'font-size': `getRem(#{${getTypeVarNth(
          sizes,
          'sizes',
          style.fontSize
        )}}px)`,
        'line-height': getTypeVarNth(
          lineHeights,
          'lineHeights',
          Math.floor(style.lineHeightPercentFontSize)
        )
      },
      style.letterSpacing && {
        'letter-spacing': getTypeVarNth(
          letterSpacings,
          'letterSpacings',
          style.letterSpacing
        )
      }
    )
  }
}

module.exports = function(files, _metalsmith, done) {
  let colors = []
  let effects = []
  let typeVariables = {
    families: [],
    sizes: [],
    weights: [],
    lineHeights: [],
    letterSpacings: []
  }
  let typeStyles = []

  for (const id in files.data.styles) {
    const style = files.data.styles[id]
    if (!style) {
      continue
    }
    const { name, styleType } = style
    if (styleType === 'FILL') {
      colors.push({
        name,
        value: getColor(style)
      })
    } else if (styleType === 'EFFECT') {
      effects.push(getEffect(style))
    } else if (styleType === 'TEXT') {
      const { style: text } = style
      typeVariables.families.push(text.fontFamily)
      typeVariables.sizes.push(text.fontSize)
      typeVariables.weights.push(text.fontWeight)
      typeVariables.lineHeights.push(Math.floor(text.lineHeightPercentFontSize))
      typeVariables.letterSpacings.push(text.letterSpacing)
      // The other properties will create defined variables, while typeStyles will be used for mixin generation (see below)
      typeStyles.push(style)
    }
  }

  for (const k of Object.keys(typeVariables)) {
    let value = typeVariables[k]
    // Remove duplicates and sort variables
    typeVariables[k] = Array.from(new Set(value)).sort()
  }

  const typeMixins = typeStyles.map(s => getTypeMixin(s, typeVariables))

  // Ordering variables
  colors.sort((a, b) => (a.name <= b.name ? -1 : 1))
  effects.sort((a, b) =>
    a.variable && b.variable && a.variable.name <= b.variable.name ? -1 : 1
  )

  const tokens = `// Colors
${colors.map(getVarStr).join('\n')}

// Shadows
${effects
  .filter(e => !!e.variable)
  .map(e => getVarStr(e.variable))
  .join('\n')}

// Typography
${Object.keys(typeVariables)
  .map(k => {
    let value = typeVariables[k]
    if (Array.isArray(value)) {
      value = value.join(', ')
    }
    return `$${k}: ${value}`
  })
  .join('\n')}

// ===============
// Utility mixins

// Colors
${colors.map(getColorMixins).join('\n')}

// Typography
${typeMixins.map(getMixinStr).join('\n\n')}

// Effects
${effects
  .filter(e => !!e.mixin)
  .map(e => getMixinStr(e.mixin))
  .join('\n\n')}
  `

  const THEME_FILE_KEY = `src\\styles\\theme.sass`
  const themeFile = files[THEME_FILE_KEY].contents
    .toString()
    .replace('//VARIABLES_GENERATION//', tokens)
  files[THEME_FILE_KEY].contents = Buffer.from(themeFile)

  done()
}
