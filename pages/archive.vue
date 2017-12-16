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
.container-archive
  nuxt-link.article-item(v-for="article in articles", :key="article.slug", :to="'/-/' + article.slug")
    .article-title {{article.title}}
    .article-subtitle {{article.digest}}
    .article-sub
      .article-date
        | {{ article.date | date}}
      .article-tags
        .tags
          .tag.is-white(v-for="tag in article.tags", v-bind:key="tag", @click.prevent="navigate" :data-href="'/archive?tag=' + tag")
            | {{ tag }}
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  async fetch({ store, params, route }) {
    await store.dispatch('article/getArticles')
  },
  computed: mapGetters({
    articles: 'article/getHomeArticles'
  }),
  methods: {
    navigate(e) {
      this.$router.push(e.target.dataset['href'])
    }
  }
}
</script>
