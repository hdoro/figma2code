// getProps, getImports and getMarkup are all recursive, meaning
// they'll call eachother endlessly as long as conditions are met
// (in this case, usually when they have child nodes)

function getProps(c) {
  // If _propName is defined, declare it
  if (c._propName) {
    const base = `export let ${c._propName}`;
    let defaultValue = "";
    if (!c._isRequired) {
      defaultValue = " = undefined";
    } else if (c._cmsType && c._cmsType.includes("array")) {
      defaultValue = " = []";
    }
    return base + defaultValue;
  }
  // Else, if we're not dealing with a component and we have
  // children, add them each to our prop list
  if (!c._componentName && c.children && c.children.length) {
    return c.children.map(getProps).join("\n");
  }
  return "";
}

function getImports(c) {
  // @TODO: avoid duplicate component import declarations
  // If it's a component, import it from its corresponding folder!
  if (!!c._componentName) {
    return `import ${c._componentName} from '../${c._componentName}/${c._componentName}.svelte'`;
  }

  // If we have a common [cmsType] such as body, we'll have
  // a given importable (in this case, markdown).
  if (!!c._importable) {
    return `import ${c._importable.name} from '${c._importable.path}'`;
  }

  // If we have children, check their imports
  if (c.children && c.children.length) {
    return c.children.map(getImports).join("\n");
  }

  // Else we don't want to import anything
  return "";
}

function getMarkup(c) {
  // For components:
  // <Component {...props} /> if [propName] is defined
  // <Component /> if not (static component, for ex.)
  if (c.type === "INSTANCE") {
    return `<${c._componentName} ${c._propName ? `{...${c._propName}}` : ""}/>`;
  }

  // Again, for known types, get their markup
  if (c._importable && c._importable.markup) {
    return c._importable.markup;
  }

  const createTag = content =>
    `<${c._tagName}
        ${c._className ? `class="${c._className}"` : ""}
      >
        ${content}
      </${c._tagName}>
    `;

  if (c._cmsType && c._cmsType.split(".")[0] === "array" && c._propName) {
    return createTag(`
      {#each ${c._propName} as item}
        ${c.children ? getMarkup(c.children[0]) : "<!-- loop here -->"}
      {/each}
    `);
  }

  // If we have children, go for their markups
  if (c.children && c.children.length) {
    return c.children.map(getMarkup).join("\n");
  }

  // Finally, if it's a plain tag, render it
  if (!!c._tagName) {
    if (c._propName && !c._isRequired) {
      return `
        {#if ${c._propName}}
          ${createTag(`{${c._propName}}`)}
        {/if}
      `;
    }
    return createTag(
      c._propName ? `{${c._propName}}` : "<!-- Content here -->"
    );
  }

  return "";
}

function getMain(c) {
  return `
    <script>
      ${getImports(c)}

      ${getProps(c)}
    </script>

    <style src="./${c.name}.postcss" global></style>

    ${getMarkup(c)}
  `;
}

module.exports = getMain;
