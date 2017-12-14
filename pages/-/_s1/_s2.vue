<style scope lang="scss">
@import "../../../css/variables";

.article-content {
  h2 {
    margin: 48px 0 24px;
    line-height: 48px;
    font-size: $size-4;
    border-bottom: solid 2px $border;
  }


  h3 {
    margin: 24px 0;
    padding: 12px;
    font-size: $size-5;
    border-left: solid 2px $border;
  }

  & > p {
    line-height: 24px;
    margin: 24px 0;
  }
}

.article-tags {
  margin-top: 16px;
}

.article-heading {
  margin: 0 0 36px;

  .article-title {
    font-size: 36px;
    line-height: 64px;
    text-align: center;
  }

  .article-digest {
    font-size: 16px;
    line-height: 24px;
    text-align: center;
  }

  .article-tags {
    margin: 16px auto;
    text-align: center;
    .tag {
      display: inline-block;
      margin: 0 4px;
      line-height: 22px;
    }
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
.article
  nav.breadcrumb.is-small(aria-label="breadcrumbs")
    ul
      li
        nuxt-link(to="/") Home
      li
        nuxt-link(:to="'/-/' + article.slug") {{article.title}}
  .article-heading
    h1.article-title {{article.title}}
    h2.article-digest(v-if="article.digest") {{article.digest}}
    .article-tags(v-if="article.tags.length > 0")
      a.tag.is-white(v-for="tag in article.tags") {{tag}}
    .article-delimiter
  .article-content.content
    VueMarkdown(v-bind="mdProps") {{ article.content }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  async fetch ({ store, params }) {
    await store.dispatch('article/getArticles')
  },
  data: () => ({
    mdProps: {
      breaks: false,
      plugins: [],
      override(md) {
      },
    }
  }),
  validate ({ store, params }) {
    return true
    const { s1, s2 } = params
    const slug = s2 ? s1 + '/' + s2 : s1
    return store.getters['article/findArticle'](slug)
  },
  computed: {
    article() {
      const { s1, s2 } = this.$route.params
      const slug = s2 ? s1 + '/' + s2 : s1
      return this.$store.getters['article/findArticle'](slug)
    },
  },
}

</script>
