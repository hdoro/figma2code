const fs = require('fs')
const split = require('split2')
const through = require('through2')
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

const CACHE_FOLDER = './src/.data'
const CACHED_FILE_PATH = `${CACHE_FOLDER}/sanity.json`

const exportSanity = async (cached = false) => {
  if (cached) {
    // If the cache folder isn't there yet, create it
    if (!fs.existsSync(CACHE_FOLDER)) {
      fs.mkdirSync(CACHE_FOLDER)
    }
    const cachedDocs = fs.readFileSync(CACHED_FILE_PATH, err => {
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
  fs.mkdir(CACHE_FOLDER, () => {
    fs.writeFile(CACHED_FILE_PATH, JSON.stringify(allDocs, null, 2), err => {
      console.error(err)
    })
  })
  return allDocs
}

module.exports = exportSanity

exportSanity(false)
