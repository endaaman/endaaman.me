<template lang="pug">
.container-admin-article-new
  form(v-on:submit.prevent="create")
    ul.list-inline
      li
        nuxt-link.button.is-small(:to="'/admin/article'") Back to list
      li
        input.button.is-primary.is-small(type="submit", value="Create")

    my-article-form(
      :article="edittingArticle",
      :originalArticle="originalArticle",
      @save="create")
</template>

<script>
import { mapState } from 'vuex'
import { Article } from '../../../models/'

export default {
  beforeRouteLeave(to, from, _next) {
    const next = () => {
      this.unbind()
      _next()
    }
    if (this.editting && this.isChanged) {
      this.confirmPageLeave(next)
      return
    }
    next()
  },
  data() {
    const originalArticle = new Article()
    return {
      changedAlertMessage: 'Now you editting and there are some changes on the article. Ok to leaven this page?',
      originalArticle,
      edittingArticle: originalArticle.copy(),
      editting: true,
      onBeforeUnload: (e) => {
        console.log(this.editting)
        if (this.editting && this.isChanged) {
          e.returnValue = this.changedAlertMessage
        }
      },
    }
  },
  mounted() {
    window.addEventListener('beforeunload', this.onBeforeUnload, false)
  },
  beforeDestory() {
    this.unbind()
  },
  computed: {
    isChanged() {
      return !this.originalArticle.equals(this.edittingArticle)
    },
  },
  methods: {
    unbind() {
      window.removeEventListener('beforeunload', this.onBeforeUnload)
    },
    async create() {
      const loading = this.$loading.open()
      const { error, data } = await this.$store.dispatch('article/createArticles', {
        article: this.edittingArticle
      })
      loading.close()
      if (error) {
        this.$dialog.alert({
          title: 'Error',
          message: error,
          type: 'is-danger',
        })
        return
      }
      this.editting = false
      this.$toast.open({
        message: 'Created',
        position: 'is-bottom',
      })
      this.$router.push('/admin/article/edit?relative=' + data.getRelative())
    },
    confirmPageLeave(cb) {
      this.$dialog.confirm({
        message: this.changedAlertMessage,
        cancelText: 'Cancel',
        confirmText: 'OK',
        type: 'is-danger',
        onConfirm: () => cb()
      })
    },
  },
}
</script>
