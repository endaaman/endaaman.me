<style scoped lang="scss">
@import "../css/variables";

.sidebar {
  h2 {
    line-height: 16px;
    padding: 8px 0;
    margin-bottom: 8px;

    font-size: 16px;
    border-bottom: solid 2px $black-ter;
  }

  ul {
    margin-bottom: 36px;
  }

  li {
    line-height: 24px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}

</style>

<template lang="pug">
aside.sidebar
  h2 Category
  ul
    li(v-for="category in categories")
      nuxt-link(:to="'/?category=' + category.slug") {{ category.name }}
    li
      nuxt-link(:to="'/?category=-'") 雑記

  h2 Tags
  ul
    li(v-for="tag in tags")
      nuxt-link(:to="'/?tag=' + tag.name") {{ tag.name }} ({{tag.count}})

  h2 Links
  ul
    li(v-for="article in specialArticles")
      nuxt-link(:to="'/-/' + article.slug") {{article.title}}
    li
      a(href="http://twitter.com/endaaman") Twitter
    li
      a(href="http://github.com/endaaman") GitHub
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState([
      'authorized'
    ]),
    ...mapState('category', [
      'categories',
    ]),
    ...mapGetters('article', {
      specialArticles: 'getSpecialArticles',
      tags: 'getTags',
    })
  },
}
</script>
