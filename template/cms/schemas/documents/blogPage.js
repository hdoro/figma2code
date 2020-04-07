import { FiGrid as icon } from 'react-icons/fi'

import { getLangTitle } from '../../utils/i18n'
import { SITE_LANGUAGES } from '../../../src/utils/config'

export const LIST_PAGE_FIELDS = [
  {
    name: 'title',
    title: 'Título visível acima dos posts',
    type: 'string',
    description:
      '⚡ Campo opcional mas altamente encorajado. Caso não escreva nada, o título será "Blog Compoá"'
  },
  {
    name: 'suptitle',
    title: 'Sobre-título',
    type: 'string',
    description: '❓ Campo opcional. Aparece logo acima do título'
  },
  {
    name: 'body',
    title: 'Corpo de texto abaixo do título',
    type: 'richParagraph',
    description: '❓ Campo opcional.'
  }
]

export default {
  name: 'blogPage',
  type: 'document',
  title: 'Página do blog',
  icon,
  fields: [
    {
      name: 'meta',
      type: 'listPageMeta',
      title: 'ℹ Informações de SEO para as páginas do blog',
      description:
        '💡 As páginas do blog lista todos os posts do site, podendo ter uma ou mais páginas, dependendo da quantidade total. Essas informações se aplicam a todas elas.',
      options: {
        collapsible: true
      }
    },
    ...LIST_PAGE_FIELDS
  ],
  preview: {
    select: {
      id: '_id'
    },
    prepare({ id }) {
      const lang = id ? id.split('-')[1] : ''
      return {
        // Only display the language's name in the preview if we have more than one lang in the website
        title: `Página do blog ${
          SITE_LANGUAGES.length > 1 ? getLangTitle(lang) : ''
        }`
      }
    }
  }
}
