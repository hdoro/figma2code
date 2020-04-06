export default {
  widgets: [
    {
      name: 'document-list',
      options: {
        title: 'Páginas do site',
        order: '_updatedAt desc',
        types: ['home', 'page']
      }
    },
    {
      name: 'thanks',
      layout: {
        width: 'large'
      }
    }
  ]
}
