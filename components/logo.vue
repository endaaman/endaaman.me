<style scoped lang="scss">
@import "../css/variables";

$logo-size: 140px;
$accent-color: $primary;

$wait: 1s;
$t: .5s;

a.logo-container {
  color: inherit;
  text-decoration: none;
  display: block;

  position: relative;
  height: $logo-size;
  width: $logo-size;
  margin: 24px auto;

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
  // border-radius: $logo-size / 2;
  background-color: $white-ter;

  animation:
    wait-rotated-scaled $wait,
    grow $t ease $wait,
    wait-rotated $t ease $wait+$t,
    rotate $t ease $wait+$t*2;

  transition: background-color ease 1s;
}

.logo-inner {
  position: absolute;
  top: 2px;
  left: 2px;
  height: $logo-size - 4px;
  width: $logo-size - 4px;
  background-color: $black-ter;

  animation:
    wait-rotated-scaled $wait+$t*0.5,
    grow $t*1.5 ease $wait+$t*0.5,
    rotate $t ease $wait+$t*2;
}


@keyframes wait-rotated-scaled {
  from { transform: rotate(-45deg) scale(0); }
  to { transform: rotate(-45deg) scale(0); }
}
@keyframes wait-rotated {
  from { transform: rotate(-45deg) scale(1); }
  to { transform: rotate(-45deg) scale(1); }
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

  animation-name: delayedFadeIn;
  animation-duration: $t*2;
  animation-delay: $t*6;
  animation-fill-mode: both;
}

.accent {
  color: $primary;
  // color: $white-ter;
  // animation-name: delayedColor;
  // animation-duration: $t;
  // animation-delay: $t*7;
  // animation-fill-mode: both;
}

.normal-char {
  color: $white-ter;
  animation-name: delayedColor;
  animation-direction: reverse;
  animation-duration: $t;
  animation-delay: $t*7;
  animation-fill-mode: both;
}

@keyframes delayedFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes delayedColor {
  from { color: $white-ter; }
  to { color: $accent-color; }
}

</style>

<template lang="pug">
nuxt-link.logo-container(:to="'/'")
  .logo
  .logo-inner
  .logo-title
    span.accent E
    span.normal-char NDAAMAN
    span.accent .
    span.normal-char ME
</template>


<script>
</script>
