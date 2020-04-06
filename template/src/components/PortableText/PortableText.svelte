<script>
  import BlockContent from '@movingbrands/svelte-portable-text'

  export let body
</script>

{#if Array.isArray(body) && body.length}
  <BlockContent blocks={body} />
{/if}
