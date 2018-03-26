<style scoped lang="scss">
@import "../css/variables";

$hm-color: $black-ter;
$hm-color-inversed: $white-ter;
$hm-color-darker: $black;

$hm-size: 40px;
$hm-x: 24px;
$hm-y: ($header-height - $hm-size) / 2;
.hamburger {
  display: block;
  z-index: 102;
  content: $hm-size;
  position: fixed;
  right: $hm-x;
  top: $hm-y;
  width: $hm-size;
  height: $hm-size;
  border: 1px solid $hm-color;
  transition: border-color ease 0.3s;
  .hamburger-bar {
    transition: background-color ease 0.3s;
  }
}

.hamburger-is-inversed {
  border-color: $hm-color-inversed;
  .hamburger-bar {
    background-color: $hm-color-inversed;
  }
}

.hamburger-is-darker {
  border-color: $hm-color-darker;
  .hamburger-bar {
    background-color: $hm-color-darker;
  }
}

$bar-y: 8px;
$bar-width: 24px;
$bar-weight: 2px;
.hamburger-bar {
  position: absolute;
  z-index: 102;
  width: $bar-width;
  height: $bar-weight;
  background-color: $hm-color;
  transition: opacity ease 0.3s, transform ease 0.3s;

  left: ($hm-size - $bar-width) / 2 - 1px;
  top: ($hm-size - $bar-weight) / 2 - 1px;
}

.hamburger-is-times {
  .hamburger-bar {
    &.hamburger-bar1 {
      transform: rotate(45deg);
    }
    &.hamburger-bar2 {
      transform: translateX(20%);
      opacity: 0;
    }
    &.hamburger-bar3 {
      transform: rotate(-45deg);
    }
  }
}

.hamburger-is-bars {
  .hamburger-bar {
    &.hamburger-bar1 {
      transform: translateY($bar-y);
    }
    &.hamburger-bar2 {
      transform: translateX(0);
      opacity: 1;
    }
    &.hamburger-bar3 {
      transform: translateY(-$bar-y);
    }
  }
}
</style>

<template lang="pug">
a.hamburger(:class="cl", @click="onClick")
  .hamburger-bar.hamburger-bar1
  .hamburger-bar.hamburger-bar2
  .hamburger-bar.hamburger-bar3
</template>

<script>
export default {
  props: {
    isActive: {
      type: Boolean,
      required: true
    },
    isInversed: {
      type: Boolean,
      required: true
    },
  },
  computed: {
    cl() {
      return {
        'hamburger-is-times': this.isActive,
        'hamburger-is-inversed': this.isInversed || this.isActive,
        'hamburger-is-bars': !this.isActive,
      }
    }
  },
  methods: {
    onClick(e) {
      this.$emit('click', e)
    }
  },
}
</script>
