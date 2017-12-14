<style scoped lang="scss">
@import "../css/variables";

.container-login {
  max-width: 480px;
}
</style>

<template lang="pug">
.container-login
  .notification.is-danger(v-if="errorMessage")
    button.delete(@click="errorMessage = ''")
    | {{ errorMessage }}
  p 俺用
  form(v-on:submit.prevent="performLogin")
    .field
      label.lavel Password
      p.control
        input.input(type="password" placeholder="Password" ref="password")
    .field
      button.button(:class="{ 'is-loading': isLoading }") Login
</template>

<script>
import { mapState } from 'vuex'

export default {
  layout: 'simple',
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
          position: 'is-bottom',
        })
      }
    }
  }
}

</script>
