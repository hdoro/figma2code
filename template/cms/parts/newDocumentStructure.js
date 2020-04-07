import S from '@sanity/base/structure-builder'

export const SINGLETON_TEMPLATES = ['home', 'config']

export default [
  ...S.defaultInitialValueTemplateItems().filter(({ spec }) => {
    return SINGLETON_TEMPLATES.indexOf(spec.templateId) < 0
  })
]
