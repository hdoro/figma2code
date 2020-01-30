// For these specific prop names, we know what CMS input type to use
exports.KNOWN_PROP_TYPES = {
  body: 'markdown',
  image: 'image'
}

exports.IGNORE_CMS_TYPES = [
  'file',
  'geopoint',
  'block',
  'span',
  'document',
  'object'
]

exports.OPTIONAL_DESC = '❓ Campo opcional'
