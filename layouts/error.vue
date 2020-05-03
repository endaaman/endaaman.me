<style scoped lang="scss">
@import "../css/variables";
.error-root {
  text-align: center;
  h1 {
    font-size: 64px;
  }
}

</style>
<template lang="pug">

.error-root
  h1 {{error.statusCode}}
  p {{error.message}}
  nuxt-link(to="/") Home

</template>
<script>

export default {
  props: ['error'],
  head() {
    return {
      title: this.error.statusCode,
    }
  }
}
</script>
