import { FiFile as icon } from 'react-icons/fi'
import validation from '../../utils/validation'

export default {
  name: 'page',
  type: 'document',
  title: 'Página genérica',
  icon,
  fields: [
    {
      name: 'meta',
      type: 'pageMeta',
      title: 'ℹ Informações básicas sobre a página',
      options: {
        collapsible: true,
        collapsed: false
      }
    },
    {
      name: 'body',
      type: 'pageBody',
      title: '🖋 Conteúdo da página',
      validation: validation.array({
        min: 0,
        errMsg:
          'Campo obrigatório. Como pretende postar uma página sem conteúdo? 🤣'
      })
    }
  ],
  initialValue: {
    meta: {
      _type: 'pageMeta',
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
