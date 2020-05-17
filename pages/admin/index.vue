<style scoped lang="scss">
</style>

<template lang="pug">
.admin-index-root
  .content
    h3 Status
    pre {{ status | json }}
    button.button.is-primary(v-on:click="restartWatcher()") Restart watcher

    h3 Token
    pre {{ token }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  async fetch({ store }) {
    await store.dispatch('fetchStatus')
  },
  computed: {
    ...mapState(['status', 'token']),
  },
  methods: {
    async restartWatcher() {
      const { data } = await this.$store.dispatch('restartWatcher')
      this.$buefy.toast.open({
        message: data.message,
      })
      // await this.$store.dispatch('restartWatcher')
    }
  }
}
</script>
