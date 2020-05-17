<style scoped lang="scss">
@import "../css/variables";

.article-preview {
  overflow-y: auto;
}

.article-editor {
  display: block;
  width: 100%;
  font-family: $family-monospace;
  height: calc(100vh - 260px);
  max-height: calc(100vh - 260px);
  font-size: 16px;
  @media screen and (max-width: $breakpoint - 1) {
    // small
    font-size: 14px;
    height: calc(100vh - 290px);
    max-height: calc(100vh - 290px);
  }
}

// .CodeMirror {
//   height: auto;
// }
//
// .CodeMirror, .CodeMirror-scroll, .article-preview {
//   // large
//   max-height: calc(100vh - 260px);
//   font-size: 16px;
//   @media screen and (max-width: $breakpoint - 1) {
//     // small
//     font-size: 14px;
//     max-height: calc(100vh - 290px);
//   }
// }

</style>

<template lang="pug">
.article-form-root
  .tabs.is-boxed
    ul
      li(v-for="(tab, i) in tabs", :class="{'is-active': activeTabIndex == i}")
        a(v-on:click="activeTabIndex = i")
          | {{ tab.label }}
          span(v-if="tab.changed") +

  .form-content(v-if="isActiveTabContent(0)")
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
          a.button(target="_blank", :href="article.image", v-bind:disabled="!article.image") Check

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

    .add-margin-for-hidden-tags

  .form-content(v-if="isActiveTabContent(1)")
    // b-field()
    //   b-input(maxlength="200" type="textarea", v-model="article.body", custom-class="article-editor")
    textarea.textarea.article-editor(v-model="article.body")

    // client-only(placeholder="Loading ace editor...")
    //   codemirror(
    //      class="vertical&#45;grow"
    //      @keydown.page&#45;down="onCtrlS"
    //      ref="elCm"
    //      :value="article.body",
    //      :options="cmOptions",
    //      @ready="onCmReady",
    //      @input="onCmChanged")

  .form-content(v-if="isActiveTabContent(2)")
    client-only(placeholder="Loading markdown...")
      .article-preview
        my-markdown(:source="article.body")

  .form-content(v-if="isActiveTabContent(3)")
    p JSON
    pre {{ article.toPrintable() | json }}
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import eventListener from '~/mixins/event-listener'

export default {
  mixins: [eventListener('resize', 100)],
  data() {
    return {
      activeTabIndex: 0,
      tabs: [
        {
          label: 'Options',
          hash: '#',
          changed: false,
        }, {
          label: 'Body',
          hash: '#body',
          changed: false,
        }, {
          label: 'Preview',
          hash: '#preview',
          changed: false,
        }, {
          label: 'JSON',
          hash: '#json',
          changed: false,
        },
      ],
      activeTab: 0,
      cmOptions: {
        tabSize: 2,
        lineWrapping: true,
        autofocus: true,
        mode: 'text/x-markdown',
        // lineNumbers: true,
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
      if (tab === 1 || tab === 2) {
        this.adjustCotainerSize()
      }
    },
    article: {
      handler(a) {
        this.tabs[0].changed = !this.originalArticle.equalsExceptForBody(a)
        this.tabs[1].changed = this.originalArticle.body !== a.body
      },
      deep: true,
    },
  },
  computed: {
    ...mapState('category', ['categories']),
    ...mapGetters('article', ['tags']),
  },
  methods: {
    isActiveTabContent(index) {
      return index === this.activeTabIndex
    },
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
