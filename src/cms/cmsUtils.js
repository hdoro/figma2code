// For these specific prop names, we know what CMS input type to use
const KNOWN_PROP_TYPES = {
  body: 'markdown',
  image: 'image'
}

// Currently as an object in case we decide to add extra information to it in the future
const BASIC_CMS_TYPES = {
  boolean: true,
  date: true,
  datetime: true,
  number: true,
  slug: true,
  string: true,
  text: true,
  url: true
}

/*
Unsure:
- array

Special cases:
- object
- reference

Ignored:
- file
- geopoint
- block
- span
- document
*/

const OPTIONAL_DESC = '❓ Campo opcional'

const TYPE_REGEX = new RegExp(/(\[.*\])/g)

const getCmsType = name => {
  const matches = name.match(TYPE_REGEX)
  if (!matches || !matches.length) {
    return
  }
  return matches[0].replace(/[\[\]]/g, '')
}

exports.getCmsType = getCmsType

const createIndexFile = fileNames => {
  return `
    ${fileNames.map(name => `import ${name} from './${name}.js'`).join('\n')}

    export default [${fileNames.join(', ')}]
  `
}

exports.createIndexFile = createIndexFile
