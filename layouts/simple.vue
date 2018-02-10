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
  my-header
  .container
    nuxt
  my-footer
</template>


<script>
export default {
  created() {
    if (!process.isServer) {
      console.log('cli init')
      this.$store.dispatch('nuxtClientInit')
    }
  },
}
</script>
