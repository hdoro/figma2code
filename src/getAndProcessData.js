const axios = require("axios");
const jsonfile = require("jsonfile");

const { mergeStyles } = require("./extractProperties");

function processNode(node) {
  const { children, styles, componentId, type } = node;
  let used = {
    components: {},
    styles: {}
  };

  // If instance of a component, than we know for sure
  // the component is being used
  if (componentId) {
    // console.log(used.components[componentId])
    // add a used: true flag to the component object
    used.components[componentId] = Object.assign(
      used.components[componentId] || {},
      { used: true }
    );
  }

  // We only care about properties from the master component,
  // instances only tell if it's being used or not
  if (type === "COMPONENT") {
    // Ignored properties from the component
    const {
      background,
      backgroundColor,
      locked,
      exportSettings,
      transitionNodeID,
      transitionDuration,
      transitionEasing,
      clipsContent,
      layoutGrids,
      isMask,
      isMaskOutline,
      ...usefulProperties
    } = node;
    // Save the usefulProperties to our object of components
    used.components[node.id] = Object.assign(used.components[node.id] || {}, {
      children,
      type,
      ...usefulProperties
    });
  }

  // Process children nodes
  if (Array.isArray(children) && children.length) {
    // Merge the parent's used styles & components with the children's
    children.forEach(child => {
      const usedByChild = processNode(child);
      for (const id in usedByChild.components) {
        used.components[id] = Object.assign(
          used.components[id] || {},
          usedByChild.components[id]
        );
      }
      for (const id in usedByChild.styles) {
        used.styles[id] = Object.assign(
          used.styles[id] || {},
          usedByChild.styles[id]
        );
      }
    });
  }

  // If we have a styles object, add every id found in it to usedStyles
  if (styles) {
    used.styles = mergeStyles(node, used.styles);
  }

  return used;
}

function processData(data) {
  let used = {
    components: {},
    styles: {}
  };

  // Merge the parent's used styles & components with the children's
  data.document.children.forEach(child => {
    const usedByChild = processNode(child);
    for (const id in usedByChild.components) {
      used.components[id] = Object.assign(
        used.components[id] || {},
        usedByChild.components[id]
      );
    }
    for (const id in usedByChild.styles) {
      used.styles[id] = Object.assign(
        used.styles[id] || {},
        usedByChild.styles[id]
      );
    }
  });

  for (const id in data.components) {
    const { name } = data.components[id];
    if (!used.components.hasOwnProperty(id)) {
      delete data.components[id];
    } else if (!used.components[id].used) {
      console.warn(`Component ${name} (${id}) is not being used`);
      delete data.components[id];
    } else if (!used.components[id].children) {
      console.warn(
        `Couldn't find master instance of component ${name} (${id})`
      );
      delete data.components[id];
    } else {
      data.components[id] = {
        ...data.components[id],
        ...used.components[id]
      };
    }
  }

  for (const id in data.styles) {
    const dataStyle = data.styles[id];
    const usedStyle = used.styles[id];
    if (!usedStyle || dataStyle.styleType === "GRID") {
      delete data.styles[id];
    } else if (
      dataStyle.styleType === "FILL" &&
      (!usedStyle.fills ||
      !usedStyle.fills.length)
    ) {
      console.warn(`Fill style ${dataStyle.name} (${id}) has no fills!`);
      delete data.styles[id]
    } else {
      data.styles[id] = {
        ...dataStyle,
        ...usedStyle
      };
    }
  }

  return data;
}

async function getData({ token, fileKey, canvases, useCache, cacheData }) {
  if (useCache) {
    try {
      const data = jsonfile.readFileSync("./data/cached.json");
      return data;
    } catch (error) {
      console.error(`Couldn't get cached file: ${error}`);
      console.info("Will try to fetch from Figma's API");
    }
  }

  const BASE_URL = "https://api.figma.com/v1/files";
  const endpoint = `${BASE_URL}/${fileKey}`;
  console.time("Fetching from Figma");
  const { data } = await axios.get(endpoint, {
    headers: { "X-Figma-Token": token }
  });

  const canvasArray = canvases.split(",");
  // Remove unused pages from the data to make it smaller
  data.document.children = data.document.children.filter(canvas => {
    return canvasArray ? canvasArray.indexOf(canvas.name) >= 0 : true;
  });
  console.timeEnd("Fetching from Figma");

  if (cacheData) {
    // Cache response
    console.time("Caching data");
    jsonfile.writeFileSync("./data/cached.json", data, {
      spaces: 2,
      encoding: "utf-8"
    });
    console.timeEnd("Caching data");
  }
  return data;
}

async function getAndProcessData(files, metalsmith, done) {
  const data = await getData(metalsmith._metadata);
  const processed = processData(data);

  files.data = data;
  files["processed.json"] = {
    contents: Buffer.from(JSON.stringify(processed, null, 2))
  };

  done();
}

module.exports = getAndProcessData;
