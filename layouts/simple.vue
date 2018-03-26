<style scoped lang="scss">
@import "../css/variables";

$breakpoint: 720px;

.root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100%;
}
</style>

<template lang="pug">
.root
  my-common
  my-header
  .container
    nuxt
</template>

<script>
export default {
  created() {
    if (!process.isServer) {
      this.$store.dispatch('nuxtClientInit')
    }
  },
}
</script>
