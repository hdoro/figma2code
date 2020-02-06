/*
  -------------
  Functions that convert compInfo to production-ready .sass and .svelte files.
  -------------
*/

const { addFile } = require('../utils')

const BASE_DIR = 'src/components/'

function getMarkup(entry) {
  let final = ''

  if (entry.component) {
    const props = entry.props
    return `<${entry.component} ${entry.props}/>`
  }
}

function getSvelteFile(comp, compName) {
  const imports =
    comp.usedComponents &&
    comp.usedComponents
      .map(u => `import ${u} from '../${u}/${u}.svelte'`)
      .join('\n')

  const props = Object.keys(comp.props)
    .map(k => {
      // If not required, default the prop to `undefined`
      return `export let ${k} ${comp.props[k].required ? '' : '= undefined'}`
    })
    .join('\n')

  const markup = comp.markup.map(getMarkup).join('\n')

  return `
  <script>
    ${imports || ''}

    import './${compName}.sass'

    ${props}
  </script>

  ${markup}
  `
}

function getSassFile({ styles }) {
  /*
    Example `styles` object:
    {
      'parent__child': {
        'max-width': 'getRem(1200px)',
        extended: {
          color: 'gray-100'
        }
      }
    }
  */
  return Object.keys(styles)
    .map(className => {
      const { extended = {}, ...cssProps } = styles[className]
      return `.${className}
    ${Object.keys(extended)
      .map(extendedProperty => {
        return `@extend ${extended[extendedProperty]}`
      })
      .join('\n\t')}
    ${Object.keys(cssProps)
      .map(property => {
        return `${property}: ${cssProps[property]}`
      })
      .join('\n\t')}`
    })
    .join('\n')
}

// `tree` is an object with every parsed component
module.exports = function(tree) {
  let files = []

  for (const compName of Object.keys(tree)) {
    const compDir = BASE_DIR + compName + '/'
    const compInfo = tree[compName]

    files.push({
      // Ex: /Component/Component.svelte
      path: compDir + compName + '.svelte',
      // @TODO: Format svelte files
      content: addFile(getSvelteFile(compInfo, compName))
    })
    files.push({
      // Ex: /Component/Component.sass
      path: compDir + compName + '.sass',
      // @TODO: Format sass files
      content: addFile(getSassFile(compInfo, compName))
    })
  }

  return files
}
