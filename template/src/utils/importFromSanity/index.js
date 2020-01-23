const fs = require('fs')
const split = require('split2')
const through = require('through2')
const jsonfile = require('jsonfile')
const sanityClient = require('@sanity/client')

const client = sanityClient({
  dataset: 'production',
  // Can't import projectId from src/utils/config.js as this file requires
  // CommonJS modules and config is set as ES6 imports
  projectId: '%SANITY_ID%',
  useCdn: true
})

const getDocumentStream = require('./getDocumentStream')
const pump = require('./pump')

const exportUrl = client.getUrl(`/data/export/production`)

const cachedFileLocation = './src/.data'
const cachedFilePath = `${cachedFileLocation}/sanity.json`

const exportSanity = async (cached = false) => {
  if (cached) {
    const cachedDocs = await jsonfile.readFileSync(cachedFilePath, err => {
      console.error(err)
    })
    return cachedDocs
  }

  let allDocs = []
  console.time('[sanity] exporting data: ')
  try {
    const inputStream = await getDocumentStream(exportUrl)
    await pump([
      inputStream,
      split(JSON.parse),
      through.obj((doc, _enc, cb) => {
        allDocs = [...allDocs, doc]
        cb()
      })
    ])
  } catch (error) {
    console.error(error)
  }
  console.timeEnd('[sanity] exporting data: ')
  fs.mkdir(cachedFileLocation, () => {
    jsonfile.writeFile(cachedFilePath, allDocs, { spaces: 2 }, err => {
      console.error(err)
    })
  })
  return allDocs
}

module.exports = exportSanity

exportSanity(false)
