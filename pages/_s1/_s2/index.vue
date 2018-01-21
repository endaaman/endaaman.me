<style scoped lang="scss">
@import "../../../css/variables";

.article-heading {
  margin: 24px 0 48px;
}

.article-date {
  line-height: 24px;
  margin: 12px 0;
  color: $text-light;
}

.article-title {
  font-size: 36px;
  line-height: 48px;
  margin: 12px 0;
  // text-align: center;
  a {
    color: inherit;
  }
}

.article-digest {
  font-size: 16px;
  line-height: 24px;
  margin: 12px 0;
  // text-align: center;
}

.article-subs {
  margin: 12px auto;
  font-size: 16px;
  height: 24px;
  line-height: 24px;
}

.article-sub {
  display: inline-block;
  margin: 0 4px;
  .tag {
    line-height: 22px;
  }
}

.article-delimiter {
  margin: 24px auto;
  width: 100%;
  height: 2px;
  background-color: $black-ter;
}
</style>

<template lang="pug">
.container-article-show.container
  .section
    nav.breadcrumb(aria-label="breadcrumbs")
      ul
        li
          nuxt-link(to="/") Home
        li(v-if="article.visiblity !== 'special'")
          nuxt-link(:to="'/?category=' + category.slug") {{ category.name }}
        li
          // nuxt-link(:to="'/' + category.slug + '/' + article.slug") {{ article.title }}

    .article-heading
      .article-date
        | {{ article.date | date }}
        span(v-if="authorized")
          | ・
          nuxt-link(:to="article.getHref() + '/edit'") edit
      h1.article-title
        nuxt-link(:to="article.getHref()") {{ article.title }}
      h2.article-digest(v-if="article.digest") {{ article.digest }}
      .article-subs(v-if="article.tags.length > 0")
        .article-sub(v-for="tag in article.tags")
          nuxt-link.tag.is-white(:to="'/?tag=' + tag") {{ tag }}

    // .article-delimiter
    my-markdown {{ article.content }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  async fetch ({ store, params, error }) {
    const { s1, s2 } = params
    const parent = s1 === '-' ? null : s1
    if (!store.getters['article/getArticle'](parent, s2)) {
      error({
        statusCode:404,
        message: 'This article could not be found',
      })
    }
  },
  computed: {
    relative() {
      const { s1, s2 } = this.$route.params
      return s1 + '/' + s2
    },
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
    ...mapState([
      'authorized',
    ])
  },
}

</script>
