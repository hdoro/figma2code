export default {
  name: 'config',
  title: 'Configurações gerais',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
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
      description:
        '⚡ Campo opcional mas altamente encorajado.',
      type: 'array',
      of: [
        {
          type: 'navLink'
        }
      ]
    },
    {
      name: 'address',
      title: 'Endereço',
      description: '❓ Campo opcional',
      type: 'string'
    },
    {
      name: 'blog',
      title: 'Informações sobre as páginas do blog',
      description: 'Não se aplicam a páginas de categoria',
      type: 'listPageMeta'
    }
  ],
  preview: {
    select: {},
    prepare() {
      return { title: 'Configurações gerais' }
    }
  }
}
