import { SITE_LANGUAGES } from '../../src/utils/config'

const BASE_LANG_FIELD = {
  name: 'lang',
  title: 'Língua da página',
  type: 'string',
  options: {
    list: SITE_LANGUAGES,
    layout: 'radio',
    direction: 'horizontal'
  }
}

export function getLangField({ title = 'Língua da página', ...rest } = {}) {
  return Object.assign(BASE_LANG_FIELD, { title, ...rest })
}

export function getLangTitle(value) {
  if (!value) {
    return ''
  }
  return SITE_LANGUAGES.find(lang => lang.value === value).title
}
