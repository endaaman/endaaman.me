<style scoped lang="scss">
</style>

<template lang="pug">
form.admin-article-edit-root(v-if="originalArticle", v-on:submit.prevent="update")
  ul.list-inline
    li
      nuxt-link.button.is-small(:to="'/admin/article'") Back to list
    li
      nuxt-link.button.is-small(:to="originalArticle.getHref()") Show article
    li
      input.button.is-primary.is-small(type="submit", value="Update")
    li.list-item-right
      input.button.is-danger.is-small(type="button", @click="tryDelete", value="Delete")

  my-article-form(
    :article="edittingArticle",
    :originalArticle="originalArticle",
    @save="update")
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  validate({ redirect, query, store}) {
    const { relative } = query
    return store.getters['article/getArticleByRelative'](relative)
  },
  beforeRouteLeave(to, from, _next) {
    const next = () => {
      this.unbind()
      _next()
    }
    if (this.isChanged) {
      this.confirmPageLeave(next)
      return
    }
    next()
  },
  data() {
    return {
      changedAlertMessage: 'Now you editting and there are some changes on the article. Ok to leaven this page?',
      edittingArticle: null,
      originalArticle: null,
      onBeforeUnload: (e) => {
        if (this.isChanged) {
          e.returnValue = this.changedAlertMessage
        }
      },
    }
  },
  created() {
    const { relative } = this.$route.query
    this.originalArticle = this.getArticleByRelative(relative)
    this.edittingArticle = this.originalArticle.copy()
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
    ...mapGetters('article', ['getArticleByRelative']),
  },
  methods: {
    unbind() {
      window.removeEventListener('beforeunload', this.onBeforeUnload)
    },
    async update() {
      const loading = this.$buefy.loading.open()
      const { error, data } = await this.$store.dispatch('article/updateArticles', {
        article: this.edittingArticle
      })
      loading.close()
      if (error) {
        this.$buefy.dialog.alert({
          title: 'Error',
          message: error,
          type: 'is-danger',
        })
        return
      }
      this.$router.push('/admin/article/edit?relative=' + data.getRelative())
      await this.$nextTick()
      this.originalArticle = data
      this.edittingArticle = this.originalArticle.copy()
      this.$buefy.toast.open({
        message: `Updated "${ this.edittingArticle.title }"`,
      })
    },
    async tryDelete() {
      this.$buefy.dialog.confirm({
        title: 'Confim delete',
        message: `OK to delete 「${ this.edittingArticle.slug }」`,
        cancelText: 'Cancel',
        confirmText: 'OK',
        type: 'is-danger',
        onConfirm: () => { this.delete() }
      })
    },
    async delete() {
      const loading = this.$buefy.loading.open()
      const { error } = await this.$store.dispatch('article/deleteArticles', {
        article: this.edittingArticle
      })
      loading.close()
      if (error) {
        this.$buefy.dialog.alert({
          title: 'Error',
          message: error,
          type: 'is-danger',
        })
        return
      }
      this.$router.push('/admin/article')
      await this.$store.dispatch('article/fetchArticles')
      this.$buefy.toast.open({
        message: `Deleted "${ this.edittingArticle.title }"`,
      })
    },
    confirmPageLeave(cb) {
      this.$buefy.dialog.confirm({
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
