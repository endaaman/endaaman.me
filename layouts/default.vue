<style scoped lang="scss">
@import "../css/variables";

@media screen and (min-width: $breakpoint) {
  .row {
    display: flex;
    width: 100%;  // this is needed for horizontal grow
    height: 100vh;
  }

  .col-main {
    flex: 3;
    overflow-y: auto;
    min-width: 0; // this is needed for pre tag sizing
  }

  .col-sidebar {
    flex: 1;
    // align-self: flex-start;
    overflow-y: auto;
    min-width: 320px;
    max-width: 480px;

    display: flex;
    flex-direction: column;
    min-height: 100vh;
    height: 100%;
  }
}

$sidebar-width: 320px;

@media screen and (max-width: $breakpoint - 1) {
  .col-sidebar {
    position: fixed;
    // right: - $sidebar-width;
    // top: $my-header-hight;
    left: - $sidebar-width;
    top: 0;
    bottom: 0;
    width: $sidebar-width;

    overflow-y: auto;
    background-color: $white-ter;
    transition: left .1s ease;
    z-index: 101;
  }
}

.overlay {
  display: none;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 100;

  background-color: $black-ter;
  opacity: .5;
}

.overlay-active {
  display: block;
}

.col-sidebar-active {
  box-shadow: 0 0 8px $black;
  transition: left .1s ease .2s;
  left: 0;
}
</style>

<template lang="pug">
.row
  .overlay(@click="closeSidebar", :class="{ 'overlay-active': isSidebarActive }", ref="overlay")
  my-hamburger(:isActive="isSidebarActive", :isInversed="scrollTop < 20", @click="toggleSidebar", v-show="isSmallScreen")
  .col-sidebar(:class="{ 'col-sidebar-active': isSidebarActive }")
    my-sidebar
  .col-main(:class="{ 'noscroll': isSidebarActive }")
    my-header
    .main-inner
      nuxt
  // my-footer
</template>

<script>
import { mapState } from 'vuex'
import debounce from 'debounce'


const breakpoint = 720

export default {
  created() {
    if (!process.isServer) {
      this.$store.dispatch('nuxtClientInit')
    }
  },
  data() {
    return {
      scrollTop: 0,
    }
  },
  mounted() {
    window.addEventListener('resize', debounce(this.onResize, 50))
    window.addEventListener('scroll', debounce(this.onScroll, 50))
    this.onResize()
    this.onScroll()
  },
  methods: {
    onResize() {
      this.closeSidebar()
      const isSmall = !window.matchMedia(`(min-width: ${breakpoint}px)`).matches
      this.$store.dispatch('layout/setIsSmallScreen', isSmall)
    },
    onScroll() {
      this.scrollTop = document.documentElement.scrollTop
    },
    toggleSidebar() {
      if (this.isSidebarActive) {
        this.closeSidebar()
      } else {
        this.activateSidebar()
      }
    },
    closeSidebar() {
      this.$store.dispatch('layout/closeSidebar')
      document.documentElement.classList.remove('noscroll')
      document.body.classList.remove('noscroll')
    },
    activateSidebar() {
      this.$store.dispatch('layout/openSidebar')
      document.documentElement.classList.add('noscroll')
      document.body.classList.add('noscroll')
    },
  },
  computed: {
    ...mapState('layout', ['isSidebarActive', 'isSmallScreen']),
  }
}
</script>
