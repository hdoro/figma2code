import { seoTitle, seoDescription, ogImage, scripts } from "../reusable/seo";

export default {
  type: 'object',
  title: 'Informações básicas da página inicial',
  name: 'homeMeta',
  fields: [
    seoTitle,
    seoDescription,
    ogImage,
    scripts
  ]
}
