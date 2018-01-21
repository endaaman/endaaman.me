<style scoped lang="scss">
@import "../css/variables";

.article-item {
  display: block;
  color: inherit;

  padding: 8px 16px;
  margin-top: 36px;
  border-left: 2px solid $black-ter;
  /* background-color: $white-ter; */
  &:first-child {
    margin-top: 0;
  }
  &:hover {
    background-color: $white-ter;
    /* border-left-color: $primary; */
  }

  .article-title {
    font-size: 24px;
    line-height: 36px;
  }
  .article-subtitle {
    font-size: 16px;
    line-height: 24px;
  }
  .article-sub {
    margin: 8px 0;
    overflow: hidden;
  }
  .article-date {
    float: left;
    color: $text-light;
    /* font-size: $size-7; */
  }
  .article-tags {
    margin: 0;
    float: right;
  }
}
</style>

<template lang="pug">
.container-home.container
  .section
    nav.breadcrumb(aria-label="breadcrumbs")
      ul
        li
          nuxt-link(to="/") Home
        li(v-if="!qCategory && !qTag")
          a(disabled)
        li(v-if="qCategory")
          nuxt-link(:to="'/archive?category=' + qCategory")
            | {{ qCategory === '-' ? '雑記' : qCategory }}
        li(v-if="qTag")
          nuxt-link(:to="'/?tag=' + qTag") タグ: {{ qTag }}

    nuxt-link.article-item(v-for="a in articles", :key="a.slug", :to="a.getHref()")
      .article-title {{ a.title }}
      .article-subtitle {{ a.digest }}
      .article-sub
        .article-date
          | {{ a.date | date }}
        .article-tags
          .tags
            .tag.is-white(
              v-for="tag in a.tags",
              :key="tag",
              @click.prevent="navigate"
              :data-href="'/?tag=' + tag") {{ tag }}
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  methods: {
    navigate(e) {
      this.$router.push(e.target.dataset['href'])
    },
    getHref(article) {
      const splitted = article.slug.split('/')
      const l = splitted.length
      return l == 2 ? article.slug : '/-/' + splitted[l - 1]
    }
  },
  computed: {
    ...mapGetters('article', {
      allArticles: 'normalArticles',
    }),
    ...{
      qCategory() {
        return this.$route.query.category
      },
      qTag() {
        return this.$route.query.tag
      },
      articles() {
        let articles = this.allArticles
        const { tag, category } = this.$route.query
        if (tag) {
          articles = articles.filter((a) => a.tags.includes(tag))
        }
        if (category) {
          const parent = category === '-' ? null : category
          articles = articles.filter((a) => a.parent === parent )
        }
        return articles
      }
    }
  }
}
</script>
