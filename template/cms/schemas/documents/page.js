import { FiFile as icon } from 'react-icons/fi'

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
      validation: Rule =>
        Rule.required().error(
          'Campo obrigatório. Como pretende postar uma página sem conteúdo? 🤣'
        )
    }
  ],
  initialValue: {
    meta: {
      _type: 'pageMeta',
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
