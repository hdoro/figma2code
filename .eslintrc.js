module.exports = {
  extends: 'eslint:recommended',
  plugins: ['svelte3'],
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3'
    }
  ],
  parserOptions: {
    ecmaVersion: 2017
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  rules: {
    // ...
  }
}
