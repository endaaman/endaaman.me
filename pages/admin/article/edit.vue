<style scoped lang="scss">
@import "../../../css/variables";

</style>

<template lang="pug">
.container-admin-article-edit
  b-field()
    button.button.is-primary Save

  b-tabs(v-model="activeTab", :animated="false", type="is-boxed")
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
          v-model="article.content",
          ref="textarea",
          type="textarea",
          rows="24",
          placeholder="Content")

</template>

<script>
import { mapState } from 'vuex'
import autosize from 'autosize'

export default {
  mounted() {
    autosize(this.$refs.textarea.$el.querySelector('textarea'))
  },
  data() {
    return {
      activeTab: 0,
    }
  },
  computed: {
    ...mapState('category', ['categories']),
    article() {
      const { relative } = this.$route.query
      const org = this.$store.getters['article/getArticleByRelative'](relative)
      return org.copy()
    }
  }
}
</script>
