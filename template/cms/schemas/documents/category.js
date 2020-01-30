import { FiFolder } from 'react-icons/fi'

export default {
  icon: FiFolder,
  name: 'category',
  type: 'document',
  title: 'Categoria',
  fields: [
    {
      name: 'slug',
      type: 'slug',
      title: 'Endereço relativo da categoria',
      description:
        'É adicionado depois de /blog. Ex: primeiro-post se tornaria /blog/primeiro-post 😉',
      source: 'meta.title',
      validation: Rule => Rule.required().error('Campo obrigatório')
    },
    {
      name: 'meta',
      title: 'Informações sobre as páginas da categoria',
      type: 'listPageMeta'
    }
  ],
  preview: {
    select: {
      title: 'meta.title',
      subtitle: 'meta.body'
    }
  }
}
