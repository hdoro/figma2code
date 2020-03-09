import { getLangField, getLangTitle } from '../reusable/i18n'

export default {
  name: 'config',
  title: 'Configurações gerais',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    getLangField({
      title: 'Configuração para qual língua?'
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
      name: 'fallbackOgImage',
      title: '📸 Imagem para compartilhamento padrão',
      description:
        '⚡ Campo opcional mas altamente encorajado. Vai ser usada para o compartilhamento em redes sociais em páginas que não tiverem uma imagem customizada.',
      type: 'image'
    },
    {
      name: 'fallbackSeoDescription',
      title: '🖋 Descrição "meta" padrão',
      description:
        '⚡ Campo opcional mas altamente encorajado. Vai ser usada para o compartilhamento em redes sociais em páginas que não tiverem uma imagem customizada.',
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
      type: 'listPageMeta'
    }
  ],
  preview: {
    select: {
      lang: 'lang'
    },
    prepare({ lang }) {
      return { title: `Configurações - ${getLangTitle(lang)}` }
    }
  }
}
