import {
  SEO_FIELDSET,
  getSlugField,
  OG_IMAGE,
  SCRIPTS,
  SEO_DESCRIPTION,
  SEO_TITLE
} from './metaFields'
import validation from '../../../utils/validation'

export default {
  type: 'object',
  title: 'ℹ Informações básicas sobre a categoria',
  name: 'categoryMeta',
  SEO_FIELDSET,
  fields: [
    {
      name: 'title',
      title: 'Nome/título da categoria',
      type: 'string',
      validation: validation.default()
    },
    getSlugField({
      title: 'Endereço relativo da categoria',
      description:
        'É adicionado depois de /blog. Ex: midias-sociais se tornaria /blog/midias-sociais 😉'
    }),
    SEO_TITLE,
    SEO_DESCRIPTION,
    OG_IMAGE,
    SCRIPTS
  ]
}
