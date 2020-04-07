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
      }
    },
    {
      name: 'body',
      type: 'postBody',
      title: '🖋 Conteúdo do post',
      validation: validation.array({
        min: 0,
        errMsg:
          'Campo obrigatório. Como pretende postar um artigo sem conteúdo? 🤣'
      })
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
