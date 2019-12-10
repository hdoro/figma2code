<script context="module">
  export async function preload({ params }) {
    // the `slug` parameter is available because
    // this file is called [...slug].svelte
    const res = await this.fetch(`/pages/${params.slug.join('/')}.json`)
    const data = await res.json()

    if (res.status === 200) {
      return { data }
    } else {
      this.error(404, data.message || 'Page not found!')
    }
  }
</script>

<script>
  import PageTemplate from '../components/PageTemplate.svelte'

  export let data
</script>

<PageTemplate {data} />
