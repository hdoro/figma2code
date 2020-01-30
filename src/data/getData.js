const axios = require('axios')
const fs = require('fs')

const CACHE_FOLDER = './.data'
const CACHE_PATH = `${CACHE_FOLDER}/cachedFigmaFile.json`
const BASE_URL = 'https://api.figma.com/v1/files'

async function getData(files, metalsmith, done) {
  const {
    token,
    fileKey,
    canvases,
    useCache,
    cacheData = true
  } = metalsmith._metadata

  let data

  if (useCache) {
    try {
      data = JSON.parse(fs.readFileSync(CACHE_PATH, { encoding: 'utf-8' }))
      files.data = data
      done()
      return
    } catch (error) {
      console.error(`Couldn't get cached file: ${error}`)
      console.info("Will try to fetch from Figma's API")
    }
  }

  const endpoint = `${BASE_URL}/${fileKey}`

  console.time('Fetching from Figma')
  const { data: freshData } = await axios.get(endpoint, {
    headers: { 'X-Figma-Token': token }
  })
  data = freshData
  console.timeEnd('Fetching from Figma')

  /*
    Remove unused pages/canvases from the data.
    Besides making it smaller & faster, this prevents the inclusion of components that aren't used in the final output 😉
  */
  const canvasArray = canvases.split(',')
  data.document.children = data.document.children.filter(canvas => {
    return canvasArray ? canvasArray.indexOf(canvas.name) >= 0 : true
  })

  // Cache response if desired
  if (cacheData) {
    console.time('Caching data')
    // If the cache folder isn't there yet, create it
    if (!fs.existsSync(CACHE_FOLDER)) {
      fs.mkdirSync(CACHE_FOLDER)
    }
    fs.writeFileSync(CACHE_PATH, JSON.stringify(data, null, 2), {
      spaces: 2,
      encoding: 'utf-8'
    })
    console.timeEnd('Caching data')
  }

  files.data = data

  done()
}

module.exports = getData
