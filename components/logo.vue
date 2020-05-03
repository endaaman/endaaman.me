<style scoped lang="scss">
@import "../css/variables";

$logo-bg: $sidebar-bg;
$logo-size: 140px;
$accent-color: $primary;

$wait: .5s;
$t: .7s;

a.logo-root {
  color: inherit;
  text-decoration: none;
  display: block;

  position: relative;
  height: $logo-size;
  width: $logo-size;
  margin: 24px auto;

  user-select: none;
  &:hover {
    .logo {
      background-color: $accent-color;
    }
  }
}

.logo {
  position: absolute;
  height: $logo-size;
  width: $logo-size;
  background-color: $white-ter;
  transition: background-color ease 2s;

  transform: rotate(-135deg) scale(0);
  .animated-show & {
    animation:
      grow $t ease $wait normal forwards,
      rotate $t ease $wait+$t normal forwards;
  }
}

.logo-inner {
  position: absolute;
  top: 2px;
  left: 2px;
  height: $logo-size - 4px;
  width: $logo-size - 4px;
  background-color: $sidebar-bg;

  transform: rotate(-135deg) scale(0);
  .animated-show & {
    animation:
      grow $t*0.8 ease $wait+$t*0.2 normal forwards,
      rotate $t ease $wait+$t normal forwards;
  }
}

@keyframes grow {
  from { transform: rotate(-45deg) scale(0); }
  to { transform: rotate(-45deg) scale(1); }
}
@keyframes rotate {
  from { transform: rotate(-135deg) scale(1); }
  to { transform: rotate(0deg) scale(1); }
}

.logo-title {
  line-height: $logo-size;
  text-align: center;
  transform: rotate(0deg) scale(1);
}

.accent-char {
  color: $primary;
  opacity: 0;
  .animated-show & {
    animation: fadein $t*2 ease $wait+$t*3 normal both;
  }
}

.normal-char {
  color: $white-ter;
  opacity: 0;
  .animated-show & {
    animation: fadein $t*2 ease $wait+$t*3.2 normal both;
  }
}

@keyframes fadein {
  from { opacity: 0; }
  to { opacity: 1; }
}

</style>

<template lang="pug">
nuxt-link.logo-root(ref="logo", :to="'/'", :class="{ 'animated-show': isAnimated }")
  .logo
  .logo-inner
  .logo-title
    span.accent-char E
    span.normal-char NDAAMAN
    span.accent-char .
    span.normal-char ME
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      isAnimated: false ,
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.isSmallScreen) {
        this.isAnimated = true
      }
    })
  },
  watch: {
    isSidebarActive(flag) {
      if (flag) {
        this.isAnimated = true
      }
    },
    isSmallScreen(flag) {
      if (!flag) {
        this.isAnimated = true
      }
    },
  },
  computed: {
    ...mapState('layout', [
      'isSmallScreen', 'isSidebarActive',
    ]),
  }
}
</script>
