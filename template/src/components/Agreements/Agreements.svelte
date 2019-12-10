<script>
  import Markdown from '../Markdown.svelte'
  import Link from '../Link.svelte'

  export let title
  export let suptitle
  export let items = []
</script>

<style src="./agreements.postcss" global>

</style>

<section class="section section_lg">
  {#if suptitle}
    <h3 class="section__suptitle">{suptitle}</h3>
  {/if}
  <Markdown body={title} tag="h2" className="section__title" />
  <div class="agreement__wrapper">
    {#each items as item}
      <div class="grid__el agreement">
        {#if item.icon}
          {@html item.icon}
        {/if}
        <h3>{item.title}</h3>
        <Markdown body={item.body} />
      </div>
    {/each}
  </div>
</section>
