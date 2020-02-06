const { addFile } = require('../utils')
const parseCompChildren = require('./parseCompChildren')
const compTreeToFiles = require('./compTreeToFiles')

async function createComponents(files, _metalsmith, done) {
  const { data } = files
  let components = {}

  for (const key of Object.keys(data.components)) {
    const comp = data.components[key]
    // componentName will be used as the file path
    const { componentName } = comp._meta

    // Parsed information about the component that will be used to build the final `.sass` and `.svelte` files
    let compInfo = {
      usedComponents: [],
      props: {},
      markup: [],
      styles: {}
    }
    for (const child of comp.children) {
      compInfo = parseCompChildren({ child, comp, compInfo })
    }
    components[componentName] = compInfo
  }

  // Here simply for testing
  files['generated-comp.json'] = addFile(components)

  // Get the final svelte and sass files in order to add them to the files object
  const toBeAdded = compTreeToFiles(components)
  for (const file of toBeAdded) {
    files[file.path] = file.content
  }

  done()
}

module.exports = createComponents
