<style scoped lang="scss">
@import "../css/variables";

$breakpoint: 720px;

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

  .hamburger {
    display: none;
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
    transition: left ease .1s;
    z-index: 101;
  }

  .hamburger {
    display: block;
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
  opacity: .7;
}

.overlay-active {
  display: block;
}

.col-sidebar-active {
  box-shadow: 0 0 8px gray;
  left: 0;
}


$hm-size: 40px;
$hm-x: 24px;
$hm-y: 24px;
.hamburger {
  z-index: 101;
  content: $hm-size;
  position: fixed;
  right: $hm-x;
  top: $hm-y;
  width: $hm-size;
  height: $hm-size;
  border: 1px solid $black-ter;
}


$bar-y: 8px;
$bar-width: 24px;
$bar-weight: 2px;

.hamburger-bar {
  position: absolute;
  width: $bar-width;
  height: $bar-weight;
  background-color: $black-ter;
  transition: opacity ease 0.3s, transform ease 0.3s;

  left: ($hm-size - $bar-width) / 2 - 1px;
  top: ($hm-size - $bar-weight) / 2 - 1px;
}

.hamburger-is-times {
  border-color: $white-ter;
  .hamburger-bar {
    background-color: $white-ter;
  }

  .hamburger-bar.hamburger-bar1 {
    transform: rotate(45deg);
  }

  .hamburger-bar.hamburger-bar2 {
    transform: translateX(20%);
    opacity: 0;
  }

  .hamburger-bar.hamburger-bar3 {
    transform: rotate(-45deg);
  }
}

.hamburger-is-bars {
  .hamburger-bar.hamburger-bar1 {
    transform: translateY($bar-y);
  }

  .hamburger-bar.hamburger-bar2 {
    transform: translateX(0);
    opacity: 1;
  }

  .hamburger-bar.hamburger-bar3 {
    transform: translateY(-$bar-y);
  }
}


.hamburger-on-header {
  border-color: $white-ter;
  .hamburger-bar {
    background-color: $white-ter;
  }
}
</style>

<template lang="pug">
.row
  .overlay(@click="closeSidebar", :class="{ 'overlay-active': isSidebarActive }", ref="overlay")
  a.hamburger(:class="{ 'hamburger-is-times': isSidebarActive, 'hamburger-is-bars': !isSidebarActive }", @click="toggleSidebar")
    .hamburger-bar.hamburger-bar1
    .hamburger-bar.hamburger-bar2
    .hamburger-bar.hamburger-bar3
  .col-sidebar(:class="{ 'col-sidebar-active': isSidebarActive }")
    my-sidebar
  .col-main(:class="{ 'noscroll': isSidebarActive }")
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
      console.log('cli init')
      this.$store.dispatch('nuxtClientInit')
    }
  },
  mounted() {
    window.addEventListener('resize', debounce(this.onResize, 100))
    this.onResize()
  },
  methods: {
    onResize() {
      this.closeSidebar()
      const isSmall = !window.matchMedia(`(min-width: ${breakpoint}px)`).matches
      this.$store.dispatch('layout/setIsSmallScrern', isSmall)
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
