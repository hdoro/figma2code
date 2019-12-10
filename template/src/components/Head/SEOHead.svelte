<script>
  import getImageUrl from '../../utils/getImageUrl'
  import getSchema from '../../utils/getSchema'
  import { url as baseUrl, siteName } from '../../utils/config'

  export let meta
  export let config
  export let scripts = []

  const path = (meta.slug && meta.slug.current) || ''
  const { title, seoTitle, seoDescription } = meta
  const ogImage = meta.ogImage || config.fallbackOgImage
  const ogType = path === '' ? 'Organization' : 'Website'

  const lang = 'pt'

  const url = `${baseUrl}/${path}`
</script>

<svelte:head>

  <title>{seoTitle || title || siteName}</title>
  <meta name="description" content={seoDescription} />
  <meta name="og:description" content={seoDescription} />
  <meta name="og:site_name" content={siteName} />
  <meta name="og:title" content={title} />
  <meta name="og:type" content={ogType} />
  {#if ogImage && ogImage.asset && ogImage.asset._ref}
    <!-- CREATING OUR SET OF OG:IMAGES -->
    <!-- Start with the ideal 1200w image -->
    <meta
      name="og:image"
      content={getImageUrl({ image: ogImage, width: 1200 })} />
    <meta property="og:image:width" content="1200" />

    <!-- Provide a 300w fallback for WhatsApp and the likes -->
    <meta
      name="og:image"
      content={getImageUrl({ image: ogImage, width: 300 })} />
    <meta property="og:image:width" content="300" />
  {/if}

  {#if url}
    <link rel="canonical" href={url} />
  {/if}

  {#if !meta.indexable && path !== ''}
    <meta name="robots" content="noindex nofollow" />
  {/if}

  {@html getSchema({
    type: path === '' ? 'Organization' : 'WebPage',
    url,
    title,
    image: ogImage,
    breadcrumbs:
      meta.breadcrumbs && meta.breadcrumbs.include && meta.breadcrumbs.links,
    socialMedia: config.socialMedia
  })}

  {#each scripts.filter(s => s.type === 'headEnd') as { script }}
    {@html script}
  {/each}
</svelte:head>

{#each scripts.filter(s => s.type === 'bodyStart') as { script }}
  {@html script}
{/each}
