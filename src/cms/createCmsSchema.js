// See "CMS Schema Notes.md"
const { getCmsType, createIndexFile } = require('./cmsUtils')
const { addFile } = require('../utils')


module.exports = function(files, { _metadata }, done) {
  const { data } = files

  let documents = []
  let objects = []

  // Parse all the fields
  // ====================
  for (const key of Object.keys(data.components)) {
    const component = data.components[key]
    const type = getCmsType(component.name)
    if (!type) {
      continue
    }
    // const fields = getCmsFields(component.children)
    if (type === 'document') {
      documents.push({ name: component.name })
    } else if (type === 'object') {
      objects.push({ name: component.name })
    }
  }

  // Add the docs and objs to `files`
  // ================================

  // Creating the index files
  // =======================

  // Start with the added docs and objs
  let documentsIndex = documents.map(d => d.name)
  let objectsIndex = objects.map(d => d.name)

  // The go through what's already in the template
  for (const path of Object.keys(files)) {
    const [fileName, fileExt] = path
      .split('\\')
      [path.split('\\').length - 1].split('.')
    if (path.includes('schemas\\documents') && fileExt === 'js') {
      documentsIndex.push(fileName)
    } else if (path.includes('schemas\\objects') && fileExt === 'js') {
      objectsIndex.push(fileName)
    }
  }

  console.log({ documentsIndex, objectsIndex })

  // And finally create the actual files
  files['cms\\schemas\\documents\\index.js'] = addFile(createIndexFile(documentsIndex))
  files['cms\\schemas\\objects\\index.js'] = addFile(createIndexFile(objectsIndex))

  done()
}
