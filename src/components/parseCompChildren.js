const getChildStyles = require('./getChildStyles')

function parseCompChildren({ child, comp, compInfo }) {
  const { cssClassName: parentClass } = comp._meta
  const {
    cssClassName: childClass,
    isRequired,
    propName,
    htmlTag,
    cmsType
  } = child._meta
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

  // We'll only add a class if we have an htmlTag
  if (htmlTag && childClass) {
    const className = `${parentClass}__${childClass}`
    // @TODO: parse styles
    compInfo.styles[className] = getChildStyles(child)
    childMarkup.className = className
  }

  // Define the htmlTag
  if (htmlTag) {
    childMarkup.tag = htmlTag
  }

  // Deal with arrays
  if (cmsType && cmsType.split('.')[0] === 'array') {
    // childMarkup.array =
  }

  // If a component, import it and use it for the markup
  if (child.type === 'INSTANCE') {
    compInfo.usedComponents.push(child.componentId)
    delete childMarkup.tag
    childMarkup.component = child.componentId
  }

  // Push the current child's markup to the component's markup
  if (childMarkup.htmlTag || childMarkup.component || childMarkup.array) {
    compInfo.markup.push(childMarkup)
  }

  return compInfo
}

module.exports = parseCompChildren
