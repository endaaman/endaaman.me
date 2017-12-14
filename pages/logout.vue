<style scope lang="scss">
@import "../css/variables";

.container-logout {
  width: 480px;
  margin: 0 auto;
}
</style>

<template lang="pug">
.container-logout
  form(v-on:submit.prevent="performLogout")
    .field
      button.button Logout
</template>

<script>
export default {
  layout: 'simple',
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
