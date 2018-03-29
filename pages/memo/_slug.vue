<template lang="pug">
.container-s1
  p redirecting...
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  fetch({ redirect }) {
    // 1. search uncat slug
    // 2. search uncat aliases
    // 3. search all slug
    // 4. search all aliases
    console.log('fetch')
    redirect('/-/about')
  },
}
</script>
