// See https://github.com/differui/rollup-plugin-sass
import sass from 'rollup-plugin-sass'
import { writeFileSync, readFileSync } from 'fs'
import postcss from 'postcss'

const STYLES_FOLDER = 'static/styles'

const IS_DEV = process.env.NODE_ENV === 'development'

function getStandaloneFileName(id) {
  const splitted = id.split('\\')
  return splitted[splitted.length - 1].replace('.standalone.sass', '')
}

export default sass({
  options: {
    indentedSyntax: true,
    // Extra line in the end to prevent errors with the SASS compiler
    data: readFileSync('./src/styles/theme.sass', { encoding: 'utf-8' }) + '\n'
  },
  output(_styles, styleNodes) {
    // CSS files to be written to the `static` folder
    let files = {
      global: ''
    }
    // styleNodes: Array<{ id: string, content: string }>
    for (const node of styleNodes) {
      // .standalone.sass files will be bundled separately
      if (node.id.includes('.standalone.sass')) {
        const fileName = getStandaloneFileName(node.id)
        files[fileName] = (files[fileName] || '') + node.content
      } else {
        files.global += node.content
      }
    }
    // Finally, write each file to STYLES_FOLDER
    for (const key in files) {
      if (files.hasOwnProperty(key)) {
        files[key]
        writeFileSync(`${STYLES_FOLDER}/${key}.css`, files[key])
      }
    }
  },
  // Post-process .css files with postcss to make them work in every browser and to compress them
  processor: (css, source) => {
    // If in development mode, save some processing time and skip the processing
    if (IS_DEV) {
      return css
    }
    // To help with debugging, we tell postcss where these files came from
    let from = `${STYLES_FOLDER}/global.css`
    if (source.includes('.standalone.sass')) {
      from = `${STYLES_FOLDER}/${getStandaloneFileName(source)}.css`
    }
    return postcss([
      require('postcss-preset-env')({ stage: 1 }),
      require('cssnano')
    ])
      .process(css, { from })
      .then(result => result.css)
  }
})
