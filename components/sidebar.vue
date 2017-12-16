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
    li
      a(href="#") Lorem(10)
    li
      a(href="#") Ipsum(6)
    li
      a(href="#") Dolor(9)
    li
      a(href="#") 雑記(10)

  h2 Tags
  ul
    li
      a(href="#") Vim(1)
    li
      a(href="#") C(4)
    li
      a(href="#") Java(10)

  h2 Accounts
  ul
    li
      a(href="http://twitter.com/endaaman") Twitter
    li
      a(href="http://github.com/endaaman") GitHub

  h2 Links
  ul
    li
      nuxt-link(to="/archive") Archive
    li(v-for="article in specialArticles")
      nuxt-link(:to="'/-/' + article.slug") {{article.title}}
    li(v-if="authorized")
      nuxt-link(to="/file") File Management
    li(v-if="!authorized")
      nuxt-link(to="/login") Login
    li(v-if="authorized")
      nuxt-link(to="/logout") Logout
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState([
      'authorized'
    ]),
    ...mapState('article', [
      'articles',
    ]),
    ...mapGetters('article', {
      specialArticles: 'getSpecialArticles',
    })
  },
}
</script>
