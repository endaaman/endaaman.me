<style scoped lang="scss">
@import "../css/variables";

.container-logout {
  margin: 0 auto;
  max-width: 480px;
}
</style>

<template lang="pug">
.container-logout
  p さようなら、俺
  form(v-on:submit.prevent="performLogout")
    .field
      button.button Logout
</template>

<script>
export default {
  data: () => ({
    loading: false,
    errorMessage: '',
  }),
  methods: {
    async performLogout() {
      await this.$store.dispatch('logout')
      this.$router.push('/')
      this.$toast.open({
        message: 'Logged out',
        position: 'is-bottom',
      })
    },
  }
}

</script>
