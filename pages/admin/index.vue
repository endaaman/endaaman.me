<style scoped lang="scss">
@import "../../css/variables";

</style>

<template lang="pug">
.container-admin-article
  pre {{ warnings | json }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  async fetch({ store }) {
    await store.dispatch('fetchWarnings')
  },
  computed: {
    ...mapState(['warnings']),
  },
}
</script>
