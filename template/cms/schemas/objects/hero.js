import { FiFlag as icon } from 'react-icons/fi'

import validation from '../../utils/validation'
import { CTA_FIELD } from './cta'

const BASE_HERO = {
  name: 'hero',
  title: 'Seção inicial (Hero) 🐱‍👤',
  icon,
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Título',
      description:
        '💡 se quiser colorir parte do texto de rosa, é só escrever o texto **entre dois asteriscos**',
      type: 'string',
      validation: validation.text({})
    },
    {
      name: 'body',
      title: 'Corpo de texto abaixo do título',
      type: 'richParagraph',
      description: '❓ Campo opcional'
    },
    CTA_FIELD
  ]
}

const homeHero = {
  ...BASE_HERO,
  name: 'homeHero'
}

const pageHero = {
  ...BASE_HERO,
  name: 'pageHero'
}

export default [homeHero, pageHero]
