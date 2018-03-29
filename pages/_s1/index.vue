<template lang="pug">
.container-s1
  p redirecting...
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  fetch({ redirect }) {
    // search aliases
    // search aliases
    console.log('fetch')
    redirect('/-/about')
  },
}
</script>
