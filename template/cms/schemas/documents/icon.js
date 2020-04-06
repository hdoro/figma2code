import React from 'react'
import { FiHeart as icon } from 'react-icons/fi'

import './iconPreview.css?raw'
import validation from '../reusable/validation'

export default {
  name: 'icon',
  title: 'Ícone',
  icon,
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título pra identificação interna',
      type: 'string',
      validation: validation.default()
    },
    {
      name: 'svg',
      title: 'Código do ícone em svg',
      description:
        '🛑🤚 CUIDADO AO MODIFICAR! Apenas mexa neste código se souber o que está fazendo e caso já tenha assistido ao tutorial de ícones no Dashboard desse editor. Se for o caso: 1. evite os atributos "width" e "height"; 2. queremos apenas o "viewBox" desse SVG; 3. use "currentColor" para a cor; 4. para animações, encaixe um <style> dentro do próprio SVG; 5. Usar classes únicas, nomeadas segundo o título do ícone 😉',
      type: 'text',
      validation: validation.default(),
      rows: 10
    }
  ],
  preview: {
    select: {
      title: 'title',
      svg: 'svg'
    },
    prepare(selection) {
      const { title, svg } = selection
      return {
        title,
        media: (
          <div
            className="icon-preview icon-wrapper"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )
      }
    }
  }
}
