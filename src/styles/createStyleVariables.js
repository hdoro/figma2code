const { getColor } = require('./getColor')
const { getEffect } = require('./getEffect')
const { addFile } = require('../utils')

function getVarStr({ name, value }) {
  return `$${name}: ${value}`
}

function getClassStr({ name, props }) {
  return `.${name}
  ${Object.keys(props)
    .map(k => `${k}: ${props[k]}`)
    .join('\n  ')}`
}

function getTypeVarNth(arr, varName, value) {
  const index = arr.indexOf(value)
  return `nth($${varName},${index + 1})`
}

function getTypeClass(
  { name, style },
  { families, sizes, weights, lineHeights, letterSpacings }
) {
  return {
    name,
    props: Object.assign(
      {
        'font-family': getTypeVarNth(families, 'families', style.fontFamily),
        'font-weight': getTypeVarNth(weights, 'weights', style.fontWeight),
        'font-size': getTypeVarNth(sizes, 'sizes', style.fontSize),
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

// @TODO types should follow effects example: define helper classes and base variables
module.exports = function(files, metalsmith, done) {
  let colors = []
  let effects = []
  let typeStyles = {
    families: [],
    sizes: [],
    weights: [],
    lineHeights: [],
    letterSpacings: [],
    rawStyles: []
  }

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
      typeStyles.families.push(text.fontFamily)
      typeStyles.sizes.push(text.fontSize)
      typeStyles.weights.push(text.fontWeight)
      typeStyles.lineHeights.push(Math.floor(text.lineHeightPercentFontSize))
      typeStyles.letterSpacings.push(text.letterSpacing)
      if (text.italic) {
        typeStyles.hasItalic = true
      }
      typeStyles.rawStyles.push(style)
    }
  }

  for (const k of Object.keys(typeStyles)) {
    let value = typeStyles[k]
    if (Array.isArray(value) && k !== 'rawStyles') {
      typeStyles[k] = Array.from(new Set(value)).sort()
    }
  }

  const typeClasses = typeStyles.rawStyles.map(s => getTypeClass(s, typeStyles))
  delete typeStyles.rawStyles

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
${Object.keys(typeStyles)
  .map(k => {
    let value = typeStyles[k]
    if (Array.isArray(value)) {
      value = value.join(', ')
    }
    return `$${k}: ${value}`
  })
  .join('\n')}

// ===============
// Utility classes

// Typography
${typeClasses.map(getClassStr).join('\n\n')}

// Effects
${effects
  .filter(e => !!e.class)
  .map(e => getClassStr(e.class))
  .join('\n\n')}
  `

  const THEME_FILE_KEY = `src\\styles\\theme.sass`
  const themeFile = files[THEME_FILE_KEY].contents
    .toString()
    .replace('//VARIABLES_GENERATION//', tokens)
  files[THEME_FILE_KEY].contents = Buffer.from(themeFile)

  done()
}
