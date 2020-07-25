import {
  SEO_FIELDSET,
  OG_IMAGE,
  SCRIPTS,
  SEO_DESCRIPTION,
  SEO_TITLE
} from './metaFields'

export default {
  type: 'object',
  title: 'ℹ Informações básicas sobre a página inicial',
  name: 'homeMeta',
  SEO_FIELDSET,
  fields: [SEO_TITLE, SEO_DESCRIPTION, OG_IMAGE, SCRIPTS]
}
