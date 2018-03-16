export default function(article) {
  const { parent } = this.article
  return this.$store.getters['category/findCategory'](parent || '-')
}
