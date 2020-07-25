import { FiBell, FiSquare } from 'react-icons/fi'

import blockPreview from '../../utils/blockPreview'

export const CTA_FIELD = {
  name: 'ctas',
  title: 'Chamadas para ação',
  description: '❓ Campo opcional',
  type: 'array',
  of: [{ type: 'ctaPageLink' }, { type: 'ctaAbsUrl' }, { type: 'ctaWhatsApp' }]
}

const BASE_FIELDS = [
  {
    name: 'title',
    title: 'Título',
    type: 'string',
    description: '❓ Campo opcional'
  },
  {
    name: 'body',
    title: 'Corpo de texto abaixo do título',
    type: 'richParagraph',
    description: '❓ Campo opcional'
  }
]

// Example CTA variation
const iconCta = {
  name: 'iconCta',
  title: 'Chamada com ícone 💎',
  icon: FiBell,
  type: 'object',
  fields: [
    {
      name: 'icon',
      title: 'Ícone da chamada',
      type: 'reference',
      description: '❓ Campo opcional',
      to: [{ type: 'icon' }]
    },
    ...BASE_FIELDS,
    CTA_FIELD
  ]
}

const ctaRow = {
  name: 'ctaRow',
  title: 'Botões / chamadas soltas',
  icon: FiSquare,
  type: 'object',
  fields: [CTA_FIELD]
}

export default [
  { ...iconCta, preview: blockPreview(iconCta) },
  { ...ctaRow, preview: blockPreview(ctaRow) }
]
