const { mergeStyles } = require('./extractProperties')
const { parseNodeName } = require('../utils')

function getChildrenMeta(child) {
  if (child.children) {
    child.children = child.children.map(getChildrenMeta)
  }
  if (child.name) {
    child._meta = parseNodeName(child.name)
  }
  return child
}

function processNode(node) {
  const { children, styles, componentId, type } = node
  let used = {
    components: {},
    styles: {}
  }

  // If instance of a component, than we know for sure
  // the component is being used
  if (componentId) {
    // console.log(used.components[componentId])
    // add a used: true flag to the component object
    used.components[componentId] = Object.assign(
      used.components[componentId] || {},
      { used: true }
    )
  }

  // We only care about properties from the master component,
  // instances only tell if it's being used or not
  if (type === 'COMPONENT') {
    // Ignored properties from the component
    const {
      background,
      backgroundColor,
      locked,
      exportSettings,
      transitionNodeID,
      transitionDuration,
      transitionEasing,
      clipsContent,
      layoutGrids,
      isMask,
      isMaskOutline,
      // Avoid overwriting the master component's name
      name,
      ...usefulProperties
    } = node
    // Save the usefulProperties to our object of components
    used.components[node.id] = Object.assign(used.components[node.id] || {}, {
      children: children.map(getChildrenMeta),
      type,
      ...usefulProperties,
      _meta: parseNodeName(name)
    })
  }

  // Process children nodes
  if (Array.isArray(children) && children.length) {
    // Merge the parent's used styles & components with the children's
    children.forEach(child => {
      const usedByChild = processNode(child)
      for (const id in usedByChild.components) {
        used.components[id] = Object.assign(
          used.components[id] || {},
          usedByChild.components[id]
        )
      }
      for (const id in usedByChild.styles) {
        used.styles[id] = Object.assign(
          used.styles[id] || {},
          usedByChild.styles[id]
        )
      }
    })
  }

  // If we have a styles object, add every id found in it to usedStyles
  if (styles) {
    used.styles = mergeStyles(node, used.styles)
  }

  return used
}

function process(data) {
  let used = {
    components: {},
    styles: {}
  }

  // Make style names CSS friendly
  for (const key in data.styles) {
    const spacelessName = data.styles[key].name
      .toLowerCase()
      .replace(/[\/\s]/g, '-')
      // Remove duplicate hyphens (24px---bold -> 24px-bold)
      .replace(/-{2,}/g, '-')
      .trim()
    // If the first character of a variable/class is a number, CSS will break
    // Hence we prefix the name with '_s'
    data.styles[key].name = isNaN(spacelessName[0])
      ? spacelessName
      : 's_' + spacelessName
  }

  // Merge the parent's used styles & components with the children's
  data.document.children.forEach(child => {
    const usedByChild = processNode(child)
    for (const id in usedByChild.components) {
      used.components[id] = Object.assign(
        used.components[id] || {},
        usedByChild.components[id]
      )
    }
    for (const id in usedByChild.styles) {
      used.styles[id] = Object.assign(
        used.styles[id] || {},
        usedByChild.styles[id]
      )
    }
  })

  for (const id in data.components) {
    const { name } = data.components[id]
    if (!used.components.hasOwnProperty(id)) {
      delete data.components[id]
    } else if (!used.components[id].used) {
      console.warn(`Component ${name} (${id}) is not being used`)
      delete data.components[id]
    } else if (!used.components[id].children) {
      console.warn(`Couldn't find master instance of component ${name} (${id})`)
      delete data.components[id]
    } else {
      // If the component is used and has children, add enrich it with the found props
      data.components[id] = {
        ...data.components[id],
        ...used.components[id],
        // Also add some meta information to be used during component and CMS creation
        _meta: parseNodeName(name)
      }
    }
  }

  for (const id in data.styles) {
    const dataStyle = data.styles[id]
    const usedStyle = used.styles[id]
    if (!usedStyle || dataStyle.styleType === 'GRID') {
      delete data.styles[id]
    } else if (
      dataStyle.styleType === 'FILL' &&
      (!usedStyle.fills || !usedStyle.fills.length)
    ) {
      console.warn(`Fill style ${dataStyle.name} (${id}) has no fills!`)
      delete data.styles[id]
    } else {
      data.styles[id] = {
        ...dataStyle,
        ...usedStyle
      }
    }
  }

  return data
}

module.exports = async function processData(files, _metalsmith, done) {
  const processed = process(files.data)

  files.data = processed
  files['processed.json'] = {
    contents: Buffer.from(JSON.stringify(processed, null, 2))
  }

  done()
}
