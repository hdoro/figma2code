<script context="module">
  export async function preload({ params, query }) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const res = await this.fetch(`/allPages.json`)
    const allPages = await res.json()

    if (res.status === 200) {
      return { allPages }
    } else {
      this.error(res.status, allPages.message)
    }
  }
</script>

<script>
  export let allPages
  console.log('\nPages built:', allPages)
</script>

<svelte:head>
  <meta name="robots" content="noindex nofollow" />
</svelte:head>

<ul>
  {#each allPages as page}
    <li>
      <a href={page.url}>{page.label}</a>
    </li>
  {/each}
</ul>
