export const seoTitle = 
{
  name: 'seoTitle',
  title: 'Título de SEO',
  description:
    'Opcional mas altamente encorajado ⚡. Idealmente entre 30 e 65 caracteres',
  type: 'string',
  validation: Rule =>
    Rule.min(30)
      .max(65)
      .warning('Título idealmente entre 30 e 65 caracteres')
},

export const seoDescription = 
{
  name: 'seoDescription',
  title: 'Descrição "Meta"',
  description:
    'Opcional mas altamente encorajado ⚡. Idealmente entre 40 e 200 caracteres',
  type: 'text',
  rows: 3,
  validation: Rule =>
    Rule.min(40)
      .max(200)
      .warning('Descrição idealmente entre 40 e 200 caracteres')
}

export const ogImage = {
  name: 'ogImage',
  title: 'Imagem para mídia social',
  description:
    '❓ Campo opcional. Idealmente na dimensão 1200x628 para aparecer bem no Facebook, Instagram e LinkedIn. Pode ser a mesma da foto em destaque 😉',
  type: 'image'
}

export const scripts = 
{
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