<style scoped lang="scss">
@import "../css/variables";

.article-item {
  display: block;
  color: inherit;

  padding: 8px 16px;
  margin-top: 36px;
  border-left: 2px solid $grey-darker;
  &:first-child {
    margin-top: 0;
  }
  &:hover {
    background-color: $white-ter;
  }

  .article-title {
    font-size: 24px;
    line-height: 36px;
  }
  .article-digest {
    position: relative;
    font-size: $size-7;
    line-height: 24px;
  }
  .article-sub {
    margin: 8px 0;
    overflow: hidden;
  }
  .article-date {
    float: left;
    color: $text-light;
    font-size: $size-7;
  }
  .article-tags {
    margin: 0;
    float: right;
  }
}
</style>

<template lang="pug">
.home-root
  nuxt-link.article-item(v-for="a in articles", :key="a.slug", :to="a.getHref()")
    div
      | {{ a.getCategory().name }}
    .article-title
      | {{ a.title }}
    .article-digest
      | {{ a.getDigest() }}
    .article-sub
      .article-date
        | {{ a.date | date }}
        span.icon.has-text-danger(v-if="a.private")
          i.mdi.mdi-lock
      .article-tags
        .tags
          .tag.is-white(
            v-for="tag in a.getTags()",
            :key="tag",
            @click.prevent="navigate"
            :data-href="'/?tag=' + tag") {{ tag }}
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  head() {
    return {
      title: 'Home',
    }
  },
  // validate() {
  //   // validate category and tag query
  // },
  methods: {
    navigate(e) {
      this.$router.push(e.target.dataset['href'])
    },
  },
  computed: {
    ...mapGetters('article', {
      allArticles: 'normalArticles',
    }),
    ...{
      articles() {
        let articles = [...this.allArticles]
        const { tag, category: categorySlug } = this.$route.query
        if (tag) {
          articles = articles.filter((a) => a.getTags().includes(tag))
        }
        if (categorySlug) {
          articles = articles.filter((a) => a.categorySlug === categorySlug )
        }
        return articles
      }
    }
  }
}
</script>
