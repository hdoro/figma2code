const getChildStyles = require('./getChildStyles')
const { DEFAULT_COMP_INFO, TAGLESS_EL_KEY } = require('./compUtils')
const { camelToHyphen } = require('../utils')

// Avoid overwriting styles by adding a "-dup" string at the end of its className if duplicate.
function getStyleKey(key, compInfo) {
  if (!!compInfo.styles[key]) {
    key += '-dup'
  }
  // For nested props (parentProp.sub), we want their class names to be '...parent-prop-sub' instead of '...parent-prop.sub'
  return key.replace('.', '-')
}

function parseCompChildren({
  child,
  comp,
  compInfo: originalCompInfo,
  allComps
}) {
  const parentClass = camelToHyphen(comp._meta.camelCasedName)
  const childClass =
    child._meta.propName ||
    child._meta.htmlTag ||
    child._meta.cmsType ||
    child._meta.camelCasedName
  const { isRequired, propName, htmlTag, cmsType } = child._meta
  let childMarkup = {}
  // Make a depp clone of compInfo to avoid having it contaminated by other parent components
  const compInfo = JSON.parse(JSON.stringify(originalCompInfo))

  // Working as intended ✅
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
        maxWidth: child.absoluteBoundingBox.width,
        image: {
          _type: 'prop',
          name: 'image'
        }
      }
    } else if (propName === 'body') {
      childMarkup.component = 'PortableText'
      childMarkup.props = {
        body: {
          _type: 'prop',
          name: 'body'
        }
      }
      compInfo.usedComponents.push('PortableText')
    } else if (propName === 'cta') {
      childMarkup.component = 'NavLink'
      compInfo.usedComponents.push('NavLink')
      childMarkup.props = {
        cta: {
          _type: 'spread',
          name: 'cta'
        }
      }
    }
  }

  // Seems to be working ✅🟡
  // If a component, import it and use it for the markup
  // Also, we don't want to recreate styles from another component, so we return right away
  if (child.type === 'INSTANCE') {
    // Find the corresponding componentName for the given componentId
    const expandedComp = allComps[child.componentId]

    if (!expandedComp || !expandedComp._meta.componentName) {
      // Deal with the lack of
      console.warn(`Couldn't find component for instance ${child.componentId}`)
      return compInfo
    }
    compInfo.usedComponents.push(expandedComp._meta.componentName)
    childMarkup.component = expandedComp._meta.componentName
    compInfo.markup.push(childMarkup)
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
  // If the tag is denoted by {} (empty htmlTag), that means we want to render only the prop or children, without any wrapper.
  // Add TAGLESS_EL_KEY as the tag for compTreeToFiles to properly deal with this case.
  else if (htmlTag === '') {
    childMarkup.tag = TAGLESS_EL_KEY
  }

  if (Array.isArray(child.children)) {
    const isArray = cmsType && cmsType.split('.')[0] === 'array'
    childMarkup.isArray = isArray

    const childrenInfo = child.children
      .map(c => {
        return parseCompChildren({
          child: c,
          comp,
          compInfo: DEFAULT_COMP_INFO,
          allComps
        })
      })
      .reduce((curr, acc) => {
        // Merging every child info into a single object
        return {
          usedComponents: acc.usedComponents.concat(curr.usedComponents),
          markup: acc.markup.concat(curr.markup),
          props: Object.assign(acc.props, curr.props),
          styles: Object.assign(acc.styles, curr.styles)
        }
      }, DEFAULT_COMP_INFO)
    // If array, we only want to replicate one child instance
    if (isArray) {
      const arrChild = childrenInfo.markup[0]
      childrenInfo.markup = [
        {
          ...arrChild,
          props: Object.assign(
            arrChild.props || {},
            // If the child is a component, spread the item object from the {#each} array as props
            !!arrChild.component && {
              item: {
                _type: 'spread',
                name: 'item'
              }
            }
          )
        }
      ]
    }
    // usedComponents and styles will be blended with `compInfo`
    compInfo.usedComponents = compInfo.usedComponents.concat(
      childrenInfo.usedComponents
    )
    for (const key of Object.keys(childrenInfo.styles)) {
      const className = getStyleKey(key, compInfo)
      compInfo.styles[className] = childrenInfo.styles[key]
    }
    // And markup will be added as the current child's children markup
    childMarkup.children = childrenInfo.markup
    // Only merge props if this isn't an array.
    // If it's, we'll ignore `props` as we're assuming props found in the array tree refer to variables defined in its own `{#each}` loop.
    if (!isArray) {
      compInfo.props = { ...compInfo.props, ...childrenInfo.props }
    }
  }

  // Push the current child's markup to the component's markup
  if (childMarkup.tag || childMarkup.component || childMarkup.children) {
    compInfo.markup.push(childMarkup)
  } else {
    console.warn(
      `\nComponent skipped from markup: ${JSON.stringify(child._meta)}`
    )
  }

  return compInfo
}

module.exports = parseCompChildren
