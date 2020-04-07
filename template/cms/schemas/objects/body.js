import {
  DEFAULT_DECORATORS,
  DEFAULT_ANNOTATIONS
} from '../../utils/portableText'

const DEFAULT_MARKS = {
  decorators: [...DEFAULT_DECORATORS],
  annotations: DEFAULT_ANNOTATIONS
}

const DEFAULT_STYLES = [
  { title: 'Normal', value: 'normal' },
  { title: 'Cabeçalho 2', value: 'h2' },
  { title: 'Cabeçalho 3', value: 'h3' },
  { title: 'Citação', value: 'blockquote' }
]

const DEFAULT_BLOCK = {
  type: 'block',
  styles: DEFAULT_STYLES,
  marks: DEFAULT_MARKS
}

const pageBody = {
  name: 'pageBody',
  title: 'Corpo da página',
  description: '💡 Dica: edite em tela cheia, vai facilitar sua vida!',
  type: 'array',
  of: [DEFAULT_BLOCK]
}

const postBody = {
  name: 'postBody',
  title: 'Corpo do post',
  description: '💡 Dica: edite em tela cheia, vai facilitar sua vida!',
  type: 'array',
  of: [DEFAULT_BLOCK]
}

const homeBody = {
  name: 'homeBody',
  title: 'Corpo da home',
  description: '💡 Dica: edite em tela cheia, vai facilitar sua vida!',
  type: 'array',
  of: [DEFAULT_BLOCK]
}

export default [pageBody, postBody, homeBody]
