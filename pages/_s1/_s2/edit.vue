<style scoped lang="scss">
// @import "../../../../css/variables";
</style>

<template lang="pug">
.container-article-edit.section
  b-tabs(v-model="activeTab", :animated="false")
    b-tab-item(label="Options")
      form
        b-field(label="Slug", horizontal)
          b-input(v-model="article.slug", placeholder="Slug", expanded)

        b-field(label="Title", horizontal)
          b-input(v-model="article.title", placeholder="Title", expanded)

        b-field(label="Digest", horizontal)
          b-input(v-model="article.digest", placeholder="Digest", expanded)

        b-field(label="Date", horizontal)
          b-input(type="date", v-model="article.date", placeholder="Date", expanded)

        b-field(label="Category", horizontal)
          b-select(placeholder="Select a topic", v-model="article.parent")
            option(
              v-for="c in categories"
              :value="c.slug"
              :key="c.slug"
            ) {{ c.name }}

        b-field(label="Tags", horizontal)
          b-taginput(
            v-model="article.tags"
            icon="label"
            placeholder="Tags")

        b-field(label="Aliases", horizontal)
          b-taginput(
            v-model="article.aliases"
            icon="label"
            placeholder="Aliases")

    b-tab-item(label="Content")
      b-field(label="Content", horizontal)
        b-input(
          ref="textarea"
          type="textarea",
          placeholder="Content")

  p
    // pre {{ JSON.stringify(article, null, 2) }}
</template>

<script>
import { mapState } from 'vuex'
import autosize from 'autosize'
import fecha from 'fecha'


export default {
  layout: 'simple',
  created() {
    // this.article = {...this.baseArticle}
    this.article = this.baseArticle.copy()
  },
  mounted() {
    autosize(this.$refs.textarea.$el.querySelector('textarea'))
  },
  data() {
    return {
      article: {},
      activeTab: 0,
    }
  },
  validate({ store, params }) {
    if (!store.state.authorized) {
      return false
    }
    const { s1, s2 } = params
    const parent = s1 === '-' ? null : s1
    return store.getters['article/getArticle'](parent, s2)
  },
  computed: {
    baseArticle() {
      const { s1, s2 } = this.$route.params
      const parent = s1 === '-' ? null : s1
      return this.$store.getters['article/getArticle'](parent, s2)
    },
    category() {
      const splitted = this.article.slug.split('/')
      const slug = splitted.length < 2 ? '-' : splitted[0]
      const category = this.$store.getters['category/findCategory'](slug)
      return category || { slug, name: slug }
    },
    ...mapState('category', ['categories'])
  },
  methods: {
    dateParser(date) {
      return new Date(date)
    },
    dateFormatter(date) {
      console.log(date)
      return fecha.format(date, 'YYYY-MM-DD')
    }
  }
}
</script>
