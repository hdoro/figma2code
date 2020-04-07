import validation from '../../utils/validation'

export default {
  name: 'titleCta',
  title: 'Título e CTA',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Título',
      type: 'text',
      rows: 1,
      description: '❓ Campo opcional'
    },
    {
      name: 'cta',
      title: 'Chamada para ação (CTA)',
      type: 'cta',
      validation: validation.default({})
    }
  ]
}
