<script>
  export let body
  export let tag
  export let className

  const classStr = className ? `class="${className}"` : ''
</script>

<!-- {#if body}
  {#if tag}
    {@html `
      <${tag} ${classStr}>${parseInlineMarkdown(body)}</${tag}>
    `}
  {:else}
    {#each body.split('\n') as p}
      {@html parseBlockMarkdown(p).replace('<p>', `<p ${classStr}>`)}
    {/each}
  {/if}
{/if} -->
