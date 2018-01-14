<style scoped lang="scss">
@import "../css/variables";

.sidebar {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex: 1;

  width: 100%;
  height: 100vh;

  background-color: $black-ter;
  color: $white-ter;
}

.section {
  flex: 1;
  flex-grow: 1;
}

h2 {
  line-height: 16px;
  padding: 8px 0;
  margin: 24px 0 12px;

  font-size: 16px;
  border-bottom: solid 2px $white-ter;
}

ul.links {
  margin-bottom: 36px;
  li {
    line-height: 24px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.social-links {
  margin: 12px 0;
  overflow: hidden;
  li {
    margin-right: 24px;
    float: left;
  }
}

.social-link {
  $size: 24px;
  display: block;
  width: $size;
  height: $size;
  line-height: $size;
  text-align: center;
  font-size: 16px;
  // border-radius: 50%;

  color: $white-ter;
  background-color: $black-ter;
  border: solid 1px $white-ter;
  &:hover {
    border-color: $primary;
    color: $primary;
  }
}

.field {
  margin-bottom: 16px;
}

footer {
  margin-top: auto 0;
  padding: 12px 24px;
  font-size: $size-7;
}

.footer-right-text {
  float: right;
  margin-left: 8px;
}

.footer-left-text {
  float: left;
  margin-right: 16px;
  font-style: italic;
}
</style>

<template lang="pug">
aside.sidebar
  .section
    my-logo

    h2 Category
    ul.links
      li(v-for="category in categories")
        nuxt-link(:to="'/?category=' + category.slug") {{ category.name }}
      li
        nuxt-link(:to="'/?category=-'") 雑記

    h2 Tags
    ul.links
      li(v-for="tag in tags")
        nuxt-link(:to="'/?tag=' + tag.name") {{ tag.name }} ({{tag.count}})

    ul.links
      li(v-for="article in specialArticles")
        nuxt-link(:to="'/-/' + article.slug") {{article.title}}

  footer
    .field
      p.control.has-icons-left
        input.input.is-rounded(type="text", placeholder="Seach...")
        span.icon.is-left
          i.mdi.mdi-magnify

    ul.social-links
      li
        a.social-link.is-small(href="http://twitter.com/endaaman")
          i.mdi.mdi-twitter
          | @endaaman
      li
        a.social-link.is-small(href="http://github.com/endaaman")
          i.mdi.mdi-github-face

    span.footer-left-text Built at {{ builtAt | date('YYYY-MM-DD') }}

    span.footer-right-text(v-if="!authorized")
      nuxt-link.nodeco-inline(to="/login") Login
    span.footer-right-text(v-if="authorized")
      nuxt-link.nodeco-inline(to="/logout") Logout
    span.footer-right-text(v-if="authorized")
      nuxt-link.nodeco-inline(to="/file") File
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
    }),
    builtAt() {
      return new Date(process.env.builtAt)
    }
  },
}
</script>
