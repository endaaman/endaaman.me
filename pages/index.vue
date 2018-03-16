<style scoped lang="scss">
@import "../css/variables";

.article-item {
  display: block;
  color: inherit;

  padding: 8px 16px;
  margin-top: 36px;
  border-left: 2px solid $black-ter;
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
.container-home.container
  .section
    nuxt-link.article-item(v-for="a in articles", :key="a.slug", :to="a.getHref()")
      .article-title {{ a.title }}
      .article-digest {{ a.getDigest() }}
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
    },
  },
  created() {
    this.$store.dispatch('layout/setActiveCategory', this.category)
    this.$store.dispatch('layout/setActiveTag', this.tag)
  },
  beforeDestroy() {
    this.$store.dispatch('layout/setActiveCategory', null)
    this.$store.dispatch('layout/setActiveTag', null)
  },
  computed: {
    ...mapGetters('article', {
      allArticles: 'normalArticles',
    }),
    ...{
      category() {
        return this.$store.getters['category/findCategory'](this.$route.query.category)
      },
      tag() {
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
