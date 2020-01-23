<script>
  import Markdown from '../Markdown.svelte'
  import Logo from '../Logo.svelte'
  import Link from '../Link.svelte'
  import Header from '../Header/Header.svelte'
  import Footer from '../Footer/Footer.svelte'
  import SEOHead from '../Head/SEOHead.svelte'
  import Pagination from './Pagination.svelte'

  import './blog.standalone.sass'

  import { toPlainText } from '../../utils/portableText'
  import { PAGINATION_SIZE } from '../../utils/config'

  export let data

  $: posts = data.posts || []
  $: pageNum = data.pageNum
  $: config = data.config || {}
  $: info = data.pageInfo.meta || {}

  $: scripts = config.scripts
  // As we round posts.length / pagination_size, there are cases
  // in which pageCount = 0, which we don't want, min is 1
  $: pageCount = data.pageCount || 1
</script>

<SEOHead meta={info} {config} {scripts} />

<svelte:head>
  <link rel="stylesheet" href="/styles/blog.css">
</svelte:head>

<Header links={config.headerLinks} />
<main class="section section_lg">
  <div class="blog__header">
    <h1>
      <Logo />
      {info.title}
    </h1>
    {#if info.body}
      <Markdown body={info.body} />
    {/if}
  </div>
  <div class="blog__container">
    {#each posts as { meta, excerpt, ...post }}
      <article class="blog__preview">
        {#if !data.isCategory && post.showCategory}
          <a
            class="blog__cat"
            rel="tag"
            title="Categoria deste artigo"
            href="/blog/{meta.category.slug}">
            {meta.category.title}
          </a>
        {/if}
        <h2>
          <Link
            url={`/${meta.slug.current}`}
            label={meta.title}
            title="Ler artigo completo" />
        </h2>
        <div class="blog__date" aria-label="Data de publicação">
          {post.createdAtFormatted}
        </div>
        {#if excerpt}
          <p>{toPlainText(excerpt).slice(0, 150)}...</p>
        {/if}
        <a href="/{meta.slug.current}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
          </svg>
          Ler artigo
        </a>
      </article>
    {/each}
  </div>
</main>

{#if pageCount > 1}
  <Pagination
    {pageCount}
    {pageNum}
    basePath="/blog{data.isCategory ? `/${info.slug}` : ''}" />
{/if}

<Footer {scripts} links={config.footerLinks} address={config.address} />
