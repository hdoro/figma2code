// See https://www.figma.com/developers/api#effect-type
const { getRgba } = require("./getColor");

function getShadow(effect) {
  const { type, color, offset, radius } = effect;

  return `${type === "INNER_SHADOW" ? "inset " : ""}${offset.x ||
    0}px ${offset.y || 0}px ${radius}px ${getRgba(color)}`;
}

// Return variables for shadows
// Return a class if we have blur effects
function getEffect(style) {
  const effects = style.effect
    // Ignore invisible effects
    .filter(({ visible = true }) => visible);

  let returnClass = !!effects.find(
    e => e.type === "LAYER_BLUR" || e.type === "BACKGROUND_BLUR"
  );
  let shadows = [];
  let shadowVarName = style.name
  let classProps = {
    "box-shadow": "",
    "backdrop-filter": "",
    filter: ""
  };

  for (const effect of effects) {
    const { type } = effect;
    if (type === "DROP_SHADOW" || type === "INNER_SHADOW") {
      shadows.push(getShadow(effect));
    } else if (type === "LAYER_BLUR") {
      // Figma only allows one LAYER_BLUR per effect
      classProps.filter = `blur(${effect.radius}px)`;
    } else if (type === "BACKGROUND_BLUR") {
      // Figma only allows one BACKGROUND_BLUR per effect
      classProps["backdrop-filter"] = `blur(${effect.radius}px)`;
    }
  }

  if (returnClass) {
    shadowVarName = shadowVarName + '-shadow'
    classProps["box-shadow"] = '$' + shadowVarName;
  }

  return Object.assign(
    {},
    shadows.length
      ? {
          variable: {
            name: shadowVarName,
            value: shadows.join(", ")
          }
        }
      : {},
    returnClass
      ? {
          class: {
            name: style.name,
            props: classProps
          }
        }
      : {}
  );
}

exports.getEffect = getEffect;
