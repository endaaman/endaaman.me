<style scoped lang="scss">
@import "../../../css/variables";

.article-heading {
  margin: 32px 0;
}

.article-title {
  font-size: 36px;
  line-height: 48px;
  margin: 8px 0;
  text-align: center;
}

.article-digest {
  font-size: 16px;
  line-height: 24px;
  margin: 8px 0;
  text-align: center;
}

.article-subs {
  margin: 16px auto;
  text-align: center;
}

.article-sub {
  display: inline-block;
  margin: 0 4px;
  .tag {
    line-height: 22px;
  }
}

.article-delimiter {
  margin: 16px auto;
  width: 128px;
  height: 2px;
  background-color: $black-ter;
}
</style>

<template lang="pug">
.container-article-show
  nav.breadcrumb(aria-label="breadcrumbs")
    ul
      li
        nuxt-link(to="/") Home
      li
        nuxt-link(:to="'/archive?category=' + category.slug") {{ category.name }}
      li
        nuxt-link(:to="'/' + category.slug + '/' + article.slug") {{ article.title }}

  .article-heading
    h1.article-title {{ article.title }}
    h2.article-digest(v-if="article.digest") {{ article.digest }}
    .article-subs
      .article-sub {{ article.date | date }}
      .article-sub(v-if="article.tags.length > 0") ・
      .article-sub(v-for="tag in article.tags")
        nuxt-link.tag.is-white(:to="'/archive?tag=' + tag") {{ tag }}
      .article-sub(v-if="authorized")
        nuxt-link(:to="'/-/' + article.slug + '/edit'") edit
    .article-delimiter
  div
    my-markdown {{ article.content }}
</template>

<script>
import { mapState } from 'vuex'


function toSlug(s1, s2) {
  return (s1 === '-' ? '' : s1 + '/') + s2
}

export default {
  async fetch ({ store, params, error }) {
    await Promise.all([
      store.dispatch('article/getArticles'),
      store.dispatch('category/getCategories'),
    ])

    const { s1, s2 } = params
    if (!store.getters['article/findArticle'](toSlug(s1, s2))) {
      error({
        statusCode:404,
        message: 'This article could not be found',
      })
    }
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
    ...mapState([
      'authorized',
    ])
  },
}

</script>
