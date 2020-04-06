<script context="module">
  export async function preload({ params, query }) {
    const res = await this.fetch(`/notFound.json?lang=pt`)

    if (res.status === 200) {
      const data = await res.json()
      return { data }
    } else {
      this.error(res.status, data.message)
    }
  }
</script>

<script>
  import NotFound from '../../components/NotFound/NotFoundTemplate.svelte'

  export let data
</script>

<NotFound {data} />
