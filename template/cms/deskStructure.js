import { FiHome, FiSettings } from 'react-icons/fi'
import { GiBrazilFlag } from 'react-icons/gi'
import { FaFlagUsa } from 'react-icons/fa'
import S from '@sanity/desk-tool/structure-builder'

import { SITE_LANGUAGES } from '../src/utils/config'

const LANG_ICONS = {
  pt: GiBrazilFlag,
  en: FaFlagUsa
}

const langs = SITE_LANGUAGES || []
function getHomepage() {
  const base = S.listItem()
    .title('Página inicial')
    .icon(FiHome)
  if (langs.length <= 1) {
    const homeId = ('home-' + langs[0] && langs[0].value) || 'default'
    return base.child(
      S.editor()
        .schemaType('home')
        .id(homeId)
        .documentId(homeId)
    )
  }
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
                .schemaType('home')
                .id(`home-${lang.value}`)
                .documentId(`home-${lang.value}`)
            )
        )
      )
  )
}

function getConfig() {
  const base = S.listItem()
    .title('Configurações gerais')
    .icon(FiSettings)
  if (langs.length <= 1) {
    const configId = ('config-' + langs[0] && langs[0].value) || 'default'
    return base.child(
      S.editor()
        .schemaType('config')
        .id(configId)
        .documentId(configId)
    )
  }
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
                .schemaType('config')
                .id(`config-${lang.value}`)
                .documentId(`config-${lang.value}`)
            )
        )
      )
  )
}

export default () =>
  S.list()
    .title('Conteúdo')
    .items([
      getHomepage(),
      S.documentTypeListItem('page').title('Páginas'),
      S.documentTypeListItem('post').title('Posts'),
      S.divider(),
      S.documentTypeListItem('category').title('Categorias'),
      S.documentTypeListItem('icon').title('Ícones'),
      S.divider(),
      getConfig()
    ])
