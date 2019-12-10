import { seoTitle, seoDescription, ogImage, scripts } from "../reusable/seo";

export default {
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
    {...seoTitle, fieldset: 'seo'},
    {...seoDescription, fieldset: 'seo'},
    {
      name: 'indexable',
      title: 'Indexar essa página no Google?',
      description: 'Se negativo, vamos bloquear os robôs do Google, Bing, etc.',
      fieldset: 'seo',
      validation: Rule => Rule.required().error('Campo obrigatório'),
      type: 'boolean'
    },
    ogImage,
    scripts,
  ]
}
