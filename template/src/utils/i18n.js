import { getContext } from 'svelte'
import i18nLabels from '../i18nLabels'

function getObjProperty(p, o) {
  // Taken from https://medium.com/javascript-inside/safely-accessing-deeply-nested-values-in-javascript-99bf72a0855a
  return p.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), o)
}

// key is a string containing the path to the label
// Ex: 'hero.tooltip'
export function translate(key, params = {}) {
  if (!key || typeof key !== 'string') {
    console.error('Missing or invalid translation key')
    return
  }
  try {
    const lang = getContext('lang')
    const labels = i18nLabels[lang]
    // Get the raw value of the label in the current lang
    let value = getObjProperty(key.split('.'), labels)
    // And replace eventual variables based on `params`
    for (const paramKey of Object.keys(params)) {
      value = value.replace(`%${paramKey}%`, params[paramKey])
    }
    return value
  } catch (error) {
    console.error(`Couldn\'t fetch ${key} from i18n`)
    return ''
  }
}
