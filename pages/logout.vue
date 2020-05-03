<template lang="pug">
.logout-root
  p さようなら、俺
  form(v-on:submit.prevent="performLogout")
    .field
      button.button Logout
</template>

<script>
export default {
  head() {
    return {
      title: 'Logout',
    }
  },
  data: () => ({
    loading: false,
    errorMessage: '',
  }),
  methods: {
    async performLogout() {
      await this.$store.dispatch('logout')
      this.$router.push('/')
      this.$buefy.toast.open({
        message: 'Logged out',
      })
    },
  }
}

</script>
