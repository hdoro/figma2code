import pageMeta from './pageMeta'

export default {
  ...pageMeta,
  name: 'postMeta',
  fields: [
    ...pageMeta.fields,
    {
      name: 'category',
      title: 'Categoria do post',
      validation: Rule => Rule.required().error('Campo obrigatório'),
      type: 'reference',
      to: [{ type: 'category' }]
    }
  ]
}
