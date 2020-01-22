const getColor = require("./getColor");
const getEffect = require("./getEffect");
const { addFile } = require("../utils");

module.exports = function(files, metalsmith, done) {
  let colors = [];
  let effects = [];

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
    } else if (styleType === 'EFFECT') {
      effects.push({
        name,
        value: getEffect(style)
      })
    }
  }

  files[`src/styles/colorVariables.sass`] = addFile(
    colors.map(c => `$${c.name}: ${c.value}`).join("\n")
  );

  done();
};
