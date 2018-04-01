<style scoped lang="scss">
@import "../css/variables";

.sidebar {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  height: 100%;

  color: $white-ter;
  overflow-y: scroll;
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
    .category-title(v-for="cat in categoryItems" v-if="cat.category.getArticles().length > 0")
      a.nodeco-inline(@click="cat.isActive = !cat.isActive")
        i.mdi.is-primay(:class="{ 'mdi-chevron-right': !cat.isActive, 'mdi-chevron-down': cat.isActive }")
        span(:class="{ 'has-text-weight-bold': cat.isActive }") {{ cat.name }}
      ul.articles-by-category(v-if="cat.isActive")
        li(v-for="a in cat.category.getArticles()")
          span.is-primay ・
          nuxt-link(:to="a.getHref()", :class="{ 'is-active': a.getHref() === $route.path }") {{ a.title }}
          span.icon.has-text-danger(v-if="a.private")
            i.mdi.mdi-lock

    h2 Tags
    .tags
      nuxt-link.tag.is-white(
        v-for="tag in tagItems",
        :to="'/?tag=' + tag.name",
        :key="tag.name",
        :class="{ 'is-inversed': !tag.isActive }"
        ) {{ tag.name }} ({{ tag.count }})

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
      | Made with&#x20;
      i.mdi.mdi-heart.is-primay
      | &#x20;at {{ builtAt | date('YYYY-MM-DD') }}

    span.footer-right-text(v-if="!authorized")
      nuxt-link.nodeco-inline(to="/login") Login
    span.footer-right-text(v-if="authorized")
      nuxt-link.nodeco-inline(to="/logout") Logout
    span.footer-right-text(v-if="authorized")
      nuxt-link.nodeco-inline(to="/admin") Admin
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      categoryItems: [],
      tagItems: [],
    }
  },
  created() {
    this.categoryItems  = this.categories.map((c) => ({
      name: c.name,
      slug: c.slug,
      category: c,
      isActive:
      (this.activeCategory && c.slug === this.activeCategory.slug)
      ||
      (this.activeArticle && !this.activeArticle.special && c.slug === this.activeArticle.getCategorySlug()),
    }))
    this.tagItems = this.tags.map((t) => ({
      isActive: this.activeTag === t.name,
      ...t
    }))
  },
  watch: {
    $route(route) {
      this.$store.dispatch('layout/closeSidebar')
    },
    activeTag(tag) {
      for (const t of this.tagItems) {
        t.isActive = t.name === tag
      }
    },
    activeCategory() {
      for (const c of this.categoryItems) {
        c.isActive = c.isActive || (this.activeCategory && c.slug === this.activeCategory.slug)
      }
    },
    activeArticle() {
      for (const c of this.categoryItems) {
        c.isActive = c.isActive || (this.activeArticle && !this.activeArticle.special && c.slug === this.activeArticle.getCategorySlug())
      }
    },
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
    ...mapGetters([
      'activeCategory',
      'activeArticle',
      'activeTag',
    ]),
    ...mapGetters('article', {
      specialArticles: 'specialArticles',
      tags: 'tagAggregations',
      articleMap: 'articleMapKeyByParent',
    }),
    builtAt() {
      return new Date(process.env.builtAt)
    },
  },
}
</script>
