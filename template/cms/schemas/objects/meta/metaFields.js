import validation from '../../../utils/validation'
import isSlugUnique from '../../../utils/isSlugUnique'

const DEFAULT_SLUG_TITLE = 'Endereço relativo no site'
const DEFAULT_SLUG_DESC =
  'Exemplo: "sobre/equipe" se tornaria uma página em https://compoa.com.br/sobre/equipe'

export const getSlugField = ({
  title = DEFAULT_SLUG_TITLE,
  description = DEFAULT_SLUG_DESC
} = {}) => ({
  name: 'slug',
  type: 'slug',
  title,
  description,
  source: 'meta.title',
  validation: validation.default({
    errMsg: 'Endereço relativo único é obrigatório'
  }),
  options: {
    source: 'meta.title',
    isUnique: isSlugUnique
  }
})

export const SEO_TITLE = {
  name: 'seoTitle',
  title: 'Título de SEO',
  description:
    'Opcional mas altamente encorajado ⚡. Idealmente entre 30 e 65 caracteres',
  type: 'string',
  validation: validation.text({
    optional: true,
    min: 30,
    max: 65,
    errMsg: 'Título idealmente entre 30 e 65 caracteres'
  })
}

export const SEO_DESCRIPTION = {
  name: 'seoDescription',
  title: 'Descrição "Meta"',
  description:
    'Opcional mas altamente encorajado ⚡. Idealmente entre 40 e 200 caracteres',
  type: 'text',
  rows: 3,
  validation: validation.text({
    optional: true,
    min: 30,
    max: 200,
    errMsg: 'Descrição idealmente entre 30 e 200 caracteres'
  })
}

export const OG_IMAGE = {
  name: 'ogImage',
  title: 'Imagem para mídia social',
  description:
    '❓ Campo opcional. Idealmente na dimensão 1200x628 para aparecer bem no Facebook, Instagram e LinkedIn. Pode ser a mesma da foto em destaque 😉',
  type: 'image'
}

export const SCRIPTS = {
  name: 'scripts',
  title: '🤖 Códigos customizados para entrar na página',
  description:
    '🛑🤚 CUIDADO AO EDITAR ESSES CAMPOS! Um script malicioso ou mal feito pode destruir a performance, segurança e usabilidade do site. Contatem alguém que saiba o que está fazendo antes 😉',
  type: 'array',
  of: [
    {
      type: 'customScript'
    }
  ]
}

export const SEO_FIELDSET = {
  name: 'seo',
  title: '🔍 Campos para SEO',
  description:
    'Não obrigatórios, mas é uma boa pra reforçar o posicionamento do site no Google!',
  options: { collapsible: true }
}

export const SEO_FIELDS = [
  { ...SEO_TITLE, fieldset: 'seo' },
  { ...SEO_DESCRIPTION, fieldset: 'seo' },
  {
    name: 'indexable',
    title: 'Indexar essa página no Google?',
    description: 'Se negativo, vamos bloquear os robôs do Google, Bing, etc.',
    fieldset: 'seo',
    validation: validation.default(),
    type: 'boolean'
  }
]
