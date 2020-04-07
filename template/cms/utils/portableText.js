import { blockLink } from '../schemas/objects/links'

export const DEFAULT_DECORATORS = [
  { title: 'Strong', value: 'strong' },
  { title: 'Emphasis', value: 'em' }
]

export const DEFAULT_ANNOTATIONS = [blockLink]

export default ({
  title = 'Title',
  description,
  name = 'body',
  lists = [],
  styles = [],
  annotations = DEFAULT_ANNOTATIONS,
  decorators = DEFAULT_DECORATORS,
  ...rest
}) => {
  return {
    title,
    description,
    name,
    type: 'array',
    of: [
      {
        type: 'block',
        lists,
        styles,
        marks: {
          decorators,
          annotations
        }
      }
    ],
    ...rest
  }
}
