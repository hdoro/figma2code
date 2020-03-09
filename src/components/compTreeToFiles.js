/*
  -------------
  Functions that convert compInfo to production-ready .sass and .svelte files.
  -------------
*/

const { addFile } = require('../utils')
const { TAGLESS_EL_KEY } = require('./compUtils')

const BASE_DIR = 'src/components/'

const IGNORED_COMPS = [
  // We'll have a ready-made Button in the template
  'Button'
]

function parseProps(props = {}) {
  return Object.keys(props)
    .map(key => {
      const value = props[key]
      // Deal with props that must be spread
      if (value && value._type === 'spread' && value.name) {
        return `{...${value.name}}`
      }
      // Then with string values that are actually pointing to props
      else if (value && value._type === 'prop' && value.name) {
        // If the receiving prop name is the same as the one we're passing to the component, then use Svelte's shortHand {propName}
        if (key === value.name) {
          return `{${value.name}}`
        }
        return `${key}={${value.name}}`
      }
      // Then generic objects and arrays that need to be stringified
      else if (typeof value === 'object' || Array.isArray(value)) {
        // objProp={{ 'key': value }}
        // arrProp={[...]}
        return `${key}={${JSON.stringify(value)}}`
      }
      // Then numbers and booleans, as they need to preserve their typeof
      else if (typeof value === 'number' || typeof value === 'boolean') {
        // numProp={10}
        // boolProp={true}
        return `${key}={${value}}`
      }
      // And finally go with strings
      // strProp="value"
      return `${key}="${value}"`
    })
    .join(' ')
}

function getMarkup({ el, allProps }) {
  const expandedProp = el.propName && allProps[el.propName]

  function getStructure() {
    const className = el.className ? `class="${el.className}"` : ''
    // Render components
    if (el.component) {
      const propsStr = parseProps(el.props)
      return `<${el.component} ${propsStr}/>`
    }
    // Render shallow tag-based elements
    else if (el.tag && !Array.isArray(el.children)) {
      const content = el.propName ? '{' + el.propName + '}' : ''
      // Deal with tagless elements that want to render the prop
      if (el.tag === TAGLESS_EL_KEY) {
        return content
      }
      return `<${el.tag} ${className}>${content}</${el.tag}>`
    }
    // Nested structures that don't replicate the same component
    else if (Array.isArray(el.children)) {
      const childrenMarkup = el.children
        .map(c => getMarkup({ el: c, allProps }))
        .join('\n')
      const opening = `<${el.tag} ${className}>`
      const closing = `</${el.tag}>`
      let content = childrenMarkup

      // If we're dealing with an array with replicable markup, use Svelte's {#each} method
      if (el.isArray && el.propName) {
        content = `{#each ${el.propName} as item}
        ${childrenMarkup}
        {/each}`
      }
      // And finally render the structure with a wrapping element if it has a tag for it
      if (el.tag) {
        if (el.tag === TAGLESS_EL_KEY) {
          // For tagless elements, if content is null render only {propName}
          return content || `{${el.propName}}`
        }
        return `${opening}${content}${closing}`
      } else return content
    }
  }
  const structure = getStructure()
  // If the component is required or it simply doesn't have props, then render unconditionally
  if ((expandedProp && expandedProp.required) || !el.propName) {
    return structure
  }
  // Else we need to wrap it in a conditional to prevent rendering elements with undefined props
  else {
    return `
    {#if typeof ${el.propName} !== 'undefined'}
      ${structure}
    {/if}
    `
  }
}

function getProps(props) {
  return (
    Object.keys(props)
      //  prop names with a dot (cta.link, for example) shouldn't be declared as they refer to another parent prop
      .filter(k => !k.includes('.'))
      .map(k => {
        // If not required, default the prop to `undefined`
        return `export let ${k} ${props[k].required ? '' : '= undefined'}`
      })
      .join('\n')
  )
}

function getSvelteFile(comp, compName) {
  const imports =
    comp.usedComponents &&
    comp.usedComponents
      .map(u => `import ${u} from '../${u}/${u}.svelte'`)
      .join('\n')

  const props = getProps(comp.props)

  const markup = comp.markup
    .map(c => getMarkup({ el: c, allProps: comp.props }))
    .join('\n')

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
    .sort()
    .map(className => {
      const { extended = {}, ...cssProps } = styles[className]
      return `.${className}
    ${Object.keys(extended)
      .map(extendedProperty => {
        return `@include ${extended[extendedProperty]}`
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
    if (IGNORED_COMPS.indexOf(compName) >= 0) {
      continue
    }
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
