<style scoped lang="scss">
@import "../css/variables";
</style>

<template lang="pug">
.container-index
  p index
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
  },
}
</script>
