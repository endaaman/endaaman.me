<style scoped lang="scss">
@import "../css/variables";

.default-root {
}


@media screen and (min-width: $breakpoint) {
  .row {
    display: flex;
  }

  .row-fixed {
    pointer-events: none;
    display: flex;
    position: fixed;
    min-height: 100vh;
    height: 100vh;
    width: 100%;
  }

  .col-main {
    flex: 3;
  }

  .col-sidebar {
    flex: 1;
    min-width: 320px;
    max-width: 480px;
  }

  .header-container {
    margin-bottom: 8px;
  }

  .main-container {
    flex-grow: 1;
    margin-left: 0;

    padding: 0px $common-horizontal-padding;
    width: 100%; /* fix for flex parent */
    min-width: 0; /* this is needed for pre tag sizing */
    max-width: $breakpoint;
    @media screen and (min-width: $fullhd) {
      /* large */
      max-width: $desktop;
    }
  }

  .sidebar-wrapper {
    position: sticky;
    top: 0;
    min-height: 100vh;
    max-height: 100vh;
  }
}


$sidebar-width: 320px;

@media screen and (max-width: $breakpoint - 1) {
  .main-container {
    padding: 16px $common-horizontal-narrow-padding 24px;
  }

  .col-sidebar {
    position: fixed;
    /* right: - $sidebar-width; */
    /* top: $my-header-hight; */
    left: - $sidebar-width;
    top: 0;
    bottom: 0;
    width: $sidebar-width;

    overflow-y: auto;
    background-color: $white-ter;
    transition: left .1s ease;
    z-index: 101;
  }

  .col-sidebar-active {
    box-shadow: 0 0 8px $black;
    transition: left .1s ease .2s;
    left: 0;
  }

  .sidebar-wrapper {
    height: 100%;
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
</style>

<template lang="pug">
.default-root
  my-common
  .overlay(@click="closeSidebar", :class="{ 'overlay-active': isSidebarActive }")
  b-loading(:active="!loaded", :can-cancel="true")
  my-burger(:isActive="isSidebarActive", :isInversed="isSidebarActive || scrollTop < 40", @click="toggleSidebar")
  .row
    .col-sidebar(:class="{ 'col-sidebar-active': isSidebarActive }")
      transition(name="fade")
        .sidebar-wrapper(v-show="loaded")
          my-sidebar
    transition(name="fade")
      .col-main(ref="scroller")
        .header-container(v-show="loaded")
          my-header
        .main-container(v-show="loaded")
          nuxt

</template>

<script>
import { mapState, mapActions } from 'vuex'
import debounce from 'debounce'


export default {
  data: () => ({
    scrollTop: 0,
    loaded: false,
  }),
  mounted() {
    window.document.body.addEventListener('scroll', debounce(this.onScroll, 100))
    this.loaded = true
    this.onScroll()
  },
  methods: {
    onScroll() {
      this.scrollTop = window.document.body.scrollTop
    },
    ...mapActions('layout', [
      'closeSidebar',
      'toggleSidebar',
    ]),
  },
  watch: {
    $route(from, to) {
      console.log('route change')
    },
    isSidebarActive(flag) {
      document.documentElement.classList.toggle('noscroll', flag)
      document.body.classList.toggle('noscroll', flag)
    },
  },
  computed: {
    ...mapState('layout', ['isSidebarActive', 'isSmallScreen', 'isSizeCalculated']),
  }
}
</script>
