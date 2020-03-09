import { SITE_LANGUAGES } from '../../../src/utils/config'

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
  return Object.assign(
    BASE_LANG_FIELD,
    { title, ...rest },
    !Array.isArray(SITE_LANGUAGES) || SITE_LANGUAGES.length <= 1
      ? // If we don't have more than 1 language, hide the lang field
        { hidden: true, readOnly: true }
      : {}
  )
}

export function getLangTitle(value) {
  return SITE_LANGUAGES.find(lang => lang.value === value).title
}
