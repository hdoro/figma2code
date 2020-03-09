const VARIABLES_MAPPING = {
  SITE_NAME: 'siteName',
  SITE_URL: 'siteUrl',
  SANITY_ID: 'sanityID',
  BRAND_PRIMARY: 'brandPrimary'
}

const FILES_TO_INJECT = [
  {
    path: 'README.md',
    variables: ['SITE_NAME']
  },
  {
    path: 'cms\\sanity.json',
    variables: ['SITE_NAME', 'SANITY_ID']
  },
  {
    path: 'src\\utils\\config.js',
    variables: ['SITE_NAME', 'SITE_URL', 'SANITY_ID']
  },
  {
    path: 'internal\\importFromSanity\\index.js',
    variables: ['SANITY_ID']
  },
  {
    path: 'src\\components\\Head\\BaseHead.svelte',
    variables: ['BRAND_PRIMARY']
  },
  {
    path: 'cms\\plugins\\cms-customizer\\variableOverrides.css',
    variables: ['BRAND_PRIMARY']
  },
  {
    path: '.vscode\\settings.json',
    variables: ['BRAND_PRIMARY']
  }
]

module.exports = function(files, { _metadata }, done) {
  for (const file of FILES_TO_INJECT) {
    let content = files[file.path].contents.toString('utf-8')
    for (const variable of file.variables) {
      content = content.replace(
        `%${variable}%`,
        _metadata[VARIABLES_MAPPING[variable]] || `%${variable}%`
      )
    }

    files[file.path].contents = Buffer.from(content)
  }

  done()
}
