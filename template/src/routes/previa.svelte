<script>
  import { onMount, afterUpdate } from 'svelte'
  import sanityClient from '@sanity/client'
  import { sanityId } from '../utils/config'
  import { formatDate } from '../utils/date.js'
  import { getHtml } from '../utils/portableText.js'
  import { watchImages } from '../scripts/lazyImageLoading.js'

  import { pageQuery, configQuery } from '../utils/queries.js'
  import PageTemplate from '../components/PageTemplate.svelte'

  // prettier-ignore
  const SCRIPT_TAG = '<script src="/preview.js"><\/script>'
  const getQueryVariable = variable => {
    if (typeof window === 'undefined' || !window || !window.location) {
      return
    }
    const query = window.location.search.substring(1)
    const vars = query.split('&')
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=')
      if (decodeURIComponent(pair[0]) == variable) {
        return decodeURIComponent(pair[1])
      }
    }
    console.error('Query variable %s not found', variable)
  }

  // Get the document's _id from the URL
  const docId = getQueryVariable('id')

  // Set-up the client without CDN for fresh data
  const client = sanityClient({
    dataset: 'production',
    projectId: sanityId,
    useCdn: false,
    withCredentials: true
  })

  // Content to show in case we don't find a page in the database,
  // which could happen either due to faulty login or to inexistent page
  const fallbackPage = {
    meta: {
      title: 'Página inexistente ou login inválido'
    },
    body: [
      {
        _type: 'titleCta',
        title: 'Página inexistente ou login inválido!',
        body:
          'Faça login no editor de conteúdo neste mesmo navegador que está usando e verifique se esta página selecionada existe no banco de dados.'
      }
    ]
  }

  // Props to be passed to the component
  let props = { content: {}, config: {} }

  const query = `
      {
        "content": *[_id == '${docId}'] { ${pageQuery} }[0],
        "config": *[_id == 'config'] { ${configQuery} }[0]
      }
    `

  const updateProps = data => {
    if (data.content._type === 'post') {
      data.content.createdAtFormatted = formatDate(data.content._createdAt)
      data.content.body = getHtml(data.content.body)
    }

    props = {
      content: data.content || fallbackPage,
      config: data.config
    }
  }

  // Whenever the client listener returns data, update props
  const dealWithData = () => {
    setTimeout(() => {
      // The results included in the listen function don't expand on references,
      // so we need to re-fetch the query every time
      client.fetch(query).then(updateProps)
    }, 100)
  }

  afterUpdate(() => {
    // If new images appear, we need to watch them for loading again
    const allImages = document.getElementsByClassName('lazy-img')
    watchImages(allImages)
  })

  onMount(() => {
    // If we have a document id, we can start updating the template
    if (docId) {
      // Start by fetching the query to get an initial data payload
      client.fetch(query).then(data => {
        // Then get initial props to render the page
        updateProps(data)
        // And start listening to changes
        client
          .listen(query, {}, { includeResult: false })
          .subscribe(dealWithData)
      })
    }
  })
</script>

<svelte:head>
  <meta name="robots" content="noindex nofollow" />
</svelte:head>

{#if docId && props.content._id && props.config._id}
  <PageTemplate data={props} />
{/if}

{@html SCRIPT_TAG}
