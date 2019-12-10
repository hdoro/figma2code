<script context="module">
  // Same as blog/1
  export async function preload() {
    const res = await this.fetch(`/blog/1.json`)
    const data = await res.json()

    if (res.status === 200 && data.posts.length) {
      return { data }
    } else {
      this.error(404, data.message || 'Page not found!')
    }
  }
</script>

<script>
  import BlogTemplate from '../../components/Blog/Blog.svelte'

  export let data
</script>

<BlogTemplate {data} />
