import { FaWhatsapp } from 'react-icons/fa'
import { FiLink, FiExternalLink } from 'react-icons/fi'
import validation from '../../utils/validation'

const newWindowFld = {
  name: 'newWindow',
  title: 'Abrir link em nova janela?',
  description: '❓ Opcional (o padrão é abrir na mesma)',
  type: 'boolean'
}

const absUrlFld = {
  name: 'url',
  title: 'Link / URL absoluta',
  description: `💡 Se quiser direcionar a uma página do site, use um link interno! Copie a URL inteira ao invés de apenas o domínio (Ex: https://kaordica.design ao invés de www.kaordica.design)`,
  type: 'url',
  validation: Rule =>
    Rule.required()
      .uri({
        allowRelative: false
      })
      .error('URL é obrigatória')
}

const pageLinkFld = {
  name: 'pageLink',
  title: 'Link para página no site',
  description: `💡 busque a página por título. Se não encontrar, verifique se ela já foi publicada!`,
  type: 'reference',
  to: [
    { type: 'home' },
    { type: 'blogPage' },
    { type: 'page' },
    { type: 'post' },
    { type: 'category' }
  ],
  validation: validation.default()
}

const labelFld = {
  name: 'label',
  title: 'Título ou rótulo do botão / link',
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

export const blockAbsUrl = {
  name: 'blockAbsUrl',
  type: 'object',
  title: 'Link p/ outros sites',
  icon: FiExternalLink,
  fields: [absUrlFld, newWindowFld]
}

export const blockPageLink = {
  name: 'blockPageLink',
  type: 'object',
  title: 'Link interno',
  icon: FiLink,
  fields: [pageLinkFld, newWindowFld]
}

const ctaPageLink = {
  name: 'ctaPageLink',
  title: 'Link interno (p/ outra página)',
  icon: FiLink,
  type: 'object',
  options: { collapsible: true },
  fields: [labelFld, pageLinkFld, newWindowFld]
}

const ctaAbsUrl = {
  name: 'ctaAbsUrl',
  title: 'Link para outro site',
  icon: FiExternalLink,
  type: 'object',
  options: { collapsible: true },
  fields: [labelFld, absUrlFld, newWindowFld]
}

const ctaWhatsApp = {
  name: 'ctaWhatsApp',
  title: 'Link para o WhatsApp',
  icon: FaWhatsapp,
  type: 'object',
  options: { collapsible: true },
  fields: [labelFld, newWindowFld]
}

export default [blockAbsUrl, blockPageLink, ctaPageLink, ctaAbsUrl, ctaWhatsApp]
