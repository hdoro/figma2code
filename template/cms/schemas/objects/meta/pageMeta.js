import {
  SEO_FIELDSET,
  getSlugField,
  SEO_FIELDS,
  OG_IMAGE,
  SCRIPTS
} from './metaFields'
import validation from '../../../utils/validation'

export default {
  title: 'ℹ Informações básicas sobre a página',
  type: 'object',
  name: 'pageMeta',
  fieldsets: [SEO_FIELDSET],
  fields: [
    {
      name: 'title',
      title: 'Título da página',
      description:
        '💡 esse título é usado apenas para nomear a página em redes sociais e no Google (vai ser o título da aba no navegador). Se você incluir um "Título de SEO" (abaixo), ninguém vai ver esse título, vai ser vir apenas para identificação interna de vocês 😉',
      type: 'string',
      validation: validation.default()
    },
    getSlugField({ title: 'Endereço relativo da página no site' }),
    ...SEO_FIELDS,
    OG_IMAGE,
    SCRIPTS
  ]
}
