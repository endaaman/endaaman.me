<style scoped lang="scss">
@import "../css/variables";

.container-admin {

}

</style>

<template lang="pug">
.container.container-admin
  .section
    .tabs
      ul
        li(v-for="l in links", :key="l.label", :class="{ 'is-active': $route.path === l.href }")
          nuxt-link(:to="l.href") {{ l.label }}

    nuxt-child
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  layout: 'simple',
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
