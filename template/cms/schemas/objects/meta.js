import { seoTitle, seoDescription, ogImage, scripts } from '../../utils/seo'
import validation from '../../utils/validation'

const homeMeta = {
  type: 'object',
  title: 'Informações básicas da página inicial',
  name: 'homeMeta',
  fields: [seoTitle, seoDescription, ogImage, scripts]
}

const listPageMeta = {
  type: 'object',
  title: 'listPageMeta',
  name: 'listPageMeta',
  fields: [
    {
      name: 'title',
      title: 'Título da(s) página(s)',
      description:
        'Será aplicado a todas as páginas da categoria, independente do número',
      type: 'string',
      validation: validation.default()
    },
    {
      name: 'body',
      title: 'Descrição / corpo de texto abaixo do título',
      description:
        '❓ Campo opcional. Será aplicado a todas as páginas da categoria, independente do número',
      type: 'text'
    },
    seoTitle,
    seoDescription
  ]
}

const pageMeta = {
  type: 'object',
  title: 'ℹ Informações básicas sobre a página',
  name: 'pageMeta',
  fieldsets: [
    {
      name: 'seo',
      title: '🔍 Campos para SEO',
      description:
        'Não obrigatórios, mas é uma boa pra reforçar o posicionamento do site no Google!',
      options: { collapsible: true }
    }
  ],
  fields: [
    { ...seoTitle, fieldset: 'seo' },
    { ...seoDescription, fieldset: 'seo' },
    {
      name: 'indexable',
      title: 'Indexar essa página no Google?',
      description: 'Se negativo, vamos bloquear os robôs do Google, Bing, etc.',
      fieldset: 'seo',
      validation: validation.default(),
      type: 'boolean'
    },
    ogImage,
    scripts
  ]
}

const postMeta = {
  ...pageMeta,
  name: 'postMeta',
  fields: [
    ...pageMeta.fields,
    {
      name: 'category',
      title: 'Categoria do post',
      validation: validation.default(),
      type: 'reference',
      to: [{ type: 'category' }]
    }
  ]
}

export default [homeMeta, listPageMeta, pageMeta, postMeta]
