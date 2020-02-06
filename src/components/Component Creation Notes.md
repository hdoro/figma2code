## Goals

- Generate `.svelte` components
  - Class names
  - `export let` props
    - if not required, `export let PROP_NAME = undefined`
  - `{#if}` conditionals for non-required props
  - `{#each}` for arrays
    - @TODO: find a good way to denotate arrays in Figma
  - import used components
    - there are the common ones such as `Markdown`, used by `(body)` props
    - but also dynamic ones such as a `Person` component, demarked by a non-standard `[cmsType]`
  - import `.sass` file inside the `script`
  - for images' treat them as `fluid` and parse their `maxWidth` from their size
  - Get SVG and add it as a component
    - Figma's API doesn't show the SVG inline, it requires extra API calls
    - These API calls, in turn, return URLs pointing to the SVGs, so we'd have to set-up quite the process for this
    - See https://www.figma.com/developers/api#get-images-endpoint
    - Non-urgent! Maybe just create a blank `components/icons/ICON_NAME.svelte`, import it and add it in the markup
- Generate `.sass` files in the same folder as the component's
  - generate as much style as possible
  - `max-width` and `font-size` should use the `getRem` function
    - ex: `getRem(1200px)`
  - For defined styles, `@include ${style.name}`
    - `stroke`, `fill`, `text` and `effect`. Ignore `grid` styles
    - `fill` styles are `color` for text and `background` for rectangles and the likes
      - For fill `@mixin`s, use `@include fill-name(property-name)`
  - for type, get `textAlignHorizontal`
  - if `contraints.horizontal === 'CENTER'`, `margin-left: auto` & `margin-right: auto`?
- Add `.svelte` components to the `allComponents.js` file

## Solutions

- Class names will follow the BEM styleguide
  - The wrapper will be `component-name`
  - Children will be named in the following order:
  - `component-name__original-name`
  - `component-name__prop-name`
  - if no `originalName` or `propName`, children will be left classless
- We'll wrap children in a tag if the component contains a `htmlTag`
- Children without `htmlTag` will be ignored
  - special case: `propName` is defined and it corresponds to known use cases such as `(body)`
- parse components into a tree with the following structure

```js
let components = {
  // object key is the `_meta.componentName`
  Hero: {
    usedComponents: ['LazyImage', 'Markdown', 'Person'],
    props: {
      title: {
        required: true
      },
      body: {
        required: false
      }
    },
    syles: {
      hero__title: {
        'font-size': '48px',
        extended: {
          color: '67:125',
          effect: '23:130'
        }
      }
    },
    markup: [
      {
        tag: 'h1',
        propName: 'title',
        classNames: 'hero__title'
      },
      {
        component: 'LazyImage',
        propName: 'image',
        props: {
          maxWidth: 800
        }
      },
      {
        tag: 'div',
        children: [
          {
            component: 'Markdown',
            propName: 'body',
            props: {
              body: 'body'
            }
          }
        ]
      },
      {
        tag: 'div', // optional for arrays
        propName: 'ctas',
        isArray: true,
        children: [
          {
            tag: 'navLink',
            propName: 'cta'
          }
        ]
      }
    ]
  }
}
```

- and then generate the files out of this

## Open questions

- How to name icons? `originalName`?
