import { url } from "../../../src/utils/config";

export default {
  type: 'object',
  title: 'Link com título',
  name: 'navLink',
  fields: [
    {
      name: 'label',
      title: 'Título / texto do link',
      validation: Rule => [
        Rule.max(30).warning('Evite ultrapassar 30 caracteres no texto do link')
      ],
      type: 'string'
    },
    {
      name: 'url',
      title: 'Destino do link (URL)',
      description:
        `Pode ser um link relativo (Ex: "sobre" levaria a ${url}/sobre) ou absoluto (Ex: https://kaordica.design)`,
      validation: Rule =>
        Rule.optional()
          .uri({ allowRelative: true })
          .error('Por favor insira um link válido'),
      type: 'string'
    }
  ]
}
