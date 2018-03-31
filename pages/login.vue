<style scoped lang="scss">
@import "../css/variables";

// .container-login {
//   margin: 0 auto;
//   max-width: 480px;
// }
</style>

<template lang="pug">
.container-login.section
  .notification.is-danger(v-if="errorMessage")
    button.delete(@click="errorMessage = ''")
    | {{ errorMessage }}
  form(v-on:submit.prevent="performLogin")
    .field
      label.lavel 俺用
      p.control
        input.input(type="password" placeholder="Password" ref="password")
    .field
      button.button(:class="{ 'is-loading': isLoading }") Login
</template>

<script>
import { mapState } from 'vuex'

export default {
  head() {
    return {
      title: 'Logout',
    }
  },
  data: () => ({
    isLoading: false,
    errorMessage: '',
  }),
  methods: {
    async performLogin() {
      this.isLoading = true
      this.errorMessage = ''
      const { error } = await this.$store.dispatch('login', {
        password: this.$refs.password.value
      })
      this.isLoading = false

      if (error) {
        this.errorMessage = error.message
      } else {
        this.$router.push('/')
        this.$toast.open({
          message: 'Logged in',
        })
      }
    }
  }
}

</script>
