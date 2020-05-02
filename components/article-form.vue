<template lang="pug">
div
  b-tabs(v-model="activeTab", :animated="false", type="is-boxed")
    b-tab-item(:label="'Options' + (isOptionsChanged ? ' +' : '')")
      b-field(label="Slug", horizontal)
        b-input(v-model="article.slug", placeholder="Slug", expanded)

      b-field(label="Title", horizontal)
        b-input(v-model="article.title", placeholder="Title", expanded)

      b-field(label="Digest", horizontal)
        b-input(v-model="article.digest", placeholder="Digest", expanded)

      b-field(label="Date", horizontal)
        b-input(type="date", v-model="article.date", placeholder="Date", expanded)

      b-field(label="Category", horizontal)
        b-select(v-model="article.categorySlug")
          option(
            v-for="c in categories",
            :value="c.slug",
            :key="c.slug",
          ) {{ c.name }}

      b-field(label="Image URL", horizontal)
        b-field
          b-input(v-model="article.image", placeholder="Image URL", expanded)
          p.control
            a.button(target="_blank", :href="article.image", :class="{ 'is-disabled': !article.image }") Check
        // p(v-if="article.image")
        //   span check:
        //   a(target="_blank", :href="article.image" ) {{ article.image }}

      b-field(label="Tags", horizontal)
        b-taginput(
          v-model="article.tags",
          :allowNew="true",
          :data="tags",
          icon="label",
          autocomplete,
          placeholder="Tags"
        )

      b-field(label="Aliases", horizontal)
        b-taginput(
          v-model="article.aliases"
          icon="label"
          placeholder="Aliases")

      b-field(label="Flags", horizontal)
        p.control
          b-checkbox(v-model="article.private") Private
        p.control
          b-checkbox(v-model="article.special") Special


    b-tab-item(:label="'Body' + (isBodyChanged ? ' +' : '')")
      no-ssr(placeholder="Loading Codemirror...")
        codemirror(
          @keydown.page-down="onCtrlS"
          ref="elCm"
          :value="article.body",
          :options="cmOptions",
          @ready="onCmReady",
          @input="onCmChanged")

    b-tab-item(label="Preview")
      no-ssr(placeholder="Loading markdown...")
        my-markdown(:source="article.body")

    b-tab-item(label="JSON")
      pre {{ article.toPrintable() | json }}
</template>

<script>
import { mapState, mapGetters } from 'vuex'


export default {
  data() {
    return {
      activeTab: 0,
      cmOptions: {
        tabSize: 2,
        lineWrapping: true,
        autofocus: true,
        mode: 'text/x-markdown',
        lineNumbers: true,
        line: true,
        height: 'auto',
        viewportMargin: Infinity,
        bindings: {
          'Shift-Tab':  'indentLess',
        }
      }
    }
  },
  props: {
    article: {
      type: Object,
      required: true
    },
    originalArticle: {
      type: Object,
      required: true
    },
  },
  watch: {
    activeTab(tab) {
      if (tab === 1) {
        this.$refs.elCm.refresh()
      }
    },
    article: {
      handler(a) {
      },
      deep: true,
    },
  },
  computed: {
    ...mapState('category', ['categories']),
    ...mapGetters('article', ['tags']),
    isBodyChanged() {
      return this.originalArticle.body !== this.article.body
    },
    isOptionsChanged() {
      return !this.originalArticle.equalsExceptForBody(this.article)
    },
  },
  methods: {
    onCmReady(cm) {
      cm.addKeyMap({
        'Ctrl-S': (cm) => {
          this.$emit('save')
        }
      })
    },
    onCmChanged(value) {
      this.article.body = value
    },
  },
}
</script>
