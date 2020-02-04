const { addFile } = require("../utils");

async function createComponents(files, _metalsmith, done) {
  const { data } = files
  let components = {}

  for (const key of Object.keys(data.components)) {
    const comp = data.components[key]
    const { componentName, cssClassName: baseClass } = comp._meta

    let compInfo = {
      usedComponents: [],
      props: {},
      markup: [],
      styles: {}
    }
    for (const child of comp.children) {
      const { cssClassName: childClass, isRequired, propName, htmlTag  } = child._meta
      let childMarkup = {}

      // If we have a prop, add it to the current component
      if (propName) {
        compInfo.props[propName] = {
          required: isRequired || false
        }
        childMarkup.propName = propName
        if (propName === 'image') {
          childMarkup.component = 'LazyImage'
          if (compInfo.usedComponents.indexOf('LazyImage') < 0) {
            compInfo.usedComponents.push('LazyImage')
          }
          // Let's set the current width as the max width
          childMarkup.props = {
            maxWidth: child.absoluteBoundingBox.width
          }
        } else if (propName === 'body') {
          childMarkup.component = 'Markdown'
          if (compInfo.usedComponents.indexOf('LazyImage') < 0) {
            compInfo.usedComponents.push('LazyImage')
          }
        }
      }

      // If we have a childClass, 
      if (childClass) {
        const className = `${baseClass}__${childClass}`
        // @TODO: parse styles
        styles[className] = {}
        childMarkup.className = className
      }
    }
  }

  done();
}

module.exports = createComponents;
