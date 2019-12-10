<script>
  export let url
  export let label
  export let className = ''
  export let title = undefined

  const isExternal = url && url.includes('http')
</script>

{#if url && label}
  <a
    href={url}
    target={isExternal ? '_blank' : '_self'}
    rel={isExternal ? 'noopener' : ''}
    class={className}
    {title}>
    <slot />
    {label}
  </a>
{/if}
