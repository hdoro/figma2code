import {
  SEO_FIELDSET,
  getSlugField,
  SEO_FIELDS,
  OG_IMAGE,
  SCRIPTS
} from './metaFields'
import validation from '../../../utils/validation'

export default {
  title: 'ℹ Informações básicas sobre o post',
  type: 'object',
  name: 'postMeta',
  fieldsets: [SEO_FIELDSET],
  fields: [
    {
      name: 'title',
      title: 'Título do post',
      type: 'string',
      validation: validation.default()
    },
    {
      name: 'subtitle',
      title: 'Subtítulo do post',
      description:
        '⚡ Campo opcional mas altamente encorajado. Vai aparecer abaixo do título na página do post e nas páginas do blog vai aparecer no cartão do post.',
      type: 'string'
    },
    getSlugField({
      title: 'Endereço relativo do post no site',
      description:
        '💡 Se este post for muito especial, você tem a opção de colocá-lo num endereço independente do blog (ex: "guia-definitivo-seo"), mas para a maioria deles é melhor incluir "blog" ou até "blog/nome-da-categoria" (ex: "blog/midias-sociais/mudancas-algoritimo-facebook-2020"). A escolha é sua 😉'
    }),
    {
      name: 'category',
      title: 'Categoria do post',
      description:
        '💡 você só pode escolher uma categoria que já esteja publicada no editor. Se não encontrou a que buscava, confira se ela foi criada e publicada',
      validation: validation.default(),
      type: 'reference',
      to: [{ type: 'category' }]
    },
    {
      name: 'publishDate',
      title: 'Data de publicação',
      description:
        '💡 vai aparecer no cabeçalho da página do post e no cartãozinho dele nas páginas do blog/categorias. Também mostramos essa data para os mecanismos de busca e redes sociais.',
      type: 'date',
      options: {
        calendarTodayLabel: 'Hoje'
      },
      validation: validation.default()
    },
    {
      name: 'updateDate',
      title: 'Data da última atualização',
      description:
        '❓ Campo opcional. Caso venham a atualizar esse artigo no futuro, é legal adicionar essa data para ajudar com o posicionamento da página nos mecanismos de busca.',
      type: 'date',
      options: {
        calendarTodayLabel: 'Hoje'
      }
    },
    {
      name: 'author',
      title: 'Autora(s) do artigo',
      description: '⚡ Campo opcional mas encorajado.',
      type: 'array',
      of: [
        {
          title: 'Pessoa da equipe',
          description:
            '💡 se não encontrar a pessoa que procura, verifique se ela foi publicada no menu "Equipe"',
          type: 'reference',
          to: [{ type: 'teamPerson' }]
        }
      ]
    },
    ...SEO_FIELDS,
    {
      ...OG_IMAGE,
      title: '📷 Imagem de destaque do post',
      description:
        '⚡ Campo opcional mas altamente encorajado. Vai aparecer no cabeçalho do post e no cartão dele nas páginas do blog, então é uma boa incluir para dar mais interesse visual ao artigo.'
    },
    SCRIPTS
  ]
}
