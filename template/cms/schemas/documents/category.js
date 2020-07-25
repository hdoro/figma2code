import { FiFolder } from 'react-icons/fi'
import validation from '../../utils/validation'
import { LIST_PAGE_FIELDS } from './blogPage'

export default {
  icon: FiFolder,
  name: 'category',
  type: 'document',
  title: 'Categoria',
  fields: [
    {
      name: 'meta',
      title: 'ℹ Informações de SEO para as páginas dessa categoria',
      description:
        '💡 Cada categoria tem uma ou mais páginas listando seus posts, dependendo da quantidade total. Essas informações se aplicam a todas elas.',
      type: 'categoryPageMeta'
    },
    ...LIST_PAGE_FIELDS.map(fld => {
      if (fld.name === 'title') {
        return {
          ...fld,
          description:
            '❓ Campo opcional. Caso não escreva nada, o título será o nome da categoria'
        }
      }
      return fld
    })
  ],
  preview: {
    select: {
      title: 'meta.title',
      subtitle: 'meta.body'
    }
  }
}
