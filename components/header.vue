<style scoped lang="scss">
@import "../css/variables";

.header {
  background-color: $black-ter;
  height: $header-height;
  color: $white-ter;
  padding: $header-padding 24px;
  transform: translateY(0%);
  transition: transform 0.1s ease;
  padding-right: 72px;
}

.header.header-hidden {
  transform: translateY(-100%);
}

.header-title {
  height: 100%;
  font-size: $size-4;
  height: $header-title-height;
  line-height: $header-title-height;

  font-family: 'Ubuntu Condensed', cursive;
  font-weight: bold;
}

.header-sub {
  height: $header-sub-height;
  line-height: $header-sub-height;
  margin-top: $header-margin;
  font-size: $size-7;
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
  color: #FDABCD;
}
</style>

<template lang="pug">
header.header(v-if="isSmallScreen", :class="{ 'header-hidden': isSidebarActive }")
  .header-title
    nuxt-link.nodeco-inline(to='/')
      span.accent E
      span NDAAMAN
      span.accent .
      span ME
  .header-sub
    nuxt-link.header-sub-item(:to="'/'") home
    span.header-sub-item /
    template(v-if="activeArticle")
      nuxt-link.header-sub-item(:to="'/?category=' + articleCategory.slug") {{ articleCategory.name }}
      span.header-sub-item /
    template(v-else)
      template(v-if="activeCategory")
        nuxt-link.header-sub-item(:to="'/?category=' + activeCategory.slug") カテゴリ：{{ activeCategory.name }}
        span.header-sub-item /
      template(v-if="activeTag")
        nuxt-link.header-sub-item(:to="'/?tag=' + activeTag") タグ：{{ activeTag }}
        span.header-sub-item /
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    articleCategory() {
      if (!this.activeArticle) {
        return null
      }
      const { parent } = this.activeArticle
      return this.$store.getters['category/findCategory'](parent || '-')
    },
    ...mapState('layout', [
      'isSidebarActive',
      'isSmallScreen',
      'activeArticle',
      'activeCategory',
      'activeTag',
    ]),
  },
}
</script>
