<style scoped lang="scss">
@import "../../../../css/variables";
</style>

<template lang="pug">
.article
  nav.breadcrumb(aria-label="breadcrumbs")
    ul
      li
        nuxt-link(to="/") Home
      li(v-if="category")
        nuxt-link(:to="'/-/' + category.slug") {{ category.name }}
      li
        nuxt-link(:to="'/-/' + article.slug") {{article.title}}
      li.is-active
        nuxt-link(:to="'/-/' + article.slug + '/edit'") edit

  .article-heading
    my-markdown {{ article.content }}
    vue-editor(v-model="content")
</template>

<script>
import { mapState } from 'vuex'

export default {
  async fetch ({ store, params, error }) {
    await Promise.all([
      store.dispatch('article/getArticles'),
      store.dispatch('category/getCategories'),
    ])
    const { s1, s2 } = params
    const slug = s2 ? `${s1}/${s2}` : s1
    if (!store.getters['article/findArticle'](slug)) {
      error({
        statusCode:404,
        message: 'This page could not be found',
      })
    }
  },
  computed: {
    article() {
      const { s1, s2 } = this.$route.params
      const slug = s2 ? s1 + '/' + s2 : s1
      return this.$store.getters['article/findArticle'](slug)
    },
    category() {
      const splitted = this.article.slug.split('/')
      if (splitted.length < 2) {
        return null
      }
      const slug = splitted[0]
      const category = this.$store.getters['category/findCategory'](slug)
      return category || { slug, name: slug }
    },
    ...mapState([
      'authorized',
    ])
  },
}
</script>
