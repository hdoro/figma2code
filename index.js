const metalsmith = require('metalsmith')
const { readFileSync } = require('fs')
require('dotenv').config()

const getData = require('./src/data/getData')
const processData = require('./src/data/processData')
const createComponents = require('./src/components/createComponents')
const createCmsSchema = require('./src/cms/createCmsSchema')
const createStyleVariables = require('./src/styles/createStyleVariables')
const processTemplate = require('./src/template/processTemplate')

const config = {
  token: process.env.FIGMA_TOKEN,
  fileKey: process.env.FIGMA_FILE_KEY,
  canvases: process.env.FIGMA_CANVASES,
  sanityID: process.env.SANITY_ID,
  siteName: process.env.SITE_NAME,
  siteUrl: process.env.SITE_URL,
  brandPrimary: process.env.BRAND_PRIMARY,
  // useCache: true,
  cacheData: true
}

function includeConfigs(files, _metalsmith, done) {
  const configFiles = ['./.stylelintrc', './.prettierrc', './.eslintrc.js']
  for (const path of configFiles) {
    files[path] = {
      contents: Buffer.from(readFileSync(path))
    }
  }
  done()
}

metalsmith(__dirname)
  .source('template')
  .destination('output')
  .metadata(config)
  .clean(true)
  .use(includeConfigs)
  .use(getData)
  .use(processData)
  .use(createStyleVariables)
  .use(createComponents)
  .use(createCmsSchema)
  .use(processTemplate)
  // Cleaning files that shouldn't go to output
  .use(function(files, _metalsmith, done) {
    delete files.data
    delete files['cached.json']
    // delete files['processed.json']
    done()
  })
  .build(function(err) {
    if (err) throw err
  })
