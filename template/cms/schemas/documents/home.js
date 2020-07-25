import { FiHome as icon } from 'react-icons/fi'

import { getLangTitle } from '../../utils/i18n'
import validation from '../../utils/validation'
import { SITE_LANGUAGES } from '../../../src/utils/config'

export default {
  name: 'home',
  type: 'document',
  title: 'Página Inicial',
  icon,
  fields: [
    {
      name: 'meta',
      type: 'homeMeta',
      title: 'ℹ Informações básicas sobre a página',
      options: {
        collapsible: true
      }
    },
    {
      name: 'hero',
      title: 'Seção inicial (hero) 🐱‍👤',
      type: 'homeHero',
      validation: validation.default()
    },
    {
      name: 'body',
      title: 'Seções do resto da página',
      type: 'homeBody',
      validation: validation.array({
        min: 0
      })
    }
  ],
  preview: {
    select: {
      id: '_id'
    },
    prepare({ id }) {
      // We might not have an id if the page isn't yet created
      const lang = id ? id.split('-')[1] : ''
      return {
        // Only display the language's name in the preview if we have more than one lang in the website
        title: `Página inicial ${
          SITE_LANGUAGES.length > 1 ? getLangTitle(lang) : ''
        }`
      }
    }
  }
}
