const prettier = require('prettier')

function addFile(content, parser) {
  const string =
    typeof content === 'string' ? content : JSON.stringify(content, null, 2)
  const formatted = parser
    ? prettier.format(string, { semi: false, parser })
    : string
  return {
    contents: Buffer.from(formatted)
  }
}

exports.addFile = addFile

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1)
}

exports.capitalize = capitalize

const IGNORED_CHARS = ['_', '-']

function camelToHyphen(name) {
  return name.split('').reduce((acc, cur) => {
    const isUppercase =
      IGNORED_CHARS.indexOf(cur) < 0 && cur.toUpperCase() === cur
    return `${acc}${isUppercase ? `-${cur.toLowerCase()}` : cur}`
  }, '')
}

exports.camelToHyphen = camelToHyphen

// Function copied from https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
function toCamelCase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return '' // or if (/\s+/.test(match)) for white spaces
    return index == 0 ? match.toLowerCase() : match.toUpperCase()
  })
}

// [cmsType]
const CMS_TYPE_REGEX = new RegExp(/(\[.*\])/g)
// (propName)
const PROP_NAME_REGEX = new RegExp(/(\(.*\))/g)
// {htmlTag}
const HTML_TAG_REGEX = new RegExp(/(\{.*\})/g)

exports.parseNodeName = function(nodeName) {
  let cmsType
  let propName
  let htmlTag

  const originalName = nodeName
    .replace(CMS_TYPE_REGEX, match => {
      cmsType = match.replace(/[\[\]]/g, '')
      // Clear the match from the name
      return ''
    })
    .replace(PROP_NAME_REGEX, match => {
      propName = match.replace(/[\(\)]/g, '')
      return ''
    })
    .replace(HTML_TAG_REGEX, match => {
      htmlTag = match.replace(/[\{\}]/g, '')
      return ''
    })
    // And finish off by clearing spaces
    .trim()

  // To be used by CMS schema
  const camelCasedName = originalName && toCamelCase(originalName)
  
  return {
    cmsType,
    propName,
    htmlTag,
    originalName,
    camelCasedName,
    // To be used to create Svelte components
    componentName: camelCasedName && capitalize(camelCasedName)
  }
}
