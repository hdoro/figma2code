// See https://www.figma.com/developers/api#effect-type
module.exports = function(style) {
  return (
    style.effects
      // Ignore invisible effects
      .filter(({ visible = true, type }) => visible)
      .map(({ type, color, offset = {}, radius = 0, ...f }, i) => {
        if (type === "DROP_SHADOW" || type === 'INNER_SHADOW') {
          const rgba = `rgba(${Math.floor(color.r * 255)}, ${Math.floor(
            color.g * 255
          )}, ${Math.floor(color.b * 255)}, ${color.a})`;
          return `${type === 'INNER_SHADOW' ? 'inset ' : ''}${offset.x || 0}px ${offset.y || 0}px ${radius}px ${rgba}`;
        } else if (type === 'LAYER_BLUR') {
          // filter
          return `blur(${radius}px)`
        } else if (type === 'BACKGROUND_BLUR') {
          // backdrop-filter
          return `blur(${radius}px)`
        }
      })
      .join(", ")
  );
};
