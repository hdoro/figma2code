// See "CMS Schema Notes.md"
const { createIndexFile, createSchemaFile } = require('./formatSchemaFiles')
const parseSchemaFields = require('./parseSchemaFields')
const { addFile } = require('../utils')

module.exports = function(files, _metalsmith, done) {
  const { data } = files

  let documents = []
  let objects = []

  // **Parse all the props for components/children**
  // ====================
  for (const key of Object.keys(data.components)) {
    const component = data.components[key]
    const { cmsType } = component._meta
    // Ignore typeless entries
    if (!cmsType) {
      continue
    }
    // We need to:
    // 1: get the fields for this component
    // 2: if any of the children is of an object type, we need to add it to the `objects` array with the corresponding fields
    const props = parseSchemaFields(component)
    if (cmsType === 'document') {
      documents.push(props)
    } else if (cmsType === 'object') {
      objects.push(props)
    }
  }

  // **Add the docs and objs to `files`**
  // ================================
  for (const obj of objects) {
    files[`cms\\schemas\\objects\\${obj.name}.js`] = addFile(
      createSchemaFile(obj),
      'babel'
    )
  }

  for (const doc of documents) {
    files[`cms\\schemas\\documents\\${doc.name}.js`] = addFile(
      createSchemaFile(doc),
      'babel'
    )
  }

  // **Creating the index files**
  // ========================
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

  // And finally create the actual files
  files['cms\\schemas\\documents\\index.js'] = addFile(
    createIndexFile(documentsIndex),
    'babel'
  )
  files['cms\\schemas\\objects\\index.js'] = addFile(
    createIndexFile(objectsIndex),
    'babel'
  )

  done()
}
