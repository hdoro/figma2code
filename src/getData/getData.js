const axios = require("axios");
const jsonfile = require("jsonfile");

const CACHE_PATH = "./data/cachedFigmaFile.json";
const BASE_URL = "https://api.figma.com/v1/files";

async function getData(files, metalsmith, done) {
  const {
    token,
    fileKey,
    canvases,
    useCache,
    cacheData = true
  } = metalsmith._metadata;

  let data;
  console.log(useCache);

  if (useCache) {
    try {
      data = jsonfile.readFileSync(CACHE_PATH);
      files.data = data;
      done();
      return;
    } catch (error) {
      console.error(`Couldn't get cached file: ${error}`);
      console.info("Will try to fetch from Figma's API");
    }
  }

  const endpoint = `${BASE_URL}/${fileKey}`;

  console.time("Fetching from Figma");
  const { data: freshData } = await axios.get(endpoint, {
    headers: { "X-Figma-Token": token }
  });
  data = freshData;
  console.timeEnd("Fetching from Figma");

  /*
    Remove unused pages/canvases from the data.
    Besides making it smaller & faster, this prevents the inclusion of components that aren't used in the final output 😉
  */
  const canvasArray = canvases.split(",");
  data.document.children = data.document.children.filter(canvas => {
    return canvasArray ? canvasArray.indexOf(canvas.name) >= 0 : true;
  });

  // Cache response if desired
  if (cacheData) {
    console.time("Caching data");
    jsonfile.writeFileSync(CACHE_PATH, data, {
      spaces: 2,
      encoding: "utf-8"
    });
    console.timeEnd("Caching data");
  }

  files.data = data;

  done();
}

module.exports = getData;
