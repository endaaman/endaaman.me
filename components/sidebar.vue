<style scoped lang="scss">
@import "../css/variables";

.sidebar {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  height: 100%;

  color: $white-ter;
}

.sidebar-main {
  background-color: $sidebar-bg;
  padding: 24px;
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

.category-title {
  user-select: none;
  margin-top: 16px;
  li {
    padding-left: 16px;
    text-indent: -16px;
  }
  & > a {
    display: block;
    text-decoration: none;
    color: inherit;
    &:hover {
      font-weight: bold;
    }
  }
}

.articles-by-category {
  margin-left: 16px;
  margin-right: 0;
  li {
    margin: 12px 0;
    a {
      color: $white-ter;
      &:hover {
        text-decoration: underline;
      }
      &.is-active {
        text-decoration: underline;
      }
    }
  }
}

.tag.is-inversed {
  background-color: transparent;
  border-color: $white-ter;
  color: $white-ter;
  &:hover {
    background-color: $white-ter;
    color: $sidebar-bg;
  }
}


.special-title {
  user-select: none;
  margin-top: 16px;
  & > a {
    display: block;
    text-decoration: none;
    color: inherit;
    &:hover {
      font-weight: bold;
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
  background-color: $sidebar-bg;
  border: solid 1px $white-ter;
  transition: width .3s ease;
  &:hover {
    background-color: $white-ter;
    color: $sidebar-bg;
    width: auto;
    padding: 0 4px;
  }
}

.field {
  margin-bottom: 16px;
}

.sidebar-footer  {
  margin-top: auto;
  padding: 48px 24px 12px;
  font-size: $size-7;
  background-color: $sidebar-bg;
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

.is-primay {
  color: $primary;
}
</style>

<template lang="pug">
aside.sidebar
  .sidebar-main
    my-logo

    h2 Category
    .category-title(v-for="cat in categoryItems")
      a.nodeco-inline(@click="cat.open = !cat.open")
        i.mdi.is-primay(:class="{ 'mdi-chevron-right': !cat.open, 'mdi-chevron-down': cat.open }")
        span(:class="{ 'has-text-weight-bold': cat.open }") {{ cat.name }}
      ul.articles-by-category(v-if="cat.open")
        li(v-for="a in getArticlesByParent(cat.category.getValue())")
          span.is-primay ・
          nuxt-link(:to="a.getHref()", :class="{ 'is-active': a.getHref() === $route.path }") {{ a.title }}

    h2 Tags
    .tags
      nuxt-link.tag.is-white.is-inversed(v-for="tag in tags", :to="'/?tag=' + tag.name", :key="tag.name")
        | {{ tag.name }} ({{ tag.count }})

    h2 Links
    .special-title(v-for="a in specialArticles")
      nuxt-link.nodeco-inline(:to="a.getHref()")
        i.mdi.mdi-rhombus-outline.is-primay
        | &#x20;
        span {{ a.title }}

  footer.sidebar-footer
    // .field
    //   p.control.has-icons-left
    //     input.input.is-rounded(type="text", placeholder="Seach...")
    //     span.icon.is-left
    //       i.mdi.mdi-magnify
    ul.social-links
      li
        a.social-link.is-small(href="http://twitter.com/endaaman")
          i.mdi.mdi-twitter
          span.link-text @endaaman
      li
        a.social-link.is-small(href="http://github.com/endaaman")
          i.mdi.mdi-github-face
          span.link-text @endaaman

    span.footer-left-text
      | Built with&#x20;
      i.mdi.mdi-heart.is-primay
      | &#x20;at {{ builtAt | date('YYYY-MM-DD') }}

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
  data() {
    return {
      categoryItems: [],
    }
  },
  watch: {
    $route(v) {
      this.$store.dispatch('layout/closeSidebar')
    }
  },
  created() {
    const cc = this.categories.map((c) => ({
      name: c.name,
      slug: c.slug,
      category: c,
      open: false,
    }))

    const sp = this.$route.path.split('/')
    if (sp.length > 2) {
      const slug = sp[1] === '-' ? null : sp[1]
      for (const c of cc) {
        if (c.slug === slug) {
          c.open = true
        }
      }
    }
    this.categoryItems = cc
  },
  computed: {
    ...mapState([
      'authorized',
    ]),
    ...mapState('layout', [
      'isSmallScreen',
    ]),
    ...mapState('category', [
      'categories',
    ]),
    ...mapGetters('article', {
      specialArticles: 'specialArticles',
      tags: 'getTags',
    }),
    builtAt() {
      return new Date(process.env.builtAt)
    },
  },
  methods: {
    getArticlesByParent(parent) {
      return this.$store.getters['article/getArticlesByParent'](parent)
    },
  }
}
</script>
