import { FiLink } from 'react-icons/fi'
import { url } from '../../../src/utils/config'

const newWindowFld = {
  name: 'newWindow',
  title: 'Abrir link em nova janela?',
  description: '❓ Opcional (o padrão é abrir na mesma)',
  type: 'boolean'
}

const urlFld = {
  name: 'url',
  title: 'Link / URL',
  description: `Pode ser um link relativo (Ex: "sobre" levaria a ${url}/sobre) ou absoluto (Ex: https://kaordica.design)`,
  type: 'url',
  validation: Rule =>
    Rule.required()
      .uri({
        allowRelative: true
      })
      .error('URL é obrigatória')
}

const labelFld = {
  name: 'label',
  title: 'Título / rótulo do link',
  type: 'string',
  validation: Rule =>
    Rule.custom((value, { parent }) => {
      // Only error out if URL is defined.
      // If not, we conclude the CTA won't be used
      if (!!parent.url && !value) {
        return 'Título é obrigatório'
      }
      return true
    })
}

export const blockLink = {
  name: 'blockLink',
  type: 'object',
  title: 'Link',
  icon: FiLink,
  fields: [urlFld, newWindowFld]
}

export const navLink = {
  name: 'navLink',
  title: 'Link de navegação',
  type: 'object',
  options: { collapsible: true },
  fields: [labelFld, newWindowFld]
}

export const cta = {
  name: 'cta',
  title: 'Chamada para ação',
  type: 'object',
  options: { collapsible: true },
  fields: [
    labelFld,
    newWindowFld,
    {
      ...urlFld,
      validation: Rule => [
        // Currently, Sanity has a bug in which it won't allow relatives in `uri` with a custom validation, so we're removing the URI validation for now (commented below)
        /*
        Rule.uri({
          allowRelative: true,
        }).error('Not a valid URL'),
        */
        Rule.custom((value, { parent }) => {
          // Only error out if label is defined.
          if (!!parent.label && !value) {
            return 'URL é obrigatória'
          }
          return true
        })
      ],
      // Because of the lack of `uri` validation, we can't use type `url` or else it'll always fail for internal links
      type: 'string'
    }
  ]
}

export const ctaCaption = {
  ...cta,
  name: 'ctaCaption',
  title: 'Chamada para ação com legenda opcional',
  fields: [
    ...cta.fields,
    {
      name: 'caption',
      title: 'Legenda abaixo do botão / link',
      type: 'string',
      description: '❓ Campo opcional'
    }
  ]
}
