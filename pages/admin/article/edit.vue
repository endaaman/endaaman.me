<style scoped lang="scss">
@import "../../../css/variables";

</style>

<template lang="pug">
.container-admin-article-edit(v-if="originalArticle")
  form(v-on:submit.prevent="update")
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
import { mapState } from 'vuex'

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
      onBeforeUnload: (e) => {
        if (this.isChanged) {
          e.returnValue = this.changedAlertMessage
        }
      },
    }
  },
  created() {
    this.edittingArticle = this.originalArticle.copy()
  },
  mounted() {
    window.addEventListener('beforeunload', this.onBeforeUnload, false)
  },
  beforeDestory() {
    this.unbind()
  },
  computed: {
    originalArticle() {
      const { relative } = this.$route.query
      return this.$store.getters['article/getArticleByRelative'](relative)
    },
    isChanged() {
      return !this.originalArticle.equals(this.edittingArticle)
    },
  },
  methods: {
    unbind() {
      window.removeEventListener('beforeunload', this.onBeforeUnload)
    },
    async update() {
      const loading = this.$loading.open()
      const { error, data } = await this.$store.dispatch('article/updateArticles', {
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
      this.$router.push('/admin/article/edit?relative=' + data.getRelative())
      await this.$nextTick()
      this.edittingArticle = this.originalArticle.copy()
      this.$toast.open({
        message: `Updated "${ this.edittingArticle.title }"`,
      })
    },
    async tryDelete() {
      this.$dialog.confirm({
        title: 'Confim delete',
        message: `OK to delete 「${ this.edittingArticle.slug }」`,
        cancelText: 'Cancel',
        confirmText: 'OK',
        type: 'is-danger',
        onConfirm: () => { this.delete() }
      })
    },
    async delete() {
      const loading = this.$loading.open()
      const { error } = await this.$store.dispatch('article/deleteArticles', {
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
      this.$router.push('/admin/article')
      await this.$store.dispatch('article/fetchArticles')
      this.$toast.open({
        message: `Deleted "${ this.edittingArticle.title }"`,
      })
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
