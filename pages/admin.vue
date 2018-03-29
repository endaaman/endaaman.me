<style scoped lang="scss">
@import "../css/variables";

.container-admin {

}

</style>

<template lang="pug">
.container-admin
  .section
    .tabs
      ul
        li(v-for="l in links", :key="l.label", :class="{ 'is-active': isActive(l) }")
          nuxt-link(:to="l.href") {{ l.label }}

    nuxt-child
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  layout: 'simple',
  head() {
    return {
      title: 'Admin',
    }
  },
  methods: {
    isActive(l) {
      const { path } = this.$route
      if (l.href === '/admin') {
        return path === l.href
      } else {
        return path.startsWith(l.href)
      }
    }
  },
  computed: {
    links() {
      return [
        {
          label: 'Admin Top',
          href: '/admin',
        }, {
          label: 'Article',
          href: '/admin/article',
        }, {
          label: 'File',
          href: '/admin/file',
        }
      ]
    }
  },
  watch: {
    $route(from, to, next) {
      // console.log(from, to, next)
    },
  },
}
</script>
