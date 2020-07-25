import validation from '../../utils/validation'

const SCRIPT_TYPES = [
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
        list: SCRIPT_TYPES
      },
      type: 'string'
    }
  ],
  preview: {
    select: {
      script: 'script',
      type: 'type'
    },
    prepare({ script, type }) {
      const title = SCRIPT_TYPES.find(t => t.value === type).title
      return {
        title,
        subtitle: script
      }
    }
  }
}
