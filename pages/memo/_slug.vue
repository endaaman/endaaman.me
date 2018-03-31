<template lang="pug">
.container-s1
  p redirecting...
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  fetch({ redirect, store, params, error }) {
    const articles = store.state.article.articles
    const { slug } = params
    if (!slug) {
      redirect('/')
      return
    }
    for (const a of articles) {
      if (a.slug === slug) {
        redirect(a.getHref())
        return
      }
    }
    for (const a of articles) {
      if (a.aliases.includes(slug)) {
        redirect(a.getHref())
        return
      }
    }
    error({
      statusCode: 404,
      message: 'Not found'
    })
  },
}
</script>
