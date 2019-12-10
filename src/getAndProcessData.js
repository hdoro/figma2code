const axios = require("axios");
const jsonfile = require("jsonfile");

const { capitalize, camelCase, camelToHyphen } = require("./utils");
const { KNOWN_IMPORTABLES } = require("./config");

function processChild(child, componentName) {
  const newChild = JSON.parse(JSON.stringify(child));
  const { name } = newChild
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
  if (name.includes('*')) {
    newChild._isRequired = true
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

function processData(data) {
  const nodes = Object.keys(data.nodes);
  let objects = [];
  for (const k of nodes) {
    const node = data.nodes[k];
    objects = [
      ...objects,
      // Frames and components
      // We only care about top-level frames
      ...node.document.children
        .filter(c => c.type === "FRAME")
        .map(processFrame)
        .reduce((acc, cur) => [...acc, ...cur], []),
      // Styles
      ...Object.keys(node.styles).map(k => ({
        ...node.styles[k],
        _id: k,
        _type: "style"
      }))
    ];
  }

  return objects;
}

async function getData({ token, fileKey, ids, useCache }, files) {
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
  const endpoint = `${BASE_URL}/${fileKey}/nodes?ids=${ids}`;
  const { data } = await axios.get(endpoint, {
    headers: { "X-Figma-Token": token }
  });
  if (useCache) {
    // Cache response
    jsonfile.writeFileSync("./data/cached.json", data, {
      spaces: 2,
      encoding: "utf-8"
    });
  }
  return data;
}

async function getAndProcessData(files, metalsmith, done) {
  const data = await getData(metalsmith._metadata, files);
  const processed = processData(data);
  files.data = processed;
  files["processed.json"] = {
    contents: Buffer.from(JSON.stringify(processed, null, 2))
  };
  done();
}

module.exports = getAndProcessData;
