<style scoped lang="scss">
// @import "../../../../css/variables";
</style>

<template lang="pug">
.container-article-edit.section
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

  hr

  div
    pre {{ JSON.stringify(category, null, 2) }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  layout: 'simple',
  async fetch ({ store, params, error }) {
    const { s1, s2 } = params
    const parent = s1 === '-' ? null : s1
    if (!store.getters['article/getArticle'](parent, s2)) {
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
      const parent = s1 === '-' ? null : s1
      return this.$store.getters['article/getArticle'](parent, s2)
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
