import { FiHome } from 'react-icons/fi'

import { getLangField, getLangTitle } from '../reusable/i18n'

export default {
  name: 'home',
  type: 'document',
  title: 'Página Inicial',
  icon: FiHome,
  __experimental_actions: ['update', 'publish'],
  fields: [
    getLangField({ hidden: true, readOnly: true }),
    {
      name: 'meta',
      type: 'homeMeta',
      title: 'ℹ Informações básicas sobre a página',
      options: {
        collapsible: true
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
  preview: {
    select: {
      lang: 'lang'
    },
    prepare({ lang }) {
      return { title: `Página inicial - ${getLangTitle(lang)}` }
    }
  }
}
