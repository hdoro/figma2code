<script>
  import components from './allComponents'
  import Header from './Header/Header.svelte'
  import Footer from './Footer/Footer.svelte'
  import SEOHead from './Head/SEOHead.svelte'

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

<style src="./Blog/post.postcss" global>

</style>

<SEOHead {meta} {config} {scripts} />

<Header links={config.headerLinks} />

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
