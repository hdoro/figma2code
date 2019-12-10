<script>
  import { afterUpdate } from 'svelte'
  import getFixed from './getFixed'
  import getFluid from './getFluid'

  export let image = {}
  export let fluid = undefined
  export let fixed = undefined
  export let sizes = undefined
  export let alt = undefined
  export let className = undefined

  const altText = alt || image.alt
  let aspectRatio
  let format

  if (image && image.asset) {
    // example asset._ref:
    // image-7558c4a4d73dac0398c18b7fa2c69825882e6210-366x96-png
    // When splitting by '-' we can extract the dimensions and format
    const [, , dimensions, imgFormat] = image.asset._ref.split('-')
    // Dimensions come as 366x96 (widthXheight), so we split it into an array and
    // transform each entry into actual numbers instead of strings
    const [srcWidth, srcHeight] = dimensions
      .split('x')
      .map(num => parseInt(num, 10))
    // The aspect ratio is used by fluid images to set the spacer's padding-bottom
    aspectRatio = srcWidth / srcHeight
    format = imgFormat
  }
  const { src, srcset, webpsrcset, width, height, style, finalSizes } = fixed
    ? getFixed({ image, fixed, aspectRatio, format })
    : getFluid({ image, fluid, sizes, format })
</script>

<style lang="postcss" src="./lazyImage.postcss" global>

</style>

{#if image && image.asset && image.asset._ref && (fluid || fixed)}
  <div
    {style}
    class={`lazy-img wrapper ${fluid ? 'fluid' : 'fixed'} ${className || ''}`}
    aria-hidden={!altText}
    data-alt={altText}
    data-src={src}
    data-srcset={srcset}
    data-webpsrcset={webpsrcset}
    data-sizes={finalSizes}>

    <!-- If fluid, include a spacer to avoid layout shifts -->
    {#if fluid}
      <div
        style={`width: 100%; padding-bottom: ${100 / aspectRatio}%`}
        aria-hidden="true" />
    {/if}

    <div class="lazy-img__container" />

    <noscript>
      <img {srcset} {src} alt={altText} sizes={finalSizes} />
    </noscript>
  </div>
{/if}
