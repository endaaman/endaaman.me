<template lang="pug">
div
</template>

<script>
import { mapState, mapActions } from 'vuex'
import debounce from 'debounce'

const breakpoint = 768

export default {
  beforeCreate() {
    if (!process.isServer) {
      this.$store.dispatch('nuxtClientInit')
    }
  },
  mounted() {
    window.addEventListener('resize', debounce(this.onResize, 50))
    this.onResize()
    this.$store.dispatch('layout/setIsSizeCalculated', true)
  },
  methods: {
    onResize() {
      const isSmall = window.matchMedia(`(max-width: ${breakpoint}px)`).matches
      this.$store.dispatch('layout/setIsSmallScreen', isSmall)
      this.closeSidebar()
    },
    ...mapActions('layout', [
      'closeSidebar',
    ]),
  },
}
</script>
