export default {
  extensions: ['.js', '.mjs', '.html', '.svelte'],
  runtimeHelpers: true,
  exclude: ['node_modules/@babel/**'],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: '> 0.25%, not dead'
      }
    ]
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    [
      '@babel/plugin-transform-runtime',
      {
        useESModules: true
      }
    ]
  ]
}