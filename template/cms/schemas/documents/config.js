import { getLangField, getLangTitle } from '../../utils/i18n'

export default {
  name: 'config',
  title: 'Configurações gerais',
  type: 'document',
  fields: [
    getLangField({
      title: 'Configuração para qual língua?'
      // @TODO: set to hidden and readOnly after creating config documents
      // hidden: true,
      // readOnly: true
    }),
    {
      name: 'scripts',
      title: 'Códigos customizados para entrar no site',
      description:
        '🛑🤚 CUIDADO AO EDITAR ESSES CAMPOS! Um script malicioso ou mal feito pode destruir a performance, segurança e usabilidade do site. Contatem alguém que saiba o que está fazendo antes 😉',
      type: 'array',
      of: [
        {
          type: 'customScript'
        }
      ]
    },
    {
      name: 'fallbackSeoDescription',
      title: '🖋 Descrição "meta" padrão',
      description:
        '⚡ Campo opcional mas altamente encorajado. Vai ser aparecer no Google e no compartilhamento em redes sociais para páginas que não tiverem uma descrição customizada.',
      rows: 3,
      type: 'text'
    },
    {
      name: 'footerLinks',
      title: '🚢👣 Navegação do rodapé',
      description: '⚡ Campo opcional mas altamente encorajado',
      type: 'array',
      of: [
        {
          type: 'navLink'
        }
      ]
    },
    {
      name: 'headerLinks',
      title: '🚢 Links do cabeçalho (navbar)',
      description: '⚡ Campo opcional mas altamente encorajado.',
      type: 'array',
      of: [
        {
          type: 'navLink'
        }
      ]
    },
    {
      name: 'blog',
      title: 'Informações sobre as páginas do blog',
      description: 'Não se aplicam a páginas de categoria',
      type: 'listPageMeta',
      options: { collapsible: true, collapsed: true }
    }
  ],
  preview: {
    select: {
      id: '_id'
    },
    prepare({ id }) {
      const lang = id ? id.split('-')[1] : ''
      return {
        // Only display the language's name in the preview if we have more than one lang in the website
        title: `Configurações ${
          SITE_LANGUAGES.length > 1 ? getLangTitle(lang) : ''
        }`
      }
    }
  }
}
