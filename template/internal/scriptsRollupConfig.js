import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'
import svelte from 'rollup-plugin-svelte'

import babelConfig from './babelConfig'

const mode = process.env.NODE_ENV
const dev = mode === 'development'

const dedupe = importee =>
  importee === 'svelte' || importee.startsWith('svelte/')

const scriptsJs = {
  input: 'src/scripts/scripts.js',
  output: {
    format: 'iife',
    file: 'static/scripts.js'
  },
  plugins: [
    commonjs(),

    babel(babelConfig),

    !dev &&
      terser({
        module: true
      })
  ]
}

const previewSvelte = {
  input: 'src/preview.js',
  output: {
    format: 'iife',
    file: 'static/preview.js',
    sourcemap: dev,
    name: 'preview'
  },
  plugins: [
    replace({
      'process.browser': true,
      'process.env.NODE_ENV': JSON.stringify(mode)
    }),
    svelte({
      dev,
      hydratable: true,
      css: false
    }),
    resolve({
      browser: true,
      dedupe
    }),
    commonjs(),

    babel(babelConfig),

    !dev &&
      terser({
        module: true
      })
  ]
}

export default [scriptsJs, previewSvelte]
