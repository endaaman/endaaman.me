<style scoped lang="scss">
@import "../../../css/variables";

.article-heading {
  margin: 0px 0 36px;
}

.article-dates {
  font-size: $size-7;
  line-height: 24px;
  color: $text-light;
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

hr.article-bottom-divider {
  margin: 48px 0 24px;
}

.article-navigators {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
}


a.article-navigator {
  display: flex;
  flex-direction: column;
  width: 48%;
  overflow: hidden;
  // white-space: wrap;
  // text-overflow: ellipsis;
  // display: block;
  color: $black-ter;
  text-decoration: inherit;
  border: 1px solid $border;
  font-size: 14px;
  padding: 6px 12px;
  .article-navigator-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    .article-navigator-inner {
      // no styles needed
    }
  }
  .article-navigator-guide {
    flex-grow: 0;
    text-align: center;
    font-size: 12px;
    color: $grey-dark;
  }

  &:hover {
    border-color: $border-hover;
    .article-navigator-content {
      color: $border-hover;
    }
  }
}
</style>

<template lang="pug">
.container-article-show
  .section
    .article-heading
      .article-sub.article-dates
        template(v-if="!article.special")
          span カテゴリ：
          nuxt-link(:to="'/?category=' + article.getCategory().slug") {{ article.getCategory().name }}
          span ・
        span {{ article.date | date }}
        template(v-if="authorized")
          span ・
          nuxt-link(:to="'/admin/article/edit?relative=' + article.getRelative()") edit
          span.icon.has-text-danger(v-if="article.private")
            i.mdi.mdi-lock
      h1.article-title
        nuxt-link(:to="article.getHref()") {{ article.title }}
      .article-sub.article-digest(v-if="article.digest")
        | {{ article.digest }}
      .article-sub.article-tags(v-if="!article.special && article.getTags().length > 0")
        .tags
          nuxt-link.tag.is-white(v-for="tag in article.getTags()", :to="'/?tag=' + tag" :key="tag") {{ tag }}

    // .article-delimiter
    my-markdown(:source="article.content")

    .article-bottom(v-if="prevArticle || nextArticle")
      hr.article-bottom-divider
      .article-navigators
        nuxt-link.article-navigator(v-if="prevArticle", :to="prevArticle.getHref()")
          .article-navigator-guide
            i.mdi.mdi-chevron-double-left
            | 前の{{ article.getCategory().name }}の記事
          .article-navigator-content
            .article-navigator-inner
              // span Firefoxでgtkのdarkテーマを使うときのカスタムCSS
              span {{ prevArticle.title }}
        .article-navigator(v-else)
        nuxt-link.article-navigator(v-if="nextArticle", :to="nextArticle.getHref()")
          .article-navigator-guide
            | 次の{{ article.getCategory().name }}の記事
            i.mdi.mdi-chevron-double-right
          .article-navigator-content
            .article-navigator-inner
              // span Neomakeを使いこなせ！
              span {{ nextArticle.title }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  head() {
    const meta = [{
      name: 'description',
      content: this.article.getDigest(),
    }, ]
    if (this.article.tags.length > 0) {
      meta.push({
        name: 'keywords',
        content: this.article.tags.join(','),
      })
    }
    return {
      title: this.article.title,
      meta,
    }
  },
  validate({ store, params }) {
    const { s1, s2 } = params
    return store.getters['article/getArticleByRelative'](s1 + '/' + s2)
  },
  computed: {
    article() {
      return this.$store.getters['activeArticle']
    },
    siblingArticles() {
      return this.article.getSiblings()
    },
    prevArticle() {
      return this.siblingArticles[0]
    },
    nextArticle() {
      return this.siblingArticles[1]
    },
    ...mapState([
      'authorized',
    ])
  },
}
</script>
