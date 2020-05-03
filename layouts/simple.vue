<style scoped lang="scss">
@import "../css/variables";

$breakpoint: 720px;

.simple-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100%;
}

.row-header { }

.row-main {
  flex-grow: 1;
  padding: 8px 24px 8px;

  display: flex;
  flex-direction: column;
}

</style>

<template lang="pug">
.simple-root
  my-common
  .row-header
    my-header
  .row-main
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
