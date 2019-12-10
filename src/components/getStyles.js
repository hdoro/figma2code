function getSolidColor(s) {
  const rgb = c => (c * 255).toFixed(0)
  return `rgba(${rgb(s.r)}, ${rgb(s.g)}, ${rgb(s.b)}, ${s.a.toFixed(2)})`;
}

function getColors(colors) {
  const dealByType = c => {
    if (c.type === "SOLID") {
      return getSolidColor(c.color);
    }
    return undefined;
  };
  return colors
    .filter(c => c.type === "SOLID")
    .map(dealByType)
    .join(", ");
}

function getBoxShadow({ offset, radius, color }) {
  return `${offset.x}px ${offset.y}px ${radius}px ${getSolidColor(color)}`;
}

function getEffects(effects) {
  let result = ''
  const boxShadow = effects
    .filter(e => e.visible && e.type === "DROP_SHADOW")
    .map(getBoxShadow).join(', ');
  if (boxShadow.length) {
    result = result + `box-shadow: ${boxShadow};`;
  }
  return result
}

function getStyles(c) {
  return `
    .${c.name} {
      ${(c.background &&
        c.background.length &&
        `background: ${getColors(c.background)};`) ||
        ""}
      ${getEffects(c.effects)}
    }
  `;
}

module.exports = getStyles;
