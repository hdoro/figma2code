<script>
  import { onMount } from 'svelte'
  import { goto } from '@sapper/app'

  export let status
  export let error

  const dev = process.env.NODE_ENV === 'development'

  onMount(() => {
    const userLang = navigator.language || navigator.userLanguage
    if (userLang === 'pt' || userlang === 'pt-br') {
      goto('/pt/404')
    } else {
      goto('/404')
    }
  })
</script>

<svelte:head>
  <meta name="robots" content="noindex nofollow" />
  <title>Página não encontrada</title>
</svelte:head>

{#if dev}
  <section>
    <pre>{status}</pre>
    <pre>{JSON.stringify(error, null, 2)}</pre>
  </section>
{/if}
