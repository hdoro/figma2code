import { FiHome, FiSettings, FiUsers, FiGrid } from 'react-icons/fi'
import { GiBrazilFlag } from 'react-icons/gi'
import { FaFlagUsa } from 'react-icons/fa'
import S from '@sanity/desk-tool/structure-builder'

import { SITE_LANGUAGES } from '../../src/utils/config'

// In case we ever need a multi-lang website
const LANG_ICONS = {
  pt: GiBrazilFlag,
  en: FaFlagUsa
}

const langs = SITE_LANGUAGES || []

function getLocalizedSingleton({ icon, title, type }) {
  const base = S.listItem()
    .title(title)
    .icon(icon)

  // If we only have 1 language, return a single document
  if (langs.length <= 1) {
    const pageId = `${type}-${langs[0] ? langs[0].value : 'default'}`
    return base.child(
      S.editor()
        .schemaType(type)
        .id(pageId)
        .documentId(pageId)
    )
  }

  // Else return a list with the available languages
  return base.child(
    S.list()
      .title('Línguas')
      .items(
        SITE_LANGUAGES.map(lang =>
          S.listItem()
            .title(lang.title)
            .icon(LANG_ICONS[lang.value])
            .child(
              S.editor()
                .schemaType(type)
                .id(`${type}-${lang.value}`)
                .documentId(`${type}-${lang.value}`)
            )
        )
      )
  )
}

export default () =>
  S.list()
    .title('Conteúdo')
    .items([
      getLocalizedSingleton({
        type: 'home',
        title: 'Página inicial',
        icon: FiHome
      }),
      S.documentTypeListItem('page')
        .id('pagina')
        .title('Páginas genéricas'),
      S.documentTypeListItem('post').title('Posts'),
      getLocalizedSingleton({
        type: 'blogPage',
        title: 'Página do blog',
        icon: FiGrid
      }),
      S.divider(),
      S.documentTypeListItem('teamPerson')
        .id('equipe')
        .title('Equipe')
        .icon(FiUsers),
      S.documentTypeListItem('category')
        .id('categoria')
        .title('Categorias'),
      S.documentTypeListItem('icon')
        .id('icone')
        .title('Ícones'),
      S.divider(),
      getLocalizedSingleton({
        type: 'config',
        title: 'Configurações gerais',
        icon: FiSettings
      })
    ])
