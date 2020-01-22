const axios = require("axios");
const jsonfile = require("jsonfile");

const { capitalize, camelCase, camelToHyphen } = require("./utils");
const { KNOWN_IMPORTABLES } = require("./config");
const { mergeStyles } = require("./extractProperties");

function processChild(child, componentName) {
  const newChild = JSON.parse(JSON.stringify(child));
  const { name } = newChild;
  if (!name) {
    return child;
  }

  /* In order to get classes right in any nesting level, we define the parent name as the parent's parent name or, if it doesn't exist (meaning it's the first parent), its name */

  if (child.children) {
    newChild.children = newChild.children
      .map(c => processChild(c, componentName))
      .reverse();
  }

  // {tagName}
  const tagName = name.match(/({.*})/gi);
  if (tagName && tagName[0]) {
    newChild._tagName = tagName[0].replace(/[{}]/g, "").trim();
  }
  // [cmsType]
  const cmsType = name.match(/(\[.*\])/gi);
  if (cmsType && cmsType[0]) {
    newChild._cmsType = cmsType[0].replace(/[\[\]]/g, "").trim();
  }
  // (propName)
  const propName = name.match(/(\(.*\))/gi);
  if (propName && propName[0]) {
    newChild._propName = propName[0].replace(/[\(\)]/g, "").trim();
  }

  // Required props are set by *. Ex: (title){h2}*
  if (name.includes("*")) {
    newChild._isRequired = true;
  }

  const knownImportable = KNOWN_IMPORTABLES[newChild._cmsType];
  if (!newChild._tagName && !!knownImportable) {
    newChild._importable = knownImportable;
  }

  // If we have the parent component's name _and_ the propName,
  // add a className to the child using BEM (component__childPropName)
  if (newChild._propName && componentName) {
    newChild._className = camelToHyphen(
      `${camelCase(componentName)}__${newChild._propName}`
    );
  }
  return newChild;
}

function processFrame(f) {
  const frameObj = {
    _id: f.id,
    name: f.name,
    _type: "frame"
  };
  return [
    frameObj,
    // Components
    ...f.children
      .filter(c => c.type === "COMPONENT")
      .map(({ id, type, children, ...c }) => ({
        _id: id,
        _type: type.toLowerCase(),
        nameCap: capitalize(c.name),
        nameCamel: camelCase(c.name),
        children: children.map(child => processChild(child, c.name)).reverse(),
        ...c
      }))
  ];
}

const defaultComponent = {
  fills: [],
  strokes: [],
  children: []
};

// Things that change between component instances
// - absoluteBoundingBox => I can get the width here
function incrementComponent(toBeAdded, curr = {}) {
  const newComp = {
    ...curr,
    strokes: toBeAdded.strokes
  };
}

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
    // console.log(Object.keys(used.components), componentId, "\nInstance\n\n\n");
  }

  // We only care about properties from the master component,
  // instances only tell if it's being used or not
  if (type === "COMPONENT") {
    // console.log(used.components[node.id])
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
    // console.log(Object.keys(used.components), node.id, "\nComponent\n\n\n");
  }

  // Process children nodes
  if (Array.isArray(children) && children.length) {
    children.forEach(child => {
      const usedByChild = processNode(child);
      for (const id in usedByChild.components) {
        used.components[id] = Object.assign(
          used.components[id] || {},
          usedByChild.components[id]
        );
      }
      // Merge the parent's used styles & components with the children's
      used.styles = {
        ...used.styles,
        ...usedByChild.styles
      };
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

  data.document.children.forEach(child => {
    const usedByChild = processNode(child);
    for (const id in usedByChild.components) {
      used.components[id] = Object.assign(
        used.components[id] || {},
        usedByChild.components[id]
      );
    }
    // Merge the parent's used styles & components with the children's
    used.styles = {
      ...used.styles,
      ...usedByChild.styles
    };
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
    if (
      !used.styles.hasOwnProperty(id) ||
      data.styles[id].styleType === "GRID"
    ) {
      delete data.styles[id];
    } else {
      data.styles[id] = {
        ...data.styles[id],
        ...used.styles[id]
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
