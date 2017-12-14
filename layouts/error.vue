<style scoped lang="scss">
@import "../css/layout.scss";
.container-error {
  text-align: center;
  h1 {
    font-size: 64px;
  }
}
</style>

<template lang="pug">
.root
  my-header
  .container
    .section
      .container-error
        h1 {{error.statusCode}}
        p {{error.message}}
        nuxt-link(to="/") Home
  my-footer
</template>

<script>
export default {
  layout: 'simple',
  props: ['error'],
}
</script>
