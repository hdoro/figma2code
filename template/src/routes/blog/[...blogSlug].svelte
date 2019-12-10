<script context="module">
  export async function preload({ params: { blogSlug: slug } }) {
    console.time('Fetching post category')
    // Assume the default type to be a post
    let endpoint = `/pages/${slug.join('/')}.json`

    // If we have /blob/1 (/blog/pageNum), render post list
    if (slug.length === 1 && !isNaN(slug[0])) {
      endpoint = `/blog/${slug[0]}.json`
    }
    // But if we have the following scenarios, render category
    // ✅ /blog/catName
    // ✅ /blog/catName/1 (pageNum)
    // ❌ /blog/catName/postName
    // ❌ /blog/catName/1/anotherPath
    else if (slug.length === 1 || (slug.length === 2 && !isNaN(slug[1]))) {
      try {
        const catReq = await this.fetch('/allCategories.json')
        const allCategories = await catReq.json()
        const isCategory =
          allCategories.categories.map(c => c.slug).indexOf(slug[0]) >= 0
        if (isCategory) {
          endpoint = `/blog/${slug.join('/')}.json`
        }
      } catch (error) {
        console.error(error)
      }
    }

    const res = await this.fetch(endpoint)
    const data = await res.json()
    console.timeEnd('Fetching post category')

    if (res.status === 200) {
      return { data }
    } else {
      this.error(404, data.message || 'Page not found!')
    }
  }
</script>

<script>
  import BlogTemplate from '../../components/Blog/Blog.svelte'
  import PageTemplate from '../../components/PageTemplate.svelte'

  export let data
</script>

{#if data.posts}
  <BlogTemplate {data} />
{:else if data.content}
  <PageTemplate {data} />
{/if}
