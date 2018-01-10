<style scoped lang="scss">
@import "../css/variables";
footer {
  margin-top: auto;

  height: 24px;
  line-height: 24px;
  font-size: 14px;

  background-color: $black-ter;
  color: $white-ter;
}

.footer-content {
  padding: 0 24px;
}

.footer-right-text {
  float: right;
  font-style: italic;
  margin-left: 8px;
}

.footer-left-text {
  float: left;
  margin-right: 16px;
}
</style>

<template lang="pug">
footer
  .container
    .footer-content
      span.footer-left-text(v-if="!authorized")
        nuxt-link.nodeco-inline(to="/login") Login
      span.footer-left-text(v-if="authorized")
        nuxt-link.nodeco-inline(to="/logout") Logout
      span.footer-left-text(v-if="authorized")
        nuxt-link.nodeco-inline(to="/file") File

      span.footer-right-text Built at {{ builtAt | date('YYYY-MM-DD') }}
</template>


<script>
import fecha from 'fecha'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'authorized'
    ]),
    ...{
      builtAt() {
        return new Date(process.env.builtAt)
      }
    }
  }
}
</script>
