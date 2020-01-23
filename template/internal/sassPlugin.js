// See https://github.com/differui/rollup-plugin-sass
import sass from "rollup-plugin-sass";

export default sass({
  options: {
    indentedSyntax: true,
    // Extra line in the end to prevent errors with the SASS compiler
    data: readFileSync('../src/styles/theme.sass', { encoding: 'utf-8' }) + '\n'
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
        const splitted = node.id.split('\\')
        const finalFileName = splitted[splitted.length - 1].replace(
          '.standalone.sass',
          ''
        )
        files[finalFileName] = (files[finalFileName] || '') + node.content
      } else {
        files.global += node.content
      }
    }
    for (const key in files) {
      if (files.hasOwnProperty(key)) {
        writeFileSync(`static/styles/${key}.css`, files[key])
      }
    }
  },
  processor: css =>
    postcss([require('postcss-preset-env')({ stage: 0 }), require('cssnano')])
      .process(css)
      .then(result => result.css)
})
