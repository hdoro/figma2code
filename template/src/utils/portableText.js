import blocksToHtml from '@sanity/block-content-to-html'

import LazyImage from '../components/LazyImage/LazyImage.svelte'
import { SANITY_CONFIG } from './config'

const h = blocksToHtml.h

// All unnecessary tags will be named like this to be replaced
const removableTag = 'markee'

// In order to avoid hyperscript escaping our markup, we render
// the components as the innerHTML of a removable tag
const render = ({ p, c }) => h(removableTag, { innerHTML: c.render(p) })

const serializers = {
  // blocksToHtml includes a wrapping <div> element, which we
  // don't want. So we add a specific tag as the container to be
  // removed via regex
  container: removableTag,
  types: {
    image: props =>
      render({
        p: { image: props.image, fluid: { maxWidth: 950 } },
        c: LazyImage
      })
  }
}

export function getHtml(blocks = []) {
  // RegEx for removing unnecessary tags
  const removableRegex = new RegExp(`(</|<)${removableTag}>`, 'g')
  return blocksToHtml({
    blocks,
    serializers,
    renderContainerOnSingleChild: false,
    ...SANITY_CONFIG
  }).replace(removableRegex, '')
}

export function toPlainText(blocks = []) {
  return (
    blocks
      // loop through each block
      .map(block => {
        // if it's not a text block with children,
        // return nothing
        if (block._type !== 'block' || !block.children) {
          return ''
        }
        // loop through the children spans, and join the
        // text strings
        return block.children.map(child => child.text).join('')
      })
      // join the parapgraphs leaving split by two linebreaks
      .join('\n\n')
  )
}
