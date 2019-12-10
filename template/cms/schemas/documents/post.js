import { FiFileText as icon } from 'react-icons/fi'

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
      }
    },
    {
      name: 'body',
      type: 'postBody',
      title: '🖋 Conteúdo do post',
      validation: Rule =>
        Rule.required().error(
          'Campo obrigatório. Como pretende postar sem conteúdo? 🤣'
        )
    }
  ],
  initialValue: {
    meta: {
      _type: 'postMeta',
      live: true,
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
