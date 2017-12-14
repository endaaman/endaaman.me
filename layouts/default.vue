<style scoped lang="scss">
@import "../css/variables";

$breakpoint: 720px;

@media screen and (min-width: $breakpoint) {
  .row {
    display: flex;
    flex-direction: row-reverse;
    width: 100%;  // this is needed for horizontal grow
  }

  .col-main {
    flex: 3;
    min-width: 0; // this is needed for pre tag sizing
  }

  .col-sidebar {
    flex: 1;
    align-self: flex-start;
    position: sticky;
    top: 0;
    min-width: 240px;
    max-width: 480px;
  }

  .hamburger {
    display: none;
  }
}

$sidebar-width: 320px;

@media screen and (max-width: $breakpoint - 1) {
  .col-sidebar {
    position: fixed;
    right: - $sidebar-width;
    // top: $my-header-hight;
    top: 0;
    bottom: 0;
    width: $sidebar-width;

    overflow-y: scroll;
    background-color: $white-ter;
    transition: right ease .1s;
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
  opacity: .5;
}

.overlay-active {
  display: block;
}

.col-sidebar-active {
  box-shadow: 0 0 8px gray;
  right: 0;
}


$hm-size: 32px;
$hm-x: 12px;
.hamburger {
  content: $hm-size;
  position: fixed;
  top: ($my-header-hight - $hm-size) / 2;
  right: $hm-x;
  width: $hm-size;
  height: $hm-size;
  border: 1px solid $black-ter;
}


$bar-y: 7px;
$bar-width: 22px;
$bar-weight: 2px;

.hamburger-bar {
  position: absolute;
  width: $bar-width;
  height: $bar-weight;
  background-color: $black-ter;
  left: ($hm-size - $bar-width) / 2 - 1px;
}

.hamburger-bar.hamburger-bar1 {
  top: $bar-y;
}

.hamburger-bar.hamburger-bar2 {
  top: ($hm-size - $bar-weight) / 2 - 1px;
}

.hamburger-bar.hamburger-bar3 {
  bottom: $bar-y;
}

.hamburger-on-header {
  border-color: $white-ter;
  .hamburger-bar {
    background-color: $white-ter;
  }
}
</style>

<template lang="pug">
.root
  .overlay(@click="closeSidebar", :class="{ 'overlay-active': isSidebarActive }", ref="overlay")
  my-header
  .row.container
    a.hamburger(:class="{ 'hamburger-on-header': !isScrolled }", @click="toggleSidebar")
      .hamburger-bar.hamburger-bar1
      .hamburger-bar.hamburger-bar2
      .hamburger-bar.hamburger-bar3
    .col-sidebar(:class="{ 'col-sidebar-active': isSidebarActive }")
      .section
        my-sidebar
    .col-main
      .section
        nuxt
  my-footer
</template>

<script>
import debounce from 'debounce'

export default {
  data: () => ({
    isScrolled: false,
    isSidebarActive: false,
  }),
  mounted() {
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', debounce(this.onResize, 100))
  },
  methods: {
    onResize() {
      this.closeSidebar()
    },
    onScroll() {
      this.isScrolled = window.scrollY > (60 - 40 / 2)
    },
    toggleSidebar() {
      if (this.isSidebarActive) {
        this.closeSidebar()
      } else {
        this.activateSidebar()
      }
    },
    closeSidebar() {
      this.isSidebarActive = false
      document.documentElement.classList.remove('noscroll')
      document.body.classList.remove('noscroll')
    },
    activateSidebar() {
      this.isSidebarActive = true
      document.documentElement.classList.add('noscroll')
      document.body.classList.add('noscroll')
    },
  }
}
</script>
