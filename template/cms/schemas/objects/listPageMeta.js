import { seoTitle, seoDescription } from "../reusable/seo";

export default {
  type: 'object',
  title: 'listPageMeta',
  name: 'listPageMeta',
  fields: [
    {
      name: 'title',
      title: 'Título da(s) página(s)',
      description: 'Será aplicado a todas as páginas da categoria, independente do número',
      type: 'string',
      validation: Rule => Rule.required().error('Campo obrigatório')
    },
    {
      name: 'body',
      title: 'Descrição / corpo de texto abaixo do título',
      description: '❓ Campo opcional. Será aplicado a todas as páginas da categoria, independente do número',
      type: 'text'
    },
    seoTitle,
    seoDescription
  ]
}
