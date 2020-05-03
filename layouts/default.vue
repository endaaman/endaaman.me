<style scoped lang="scss">
@import "../css/variables";

.default-root {
  min-height: 100vh;
  height: 100vh;
}

.col-main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100%;
}

@media screen and (min-width: $breakpoint) {
  .default-root {
    display: flex;
    width: 100%;  // this is needed for horizontal grow
  }

  .col-main {
    flex: 3;
    overflow-y: auto;
  }

  .col-sidebar {
    flex: 1;
    // align-self: flex-start;
    /* overflow-y: auto; */
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

    /* overflow-y: auto; */
    background-color: $white-ter;
    transition: left .1s ease;
    z-index: 101;
  }
}

.row-header { }

.row-main {
  flex-grow: 1;
  padding: 24px 24px 12px;
  margin-left: 0;
  min-width: 0; // this is needed for pre tag sizing
  max-width: $breakpoint;
  width: 100%; // fix for flex parent
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

.col-sidebar {
  background-color: $sidebar-bg;
}

.col-sidebar-active {
  box-shadow: 0 0 8px $black;
  transition: left .1s ease .2s;
  left: 0;
}

.sider-wrapper {
  height: 100vh;
  min-height: 100vh;
  max-height: 100vh;
}
</style>

<template lang="pug">
.default-root
  my-common
  b-loading(:active="!delayed", :can-cancel="true")
  .overlay(@click="closeSidebar", :class="{ 'overlay-active': isSidebarActive }")
  my-burger(:isActive="isSidebarActive", :isInversed="scrollTop < 40", @click="toggleSidebar", v-show="isSmallScreen")
  .col-sidebar(:class="{ 'col-sidebar-active': isSidebarActive }")
    transition(name="fade")
      simplebar.sider-wrapper(v-show="delayed")
        my-sidebar
  transition(name="fade")
    .col-main(:class="{ 'noscroll': isSidebarActive }")
      .row-header(v-show="delayed")
        my-header
      .row-main(v-show="delayed")
        nuxt
</template>

<script>
import { mapState, mapActions } from 'vuex'
import debounce from 'debounce'


export default {
  data() {
    return {
      scrollTop: 0,
      delayed: false,
    }
  },
  mounted() {
    this.delayed = true
    window.addEventListener('scroll', debounce(this.onScroll, 50))
    this.onScroll()
  },
  methods: {
    onScroll() {
      this.scrollTop = document.documentElement.scrollTop
    },
    ...mapActions('layout', [
      'closeSidebar',
      'toggleSidebar',
    ]),
  },
  watch: {
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
