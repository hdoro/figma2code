<script context="module">
  export async function preload({ params, query }) {
    const res = await this.fetch(`/index.json?lang=en`)

    if (res.status === 200) {
      const data = await res.json()
      return { data }
    } else {
      this.error(res.status, data.message)
    }
  }
</script>

<script>
  import PageTemplate from '../../components/PageTemplate.svelte'

  export let data
</script>

<pre>{JSON.stringify(data, null, 2)}</pre>
<PageTemplate {data} />
