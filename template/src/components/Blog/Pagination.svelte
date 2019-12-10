<script>
  import { PAGINATION_LINKS_COUNT } from '../../utils/config'
  export let pageNum
  export let pageCount
  export let basePath

  const getHref = num => `${basePath}${num === 1 ? '' : `/${num}`}`

  const prevPages = Array.from({ length: pageNum - 1 }).map((p, i) => ({
    num: i + 1
  }))
  const nextPages = Array.from({ length: pageCount - pageNum }).map((p, i) => ({
    num: pageNum + i + 1
  }))
  const numberedPages = [
    // If we have more prevPages than PAGINATION_LINKS_COUNT
    // (PLC), show the first page as first
    ...(prevPages.length > PAGINATION_LINKS_COUNT ? [{ num: 1 }] : []),
    // If more prev pages than PLC + 1, add an empty object to
    // become an ellipsis implying skipped numbers
    ...(prevPages.length > PAGINATION_LINKS_COUNT + 1 ? [{}] : []),
    // Add only the amount of prevPages equivalent to PLC
    ...prevPages.slice(prevPages.length - PAGINATION_LINKS_COUNT),
    // Add the current page
    { num: pageNum },
    // Add the next pages but limit them to PLC
    ...nextPages.slice(0, PAGINATION_LINKS_COUNT),
    // And do the same ellipsis / last page that prevPages has
    ...(nextPages.length > PAGINATION_LINKS_COUNT + 1 ? [{}] : []),
    ...(nextPages.length > PAGINATION_LINKS_COUNT ? [{ num: pageCount }] : [])
  ]
</script>

<aside class="pagination section section_sm">
  {#if pageNum > 1}
    <a
      class="pagination__btn pagination__btn_prev"
      href={getHref(pageNum - 1)}
      title="Voltar à página anterior">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
      </svg>
    </a>
  {/if}
  {#each numberedPages as { num }, i (`${i}-${num}`)}
    {#if num === pageNum}
      <div class="pagination__num" aria-label="Página atual">{num}</div>
    {:else if isNaN(num)}
      <div class="pagination__ellipsis" aria-hidden="true">...</div>
    {:else}
      <a class="pagination__num" href={getHref(num)}>{num}</a>
    {/if}
  {/each}
  {#if pageNum < pageCount}
    <a
      class="pagination__btn"
      href={getHref(pageNum + 1)}
      title="Ir para próxima página">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
      </svg>
    </a>
  {/if}
</aside>
