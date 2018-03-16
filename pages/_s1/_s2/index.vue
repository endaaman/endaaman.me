<style scoped lang="scss">
@import "../../../css/variables";

.article-heading {
  margin: 0px 0 36px;
}

.article-date {
  font-size: $size-7;
  line-height: 24px;
  color: $text-light;
  margin-bottom: 8px;
}

.article-title {
  font-size: $size-3;
  line-height: 48px;
  @media screen and (max-width: $breakpoint) {
    font-size: $size-4;
    line-height: 32px;
  }

  font-weight: bold;
  margin-bottom: 8px;
  a {
    color: $grey-darker;
  }
}

.article-digest {
  font-size: $size-7;
  line-height: 24px;
  margin-bottom: 8px;
  // text-align: center;
}

.article-sub {
  margin-bottom: 8px;
}

.article-delimiter {
  margin: 24px auto;
  width: 100%;
  height: 2px;
  background-color: $black-ter;
}
</style>

<template lang="pug">
.container-article-show
  .section
    .article-heading
      .article-date
        | {{ article.date | date }}
        span(v-if="authorized")
          | ・
          nuxt-link(:to="article.getHref() + '/edit'") edit
      h1.article-title
        nuxt-link(:to="article.getHref()") {{ article.title }}
      .article-sub
        h2.article-digest(v-if="article.digest") {{ article.digest }}
      .article-sub(v-if="article.tags.length > 0")
        .tags
          nuxt-link.tag.is-white(v-for="tag in article.tags", :to="'/?tag=' + tag" :key="tag") {{ tag }}

    // .article-delimiter
    my-markdown {{ article.content }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  validate({ store, params }) {
    const { s1, s2 } = params
    const parent = s1 === '-' ? null : s1
    return store.getters['article/getArticle'](parent, s2)
  },
  created() {
    this.$store.dispatch('layout/setActiveArticle', this.article)
  },
  beforeDestroy() {
    this.$store.dispatch('layout/setActiveArticle', null)
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
      const { parent } = this.article
      return this.$store.getters['category/findCategory'](parent || '-')
    },
    ...mapState([
      'authorized',
    ])
  },
}

</script>
