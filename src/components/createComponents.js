const { addFile, camelToHyphen } = require('../utils')
const parseCompChildren = require('./parseCompChildren')
const getChildStyles = require('./getChildStyles')
const compTreeToFiles = require('./compTreeToFiles')
const { DEFAULT_COMP_INFO } = require('./compUtils')

async function createComponents(files, _metalsmith, done) {
  const { data } = files
  let components = {}

  const debugArray = []

  for (const key of Object.keys(data.components)) {
    const comp = data.components[key]
    // componentName will be used as the file path
    const { componentName } = comp._meta

    // Parsed information about the component that will be used to build the final `.sass` and `.svelte` files
    let compInfo = DEFAULT_COMP_INFO
    for (const child of comp.children) {
      compInfo = parseCompChildren({
        child,
        comp,
        compInfo,
        allComps: data.components
      })
    }
    // If the component itself has an htmlTag, we should wrap all of its children' markup inside that tag
    if (comp._meta.htmlTag) {
      const parentClass = camelToHyphen(comp._meta.camelCasedName)
      // Wrap children markup
      compInfo.markup = [
        {
          children: compInfo.markup,
          tag: comp._meta.htmlTag,
          className: parentClass
        }
      ]
      // And add the parentClass to the styles object
      compInfo.styles[parentClass] = getChildStyles(comp)
    }
    debugArray.push({
      compInfo,
      comp
    })
    // De-duplicating used components
    compInfo.usedComponents = Array.from(new Set(compInfo.usedComponents))
    components[componentName] = compInfo
  }

  // Here simply for testing
  files['generated-comp.json'] = addFile(components)
  files['debugging-comp.json'] = addFile(debugArray)

  // Get the final svelte and sass files in order to add them to the files object
  const toBeAdded = compTreeToFiles(components)
  for (const file of toBeAdded) {
    files[file.path] = file.content
  }

  done()
}

module.exports = createComponents
