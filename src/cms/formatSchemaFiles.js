function getValidation({ type, props } = {}) {
  if (!type) {
    return ''
  }
  return `validation: validation.${type}(${JSON.stringify(props || {})})`
}

function renderMeta({ name, title, type }) {
  return `
  name: "${name}",
  title: "${title}",
  type: "${type}",
  `.trim()
}

function parseFields(fields) {
  return fields
    .map(({ name, title, type, _validation, ...rest }) => {
      const renderedMeta = renderMeta({ name, title, type })
      const renderedRest = Object.keys(rest)
        .map(k => {
          return `${k}: ${
            typeof rest[k] === 'object'
              ? JSON.stringify(rest[k])
              : `"${rest[k]}"`
          },`
        })
        .join('')
      return `
      {
        ${renderedMeta + renderedRest + getValidation(_validation)}
      }
    `
    })
    .join(',')
}

exports.createSchemaFile = ({ fields, ...meta }) => {
  return `
import validation from '../reusable/validation'

export default {
  ${renderMeta(meta)}
  fields: [
    ${parseFields(fields)}
  ]
}  
  `
}

exports.createIndexFile = fileNames => {
  return `
    ${fileNames.map(name => `import ${name} from './${name}.js'`).join('\n')}

    export default [${fileNames.join(', ')}]
  `
}
