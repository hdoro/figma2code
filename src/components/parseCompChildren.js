const getChildStyles = require('./getChildStyles')
const { DEFAULT_COMP_INFO } = require('./compUtils')
const { camelToHyphen } = require('../utils')

// Avoid overwriting styles by adding a "-dup" string at the end of its className if duplicate.
function getStyleKey(key, compInfo) {
  if (!!compInfo.styles[key]) {
    key += '-dup'
  }
  return key
}

function parseCompChildren({ child, comp, compInfo }) {
  const parentClass = camelToHyphen(comp._meta.camelCasedName)
  const childClass =
    child._meta.propName ||
    child._meta.htmlTag ||
    child._meta.cmsType ||
    child._meta.camelCasedName
  const { isRequired, propName, htmlTag, cmsType } = child._meta
  let childMarkup = {}

  // If we have a prop, add it to the current component
  if (propName) {
    compInfo.props[propName] = {
      required: isRequired || false
    }
    childMarkup.propName = propName
    // Then check if the prop is of any known type
    if (propName === 'image') {
      childMarkup.component = 'LazyImage'
      compInfo.usedComponents.push('LazyImage')
      // Set the current img's width as the max width
      childMarkup.props = {
        maxWidth: child.absoluteBoundingBox.width
      }
    } else if (propName === 'body') {
      childMarkup.component = 'Markdown'
      compInfo.usedComponents.push('Markdown')
    } else if (propName === 'cta') {
      childMarkup.component = 'NavLink'
      compInfo.usedComponents.push('NavLink')
    }
  }

  // If a component, import it and use it for the markup
  // Also, we don't want to recreate styles from another component, so we return right away
  if (child.type === 'INSTANCE') {
    compInfo.usedComponents.push(child.componentId)
    childMarkup.component = child.componentId
    return compInfo
  }

  // We'll only add a class if we have an htmlTag
  if (htmlTag && childClass) {
    const className = getStyleKey(`${parentClass}__${childClass}`, compInfo)
    compInfo.styles[className] = getChildStyles(child)
    childMarkup.className = className
  }

  // Define the htmlTag
  if (htmlTag) {
    childMarkup.tag = htmlTag
  }

  if (Array.isArray(child.children)) {
    const isArray = cmsType && cmsType.split('.')[0] === 'array'
    childMarkup.isArray = isArray

    // const childrenInfo = parseCompChildren({
    //   child,
    //   comp,
    //   compInfo: DEFAULT_COMP_INFO
    // })
    // // usedComponents and styles will be blended with `compInfo`
    // compInfo.usedComponents.concat(childrenInfo.usedComponents)
    // for (const key of childrenInfo.styles) {
    //   const className = getStyleKey(key, compInfo)
    //   compInfo.styles[className] = childrenInfo.styles[key]
    // }
    // // And markup will be added as the current child's children markup
    // childMarkup.children = childrenInfo.markup
    // // Only merge props if this isn't an array.
    // // If it's, we'll ignore `props` as we're assuming props found in the array tree refer to variables defined in its own `{#each}` loop.
    // if (!isArray) {
    //   compInfo.props = { ...compInfo.props, ...childrenInfo.props }
    // }
  }

  // Push the current child's markup to the component's markup
  if (childMarkup.htmlTag || childMarkup.component || childMarkup.array) {
    compInfo.markup.push(childMarkup)
  }

  return compInfo
}

module.exports = parseCompChildren
