import validation from '../reusable/validation'

export default {
  type: 'object',
  title: 'Script customizado',
  name: 'customScript',
  fields: [
    {
      name: 'script',
      title: 'Código em HTML',
      description:
        'Se quiser adicionar algum Javascript ou CSS, colocar o código dentro de uma tag <script> ou <style>, respectivamente.',
      validation: validation.default(),
      rows: 10,
      type: 'text'
    },
    {
      name: 'type',
      title: 'Onde entra esse código',
      validation: validation.default(),
      options: {
        list: [
          {
            value: 'headEnd',
            title: 'Antes do fechamento do <head>'
          },
          {
            value: 'bodyStart',
            title: 'Logo na abertura do <body>'
          },
          {
            value: 'bodyEnd',
            title: 'Antes do fechamento do <body>'
          }
        ]
      },
      type: 'string'
    }
  ]
}
