<script>
  import { setContext } from 'svelte'

  import Layout from '../Layout.svelte'
  import Button from '../Button/Button.svelte'

  import { translate } from '../../utils/i18n'

  export let data

  // Set context before layout to be used in the Layout meta object
  setContext('lang', data.config.lang)
</script>

<style>
  .section {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
  }
  .content {
    flex: 1;
    max-width: 80rem;
    min-width: 50rem;
  }
  @media (min-width: 500px) {
    .content {
      margin-right: 22.5rem;
    }
  }
</style>

<svelte:head>
  <meta name="robots" content="noindex nofollow" />
</svelte:head>

<Layout config={data.config} meta={{ title: translate('notFound.headTitle') }}>
  <div class="section section_lg">
    <div class="content">
      <h1>{translate('notFound.title')}</h1>
      <p>{translate('notFound.body')}</p>
      <Button
        label={translate('notFound.btnTitle')}
        url={translate('notFound.homeUrl')} />
    </div>
  </div>
</Layout>
