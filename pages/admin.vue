<style scoped lang="scss">
@import "../css/variables";

.admin-root {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.admin-main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
</style>

<template lang="pug">
.admin-root
  .admin-tabs
    .tabs
      ul
        li(v-for="l in links", :key="l.label", :class="{ 'is-active': isActive(l) }")
          nuxt-link(:to="l.href") {{ l.label }}

  .admin-main
    nuxt-child

</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  layout: 'simple',
  middleware: 'auth',
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
}
</script>
