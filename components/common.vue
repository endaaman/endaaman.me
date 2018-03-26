<template lang="pug">
div
</template>

<script>
export default {
  beforeCreate() {
    if (!process.isServer) {
      this.$store.dispatch('nuxtClientInit')
    }
  },
}
</script>
