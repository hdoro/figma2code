const { getColor } = require("./getColor");
const { getEffect } = require("./getEffect");
const { addFile } = require("../utils");

function getVarStr({ name, value }) {
  return `$${name}: ${value}`;
}

function getClassStr({ name, props }) {
  return `
.${name}
  ${Object.keys(props)
    .map(k => `${k}: ${props[k]}`)
    .join("\n\t")}
`;
}
// @TODO types should follow effects example: define helper classes and base variables
module.exports = function(files, metalsmith, done) {
  let colors = [];
  let effects = [];
  let types = []
  let fontFamilies = {};

  for (const id in files.data.styles) {
    const style = files.data.styles[id];
    if (!style) {
      continue;
    }
    const { name, styleType } = style;
    if (styleType === "FILL") {
      colors.push({
        name,
        value: getColor(style)
      });
    } else if (styleType === "EFFECT") {
      effects.push(getEffect(style));
    } else if (styleType === "TEXT") {
      const { style: text } = style;
      if (fontFamilies[text.fontFamily]) {
        fontFamilies[text.fontFamily].occurrences += 1;
      } else {
        fontFamilies[text.fontFamily] = { occurrences: 1 };
      }
    }
  }

  // Ordering variables
  colors.sort((a, b) => (a.name <= b.name ? -1 : 1));
  effects.sort((a, b) =>
    a.variable && b.variable && a.variable.name <= b.variable.name ? -1 : 1
  );

  const variables =
`// Colors
${colors.map(getVarStr).join("\n")}

// Shadows
${effects
  .filter(e => !!e.variable)
  .map(e => getVarStr(e.variable))
  .join("\n")}

// Typography
`;

  const classes = `
// Effects
${effects
  .filter(e => !!e.class)
  .map(e => getClassStr(e.class))
  .join("\n\n")}
  `;

  files[`src/styles/styleVariables.sass`] = addFile(variables);
  files[`src/styles/helperClasses.sass`] = addFile(classes);

  done();
};
