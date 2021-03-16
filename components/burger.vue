<style scoped lang="scss">
@import "../css/variables";

$hm-color: $grey-dark;
$hm-color-inversed: $white-ter;
$hm-color-darker: $black;

$hm-size: 40px;
$hm-x: 24px;
$hm-y: ($header-height - $hm-size) / 2;
.burger {
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
  .burger-bar {
    transition: background-color ease 0.3s;
  }

  @media screen and (min-width: $breakpoint) {
    display: none;
  }
  box-shadow: 0px 0px 2px black;
}

.burger-is-inversed {
  border-color: $hm-color-inversed;
  .burger-bar {
    background-color: $hm-color-inversed;
  }
}

.burger-is-darker {
  border-color: $hm-color-darker;
  .burger-bar {
    background-color: $hm-color-darker;
  }
}

$bar-y: 8px;
$bar-width: 24px;
$bar-weight: 2px;
.burger-bar {
  position: absolute;
  z-index: 102;
  width: $bar-width;
  height: $bar-weight;
  background-color: $hm-color;
  transition: opacity ease 0.3s, transform ease 0.3s;

  left: ($hm-size - $bar-width) / 2 - 1px;
  top: ($hm-size - $bar-weight) / 2 - 1px;
}

.burger-is-times {
  .burger-bar {
    &.burger-bar1 {
      transform: rotate(45deg);
    }
    &.burger-bar2 {
      transform: translateX(20%);
      opacity: 0;
    }
    &.burger-bar3 {
      transform: rotate(-45deg);
    }
  }
}

.burger-is-bars {
  .burger-bar {
    &.burger-bar1 {
      transform: translateY($bar-y);
    }
    &.burger-bar2 {
      transform: translateX(0);
      opacity: 1;
    }
    &.burger-bar3 {
      transform: translateY(-$bar-y);
    }
  }
}
</style>

<template lang="pug">
a.burger(:class="cl", @click="onClick")
  .burger-bar.burger-bar1
  .burger-bar.burger-bar2
  .burger-bar.burger-bar3
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
        'burger-is-times': this.isActive,
        'burger-is-inversed': this.isInversed || this.isActive,
        'burger-is-bars': !this.isActive,
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
