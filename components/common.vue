<template lang="pug">
div
</template>

<script>
import { mapState, mapActions } from 'vuex'
import eventListener from '~/mixins/event-listener'

const breakpoint = 768

export default {
  mixins: [eventListener('resize', 100)],
  beforeCreate() {
    if (!process.isServer) {
      this.$store.dispatch('nuxtClientInit')
    }
  },
  mounted() {
    this.onResize()
    this.$store.dispatch('layout/setIsSizeCalculated', true)
  },
  methods: {
    onResize() {
      const isSmall = !!window.matchMedia(`(max-width: ${breakpoint}px)`).matches
      this.$store.dispatch('layout/setIsSmallScreen', isSmall)
      this.closeSidebar()
    },
    ...mapActions('layout', [
      'closeSidebar',
    ]),
  },
}
</script>
