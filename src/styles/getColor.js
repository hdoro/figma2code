// See https://www.figma.com/developers/api#paint-type

function getRgba(color) {
  return `rgba(${Math.floor(color.r * 255)}, ${Math.floor(
    color.g * 255
  )}, ${Math.floor(color.b * 255)}, ${Math.floor(color.a * 100)}%)`;
}

function getColor(style) {
  return (
    style.fills
      // Ignore invisible colors
      .filter(({ visible = true, type }) => {
        if (visible === false) {
          return false;
        }
        if (type != "SOLID") {
          console.warn(
            `Fills other than solid colors aren't supported yet (${type.toLowerCase()} used by ${
              style.name
            } ${style.id})`
          );
          return false;
        }
        return true;
      })
      .map(({ type, color, ...f }, i) => {
        if (type === "SOLID") {
          const rgba = getRgba(color);
          /*
          CSS will only accept multiple colors if only the last one is a solid color, all the previous ones should be linear gradients, hence this logic
        */
          if (i === style.fills.length - 1) {
            return rgba;
          } else {
            return `linear-gradient(0deg, ${rgba}, ${rgba})`;
          }
        }
      })
      .join(", ")
  );
};

exports.getColor = getColor;
exports.getRgba = getRgba;
