<style scoped lang="scss">
@import "../css/variables";

.header {
  background-color: $black-ter;
  // height: $header-height;
  color: $white-ter;
  padding: $header-padding 24px;
  transform: translateY(0%);
  transition: transform 0.1s ease;
  padding-right: 72px;
  &.header-inverted {
    background-color: transparent;
    color: inherit;
  }

  &.header-hidden {
    transform: translateY(-100%);
  }
}

.header-title {
  height: 100%;
  font-size: $size-4;
  height: $header-title-height;
  line-height: $header-title-height;
  margin-bottom: $header-margin;
  font-family: 'Ubuntu Condensed', cursive;
  font-weight: bold;
}

.header-sub {
  height: $header-sub-height;
  line-height: $header-sub-height;
  font-size: $size-7;

  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  a {
    color: inherit;
  }
  .header-sub-item {
    margin-right: 8px;
    // display: inline-block;
    // max-width: 120px;
  }
}

.accent {
  // color: #FDABCD;
  color: $primary;
}

.header-selector {
  display: inline-block;
  font-size: inherit;
  margin-right: 8px;

  $icon-width: 12px;
  select {
    position: relative;
    color: inherit;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    border-radius: 0;
    border: 0;
    margin: 0;
    font-size: inherit;
    background: none transparent;
    padding-right: $icon-width;
    option {
      color: $black-ter;
      background-color: $white-ter;
    }
  }
  .header-selector-icon {
    position: relative;
    display: inline-block;
    width: $icon-width;
    text-align: center;
    pointer-events: none;
    margin-left: - $icon-width;
    color: $primary;
  }
}
</style>

<template lang="pug">
header.header(:class="{ 'header-hidden': isSidebarActive, 'header-inverted': !isSmallScreen }")
  .header-title(v-if="isSmallScreen")
    nuxt-link.nodeco-inline(to='/')
      span.accent E
      span NDAAMAN
      span.accent .
      span ME
  .header-sub
    nuxt-link.header-sub-item(:to="'/'") Home
    span.header-sub-item /

    template(v-if="isCategorySelectorCrumbVisible")
      .header-selector
        select(v-model="selectedCategory")
          option(:value="null") 記事一覧
          option(v-for="c in categories", :key="c.slug", :value="c.slug", v-if="c.getArticles().length > 0") {{ c.name }}
        span.header-selector-icon
          i.mdi.mdi-chevron-down
      span.header-sub-item /

    template(v-if="isTagSelectorCrumbVisible")
      i.mdi.mdi-tag
      .header-selector
        select(v-model="selectedTag")
          option(:value="null") 指定なし
          option(v-for="t in tags", :key="t", :value="t") {{ t }}
        span.header-selector-icon
          i.mdi.mdi-chevron-down
      span.header-sub-item /

    template(v-if="isArticleCrumbVisible && activeArticle")
      nuxt-link.header-sub-item(:to="activeArticle.getHref()") {{ activeArticle.title }}

    template(v-if="isStaticCrumbVisible")
      nuxt-link.header-sub-item(:to="this.$route.path") {{ staticBreadcrumb }}

</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { NO_CATEGORY_NAME, NO_CATEGORY_SLUG } from '../constants'

export default {
  computed: {
    selectedCategory: {
      get() {
        if (this.activeCategory) {
          return this.activeCategory.slug
        }
        if (this.activeArticle) {
          return this.activeArticle.getCategorySlug()
        }
        return null
      },
      set(v) {
        const path = v ? '/?category=' + v : '/'
        this.$router.push(path)
      },
    },
    selectedTag: {
      get() {
        return this.activeTag
      },
      set(v) {
        const query = {}
        if (this.activeCategory) {
          query.category = this.activeCategory.slug
        }
        if (v) {
          query.tag = v
        }
        this.$router.push({ path: '/', query })
      },
    },
    tags() {
      return this.activeCategory
        ? this.$store.getters['article/getTagsByCategorySlug'](this.activeCategory.slug)
        : this.$store.getters['article/tags']
    },
    isCategorySelectorCrumbVisible() {
      return this.$route.name === 'index' || this.$route.name === 's1-s2'
    },
    isTagSelectorCrumbVisible() {
      return this.$route.name === 'index'
    },
    isArticleCrumbVisible() {
      return this.$route.name === 's1-s2'
    },
    isStaticCrumbVisible() {
      return this.$route.name !== 's1-s2' && this.$route.name !== 'index'
    },
    staticBreadcrumb() {
      const defs = [{
        reg: /^login$/,
        label: 'Login',
      }, {
        reg: /^logout$/,
        label: 'Logout',
      }, {
        reg: /^admin/,
        label: 'Admin',
      }]
      for (const { reg, label } of defs) {
        if (reg.test(this.$route.name)) {
          return label
        }
      }
    },
    ...mapState('layout', [
      'isSidebarActive',
      'isSmallScreen',
    ]),
    ...mapGetters(['activeCategory', 'activeArticle', 'activeTag']),
    ...mapState('category', ['categories']),
  },
}
</script>
