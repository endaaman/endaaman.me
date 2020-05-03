<style scoped lang="scss">
@import "../../css/variables";
</style>

<template lang="pug">
.admin-index-root
  .content
    h3 Status
    pre {{ warnings | json }}

    h3 Token
    pre {{ token }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  async fetch({ store }) {
    await store.dispatch('fetchWarnings')
  },
  computed: {
    ...mapState(['warnings', 'token']),
  },
}
</script>
