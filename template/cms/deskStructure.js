import { FiHome, FiSettings } from 'react-icons/fi'
import S from '@sanity/desk-tool/structure-builder'

export default () =>
  S.list()
    .title('Conteúdo')
    .items([
      S.listItem()
        .title('Página Inicial')
        .icon(FiHome)
        .child(
          S.editor()
            .id('home')
            .schemaType('home')
            .documentId('home')
        ),
      S.documentTypeListItem('page').title('Páginas'),
      S.documentTypeListItem('post').title('Posts'),
      S.documentTypeListItem('category').title('Categorias'),
      S.documentTypeListItem('icon').title('Ícones'),
      S.listItem()
        .title('Configurações gerais')
        .icon(FiSettings)
        .child(
          S.editor()
            .id('config')
            .schemaType('config')
            .documentId('config')
        )
    ])
