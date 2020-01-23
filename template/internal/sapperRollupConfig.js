import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import svelte from 'rollup-plugin-svelte'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import { terser } from 'rollup-plugin-terser'
import config from 'sapper/config/rollup.js'

import pkg from '../package.json'
import babelConfig from './babelConfig.js.js'
import sassPlugin from './sassPlugin.js.js'

const mode = process.env.NODE_ENV
const dev = mode === 'development'

const onwarn = (warning, onwarn) =>
  (warning.code === 'CIRCULAR_DEPENDENCY' &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  onwarn(warning)

const dedupe = importee =>
  importee === 'svelte' || importee.startsWith('svelte/')

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      sassPlugin,
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode)
      }),
      svelte({
        dev,
        hydratable: true,
        emitCss: true
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
    ],

    onwarn
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      sassPlugin,
      replace({
        'process.browser': false,
        'process.env.NODE_ENV': JSON.stringify(mode)
      }),
      json(),
      svelte({
        generate: 'ssr',
        dev
      }),
      resolve({
        dedupe
      }),
      commonjs()
    ],
    external: Object.keys(pkg.dependencies).concat(
      require('module').builtinModules ||
        Object.keys(process.binding('natives'))
    ),

    onwarn
  }
}
