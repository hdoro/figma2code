<script>
  import Header from '../components/Header/Header.svelte'
  import Footer from '../components/Footer/Footer.svelte'
  import '../styles/404.standalone.sass'

  export let status
  export let error

  const dev = process.env.NODE_ENV === 'development'
</script>

<svelte:head>
  <meta name="robots" content="noindex nofollow" />
  <title>Página não encontrada</title>
  <link rel="stylesheet" href="/styles/404.css">
</svelte:head>

<Header />

<main class="err-pg">

  <h1>
    <div class="status">404</div>
    Página não encontrada 😥
  </h1>

  <p>
    Infelizmente esse endereço que você tentou acessar não existe... que tal
    <a href="/">voltar à página inicial</a>
    ?
  </p>
</main>

{#if dev}
  <section>
    <pre>{status}</pre>
    <pre>{JSON.stringify(error, null, 2)}</pre>
  </section>
{/if}

<Footer />
