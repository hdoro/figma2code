import { FiFileText as icon } from 'react-icons/fi'
import validation from '../../utils/validation'

export default {
  name: 'post',
  type: 'document',
  title: 'Post do blog',
  icon,
  fields: [
    {
      name: 'meta',
      type: 'postMeta',
      title: 'ℹ Informações básicas sobre o post',
      options: {
        collapsible: true,
        collapsed: false
      },
      validation: validation.default()
    },
    {
      name: 'relatedPosts',
      title: 'Posts relacionados',
      description:
        '❓ Campo opcional. Caso este artigo esteja relacionado com outros que já publicaram, vale adicioná-los aqui para aparecerem ao final da página e manter leitores mais engajados dentro do site!',
      type: 'array',
      validation: validation.array({
        optional: true,
        unique: true,
        max: 3
      }),
      of: [
        {
          title: 'Post relacionado',
          description:
            '💡 se não encontrar um post nessa lista, verifique se ele já foi publicado',
          type: 'reference',
          to: [{ type: 'post' }]
        }
      ]
    },
    {
      name: 'body',
      type: 'postBody',
      title: '🖋 Conteúdo do post'
    }
  ],
  initialValue: {
    meta: {
      _type: 'postMeta',
      indexable: true
    }
  },
  preview: {
    select: {
      title: 'meta.title',
      subtitle: 'meta.seoDescription',
      media: 'meta.ogImage'
    }
  }
}
