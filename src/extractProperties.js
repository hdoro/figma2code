/*
🎯 Workable node types:

- FRAME, COMPONENT & GROUP (same shape)
  - fills
  - strokes
  - strokeWeight
  - strokeAlign
  - cornerRadius
  - rectangleCornerRadii
  - blendMode
  - constraints => horizontal is potentially useful
  - opacity
  - absoluteBoundingBox => I can get the width here
  - size
  - relativeTransform
  - effects
  - children => changes in the same ways
  - there are some others, which are ignored here. See: https://www.figma.com/developers/api#frame-props
- INSTANCE - same as FRAME, plus:
  - componentId
- VECTOR, STAR, LINE, ELLIPSE, REGULAR_POLYGON, RECTANGLE
  - almost the same as FRAME, but with extra:
  - strokeMiterAngle
  - strokeGeometry
  - styles
- TEXT
  - almost the same as VECTOR, but with extra:
  - characters (text inside it)
  - style: TypeStyle
  - characterStyleOverrides
  - some other complicated Maps which I won't get into right now
*/

/*
💅 How to deal with style generation:
  - we can only apply one style per type of style
    - fill, text, stroke, effect, grid
  - so we need to update the style according to the found properties related to it:
    - styles.fill -> fills[]
    - styles.background -> background[]
    - styles.stroke -> strokes[]
    - styles.effect -> effects[]
    - styles.text -> every parts of style, except:
      - textAlignHorizontal
      - textAlignVertical
      - fills
    - styles.grid -> will be ignored as layoutGrids concerns Figma's interface, not CSS
*/

// Function to parse styles from node and add them to usedStyles
exports.mergeStyles = function(node, currStyles) {
  for (const type of Object.keys(node.styles)) {
    const id = node.styles[type];
    const newStyle = currStyles[id] || {};
    if (["fill", "stroke", "effect", "background"].indexOf(type) > -1) {
      newStyle[type + "s"] = node[type + "s"];
      // console.log(type + 's', newStyle, Object.keys(newStyle), '\n\n\n')
      // console.log(type + 's', node[type + 's'], Object.keys(node), '\n\n\n')
    } else if (type === "text") {
      /*
        The 3 unused properties are the ones that are independent of text styles and can be overwritten on a layer-basis, so we dump them here and prevent them from entering our newStyle.style object
      */
      const {
        textAlignHorizontal,
        textAlignVertical,
        fills,
        ...fixedTypeStyles
      } = node.style;
      newStyle.style = Object.assign(newStyle.style || {}, fixedTypeStyles);
    }
    currStyles[id] = newStyle
  }
  return currStyles
}

/*
- fontFamily
- paragraphSpacing
- paragraphIndent
- italic
- fontWeight
- fontSize
- textCase
- textDecoration
- letterSpacing
- opentypeFlags
- lineHeightPx
- lineHeightPercent
- lineHeightPercentFontSize
- lineHeightUnit
- textDecoration
*/
