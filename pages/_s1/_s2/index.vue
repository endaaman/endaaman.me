<style scoped lang="scss">
@import "../../../css/variables";

.article-show-root {
  height: 100%;
}

.article-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.article-heading {
  margin-bottom: 24px;
  .article-dates {
    font-size: $size-7;
    line-height: 24px;
    color: $text-light;
  }

  .article-title {
    font-size: $size-2;
    line-height: 1.5;
    @media screen and (max-width: $breakpoint) {
      font-size: $size-3;
    }

    font-weight: bold;
    margin-bottom: 8px;
    a {
      color: $grey-darker;
    }
  }

  .article-digest {
    font-size: 14px;
    line-height: 24px;
    margin-bottom: 8px;
    font-style: italic;
    // text-align: center;
  }

  .article-tags {
    margin-bottom: 8px;
  }
}

.article-body {
  flex-grow: 1;
  margin-bottom: 24px;
}

.article-bottom {
  hr.article-bottom-divider {
    margin-bottom: 16px;
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
    padding: 8px 16px;
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
}
</style>

<template lang="pug">
.article-show-root
  .article-content
    .article-heading
      .article-sub.article-dates
        template(v-if="!article.special")
          span Category:&#x20;
          nuxt-link(:to="'/?category=' + article.categorySlug") {{ article.getCategory().name }}
          span ・
        span {{ article.date | date }}
        template(v-if="authorized")
          span ・
          nuxt-link(:to="'/admin/article/edit?relative=' + article.getRelative()") edit
          span.icon.has-text-danger(v-if="article.private")
            i.mdi.mdi-lock
      h1.article-title
        nuxt-link(:to="article.getHref()") {{ article.title }}
      .article-digest(v-if="article.digest")
        | {{ article.digest }}
      .article-tags(v-if="!article.special && article.getTags().length > 0")
        .tags
          nuxt-link.tag.is-white(v-for="tag in article.getTags()", :to="'/?tag=' + tag" :key="tag") {{ tag }}

    .article-body
      my-markdown(:source="article.body", @ready="onMarkdownReady")

    .article-bottom(v-if="prevArticle || nextArticle")
      hr.article-bottom-divider
      .article-navigators
        nuxt-link.article-navigator(v-if="prevArticle", :to="prevArticle.getHref()")
          .article-navigator-guide
            i.mdi.mdi-chevron-double-left
            | Prev {{ article.getCategory().name }} entry
          .article-navigator-content
            .article-navigator-inner
              span {{ prevArticle.title }}
        .article-navigator(v-else)
        nuxt-link.article-navigator(v-if="nextArticle", :to="nextArticle.getHref()")
          .article-navigator-guide
            | Next {{ article.getCategory().name }} entry
            i.mdi.mdi-chevron-double-right
          .article-navigator-content
            .article-navigator-inner
              span {{ nextArticle.title }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      isMarkdownReady: false,
    }
  },
  head() {
    const a = this.article
    const meta = [
      { name: 'description', vmid: 'description', content: a.getDigest() },
      { name: 'og:title', vmid: 'og:title', content: a.title },
      { name: 'og:description', vmid: 'og:description', content: a.getDigest() },
    ]
    if (a.tags.length > 0) {
      meta.push({ name: 'keywords', vmid: 'keywords', content: a.tags.join(',')})
    }
    if (a.image) {
      meta.push({ name: 'og:image', vmid: 'og:image', content: a.image })
    }
    return {
      title: a.title,
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
  methods: {
    onMarkdownReady() {
      this.isMarkdownReady = true
    }
  }
}
</script>
