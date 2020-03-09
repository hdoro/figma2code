import {
  DEFAULT_DECORATORS,
  DEFAULT_ANNOTATIONS
} from '../reusable/portableText'

export default {
  name: 'postBody',
  title: 'Corpo da página',
  description: '💡 Dica: edite em tela cheia, vai facilitar sua vida!',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Cabeçalho 2', value: 'h2' },
        { title: 'Cabeçalho 3', value: 'h3' },
        { title: 'Citação', value: 'blockquote' }
      ],
      marks: {
        decorators: [
          ...DEFAULT_DECORATORS,
          { title: 'Código "inline"', value: 'code' }
        ],
        annotations: DEFAULT_ANNOTATIONS
      }
    }
  ]
}
