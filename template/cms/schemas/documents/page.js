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
      name: 'hero',
      title: '🐱‍👤 Seção inicial da página (hero )',
      type: 'pageHero',
      options: { collapsible: true, collapsed: false },
      validation: validation.default()
    },
    {
      name: 'body',
      type: 'pageBody',
      title: '🖋 Conteúdo da página'
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
