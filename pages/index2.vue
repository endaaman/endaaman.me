<template lang="pug">
.container-index
  ul
    li(v-for="article in activeArticles")
      p {{ article.title }}

  b-pagination(
    :total="articles.length",
    :current.sync="current",
    :per-page="3",
    order="is-centered"
    @change="onPaginationChanged")
</template>

<script>
import { mapState, mapGetters } from 'vuex'


const OFFSET = 3

export default {
  data: () => ({
    current: 1,
  }),
  methods: {
    navigate(e) {
      this.$router.push(e.target.dataset['href'])
    }
  },
  computed: {
    ...mapGetters('article', {
      articles: 'getHomeArticles',
    }),
    ...{
      page() {
        return this.$route.query.page || 1
      },
      maxPage() {
        return Math.floor(this.articles.length / OFFSET) + 1
      },
      activeArticles() {
        const results = []
        const a = (this.page - 1) * OFFSET
        const b = a + OFFSET
        return this.articles.slice(a, b)
      }
    }
  },
  methods: {
    onPaginationChanged(v) {
      this.$router.push(v <= 1 ? { path: '/' } : { query: { page: v }})
    }
  }

}

</script>
