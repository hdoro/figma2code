const metalsmith = require("metalsmith");
require("dotenv").config();

const getAndProcessData = require("./src/getAndProcessData");
const createComponents = require("./src/components/createComponents");
const createStyleVariables = require("./src/styles/createStyleVariables");

const config = {
  token: process.env.FIGMA_TOKEN,
  fileKey: process.env.FIGMA_FILE_KEY,
  canvases: 'Components,Desktop',
  useCache: true,
  cacheData: true,
};

metalsmith(__dirname)
  .source("template")
  .destination("output")
  .metadata(config)
  .clean(true)
  .use(getAndProcessData)
  .use(createStyleVariables)
  // .use(createComponents)
  // Cleaning files that shouldn't go to output
  .use(function(files, metalsmith, done) {
    delete files.data
    delete files['cached.json']
    // delete files['processed.json']
    // console.log(files, metalsmith);
    done();
  })
  .build(function(err) {
    if (err) throw err;
  });
