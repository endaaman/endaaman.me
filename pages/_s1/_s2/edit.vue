<style scoped lang="scss">
// @import "../../../../css/variables";
</style>

<template lang="pug">
.container-article-edit
  form
    .field.is-horizontal
      .field-label.is-normal
        label.label Slug
      .field-body
        .field
          .control.is-expanded
            input.input(type="text" placeholder="Name")

    .field.is-horizontal
      .field-label.is-normal
        label.label Dep
      .field-body
        .field.is-narrow
          .control
            .select.is-fullwidth
              select
                option hoge
                option fuga
                option piyo

  div
    pre {{ JSON.stringify(article, null, 2) }}

  div
    pre {{ JSON.stringify(category, null, 2) }}
</template>

<script>
import { mapState } from 'vuex'

function toSlug(s1, s2) {
  return (s1 === '-' ? '' : s1 + '/') + s2
}

export default {
  layout: 'simple',
  async fetch ({ store, params, error }) {
    const { s1, s2 } = params
    if (!store.getters['article/findArticle'](toSlug(s1, s2))) {
      error({
        statusCode: 404,
        message: 'This article could not be found',
      })
    }
  },
  validate({ store }) {
    return store.state.authorized
  },
  computed: {
    article() {
      const { s1, s2 } = this.$route.params
      const slug = toSlug(s1, s2)
      return this.$store.getters['article/findArticle'](slug)
    },
    category() {
      const splitted = this.article.slug.split('/')
      if (splitted.length < 2) {
        return {
          slug: '-',
          name: '雑記',
        }
      }
      const slug = splitted[0]
      const category = this.$store.getters['category/findCategory'](slug)
      return category || { slug, name: slug }
    },
  },
}
</script>
