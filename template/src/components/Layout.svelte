<script>
  import { setContext } from 'svelte'

  import Header from './Header/Header.svelte'
  import Footer from './Footer/Footer.svelte'
  import SEOHead from './Head/SEOHead.svelte'

  import { translate } from '../utils/i18n'

  export let config = {}
  export let meta = {}

  $: contentScripts = meta.scripts || []
  $: globalScripts = config.scripts || []
  $: scripts = [...globalScripts, ...contentScripts]

  // To be access by any component that deals with i18n
  setContext('lang', config.lang)
</script>

<SEOHead {meta} {config} {scripts} />

<Header links={config.headerLinks} />

<main>
  <slot />
</main>

<Footer {...config} />

<aside aria-hidden="true" class="modal" id="modal" role="dialog">
  <button id="modal-close" class="modal__close" title={translate('modalClose')}>
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round">
      <path d="M13 1L1 13" />
      <path d="M1 1L13 13" />
    </svg>

  </button>
  <main />
</aside>
<div class="modal__overlay" id="modal-overlay" aria-hidden tabindex="-1" />
