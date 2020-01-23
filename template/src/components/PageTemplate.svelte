<script>
  import components from './allComponents'
  import Header from './Header/Header.svelte'
  import Footer from './Footer/Footer.svelte'
  import SEOHead from './Head/SEOHead.svelte'

  import './Blog/post.standalone.sass'

  export let data

  $: config = data.config
  $: content = data.content
  $: meta = content.meta || {}
  $: body = content.body || []

  $: contentScripts = meta.scripts || []
  $: globalScripts = config.scripts || []
  $: scripts = [...globalScripts, ...contentScripts]

  $: isPost = content._type === 'post'
</script>

<SEOHead {meta} {config} {scripts} />

<Header links={config.headerLinks} />

<svelte:head>
  {#if isPost}
    <link rel="stylesheet" href="/styles/post.css">
  {/if}
</svelte:head>

{#if isPost}
  <main class="post section section_lg">
    <header>
      {#if content.showCategory}
        <a
          class="post__cat"
          rel="tag"
          title="Categoria deste artigo"
          href="/blog/{meta.category.slug}">
          {meta.category.title}
        </a>
      {/if}
      <h1>{meta.title}</h1>
      <div class="post__date" aria-label="Data de publicação">
        {content.createdAtFormatted}
      </div>
    </header>
    {@html content.body}
  </main>
{:else}
  <main>
    {#each body as block}
      <svelte:component
        this={components[block._type.toLowerCase()]}
        {...block} />
    {/each}
  </main>
{/if}

<Footer {scripts} links={config.footerLinks} address={config.address} />
