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

.article-tags {
  margin: 16px auto;
  text-align: center;
  .tag {
    display: inline-block;
    margin: 0 4px;
    line-height: 22px;
  }
}

.article-delimiter {
  margin: 16px auto;
  width: 128px;
  height: 2px;
  background-color: $black-ter;
}

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
  img {
    float: left;
  }
  .fr {
    float: right;
  }
  .cl {
    overflow: hidden;
  }
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
    my-markdown {{ article.content }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  async fetch ({ store, params }) {
    await store.dispatch('article/getArticles')
  },
  validate ({ store, params }) {
    const { s1, s2 } = params
    const slug = s2 ? `${s1}/${s2}` : s1
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
