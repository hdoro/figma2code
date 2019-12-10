const { parse, evaluate } = require("groq-js");

const getStyles = require("./getStyles");
const getMain = require("./getMain");
const getCms = require("./getCms");
const { addFile } = require("../utils");

const COMP_QUERY = `*[_type == "component"]{
  ...,
  children {
    ...,
    "_componentName": *[_id == ^.componentId][0].nameCap,
  }
}|order(name)`;


async function createComponents(files, metalsmith, done) {
  const dataset = files.data;
  const tree = parse(COMP_QUERY);
  const value = await evaluate(tree, { dataset });
  const components = await value.get();

  for (const c of components) {
    files[`src/components/${c.nameCap}/${c.nameCap}.svelte`] = addFile(
      getMain(c)
    );
    files[`src/components/${c.nameCap}/${c.name}.postcss`] = addFile(
      getStyles(c),
      "scss"
    );
    files[`cms/schemas/objects/${c.nameCamel}.js`] = addFile(
      getCms(c),
      "babel"
    );
  }
  files[`cms/schemas/objects/index.js`] = addFile(
    components
      .map(c => `import ${c.name.toLowerCase()} from './${c.nameCamel}'`)
      .join("\n") +
      "\n\nexport default [" +
      components.map(c => c.name.toLowerCase()).join(",") +
      "]"
  );
  files[`src/components/allComponents.js`] = addFile(
    components
      .map(
        c =>
          `import ${c.name.toLowerCase()} from './${c.nameCap}/${
            c.nameCap
          }.svelte'`
      )
      .join("\n") +
      "\n\nexport default [" +
      components.map(c => c.name.toLowerCase()).join(",") +
      "]"
  );

  done();
}

module.exports = createComponents;
