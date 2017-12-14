<style scoped lang="scss">
@import "../css/variables";

header {
  background-color: $black-ter;
  color: $white-ter;
}

h1 {
  font-family: 'Ubuntu Condensed', cursive;
  font-weight: bold;
  text-align: center;
  height: 100%;

  font-size: 24px;
  height: $my-header-hight;
  line-height: $my-header-hight;
}

.accent {
  color: #FDABCD;
}
</style>

<template lang="pug">
header
  h1
    nuxt-link.nodeco-inline(to='/')
      span.accent E
      span NDAAMAN
      span.accent .
      span ME
</template>
