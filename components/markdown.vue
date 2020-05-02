<style lang="scss">
@import "../css/variables";

.content.md-content {
  h2 {
    margin: 48px 0 24px;
    line-height: 48px;
    font-size: $size-4;
    // border-bottom: solid 2px $border;
    font-weight: bold;
  }

  h3 {
    margin: 48px 0 24px;
    // padding: 16px;
    font-size: $size-6;
    // border-left: solid 2px $black-ter;
    font-weight: bold;
    // color: $black-ter;
  }

  h2 + h3 {
    margin-top: 24px;
  }

  h4 {
    margin: 24px 0 24px;
    font-size: $size-6;
    font-weight: bold;
  }

  p {
    line-height: 24px;
    font-size: $size-6;
  }

  & > p {
    margin: 24px 0;
  }

  & > ul, & > ol {
    margin: 24px 0 24px 24px;
  }

  dl {
    margin: 24px 0;
    // TODO: use flex
    overflow: hidden;
    dt {
      font-weight: bold;
    }
    dd {
      margin: 0 0 12px 24px;
    }
    p {
      margin: 0 0 12px;
    }
  }

  pre {
    margin: 24px 0;
    padding: 6px 12px 6px;
    &.hljs {
      position: relative;
      padding-top: 24px;
      &:before {
        position: absolute;
        top: 6px;
        left: 6px;
        content: attr(data-filename)"";
        font-family: $family-monospace;
        font-style: italic;
        font-size: 12px;
        line-height: 12px;
        color: $grey-dark;
      }
    }
  }

  .markdown-image {
    cursor: zoom-in;
  }
  .markdown-video {
    max-width: 100%;
    width: 640px;
  }

  blockquote {
    margin: 24px 0;
    padding: 6px 12px 6px;
    /* border-left: $grey-lighter solid 36px; */
    /* position: relative; */
    /* &:before { */
    /*   position: absolute; */
    /*   top: 50%; */
    /*   transform: translateY(-50%); */
    /*   left: -24px; */
    /*   color: $white-ter; */
    /*   content: '\F756'; */
    /*   font-family: 'Material Design Icons'; */
    /*   font-size: 36px; */
    /* } */
  }

  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .cl {
    overflow: hidden;
    clear: both;
  }

  .center {
    text-align: center;
  }

  // markdown-it-container
  .indented {
    margin: 16px;
  }

  .no-content {
    color: $grey;
    font-style: italic;
  }
}
</style>

<template lang="pug">
.md-content.content
  vue-markdown(:source="source", v-bind="mdProps", v-if="source", @rendered="onRendered")
    slot
  p.no-content(v-else) No content

  div(ref="viewerContainer")
</template>

<script>
import hljs from 'highlight.js'
import mdItAttrs from 'markdown-it-attrs'
import mdItContainer from 'markdown-it-container'
import mdItMultimdTable from 'markdown-it-multimd-table'
import Viewer from 'viewerjs'

export default {
  props: {
    source: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    images: [],
    mdProps: {
      linkify: false,
      bre: false,
      breaks: false,
      plugins: [
        mdItAttrs,
        mdItMultimdTable,
      ],
      override(md) {
        const defaultImageRenderFunc = md.renderer.rules.image
        md.renderer.rules.image = (...args) => {
          const [ tokens, idx, options, env, self ] = args
          const token = tokens[idx]
          const src = token.attrs[token.attrIndex('src')][1]

          const idxClass = token.attrIndex('class');
          const cls = 'markdown-image'
          if (idxClass < 0) {
            token.attrPush(['class', cls])
          } else {
            token.attrs[idxClass][1] = cls
          }
          const html = defaultImageRenderFunc(...args)
          return html
        }
        md.use(mdItContainer, 'video', {
          validate(param) {
            return param.trim().match(/^video\|(.+)/)
          },
          render(tokens, idx, options, env, self) {
            const url = tokens[idx].info.trim().match(/^video\|(.+)/)[1]
            if (tokens[idx].nesting === 1) {
              return `<video class="markdown-video" src="${ md.utils.escapeHtml(url) }" controls>`
            } else {
              return '</video>\n'
            }
          }
        })
        md.use(mdItContainer, 'message', {
          validate: function(param) {
            const splitted = param.trim().split('|')
            return splitted[0] === 'message' && splitted.length > 1
          },
          render(tokens, idx, options, env, self) {
            const param = tokens[idx].info.trim()
            const [_, mode, title] = param.split('|')
            if (tokens[idx].nesting === 1) {
              let heading = `<article class="message is-${mode}">`
              if (title) {
                heading += `<div class="message-header"><p>${md.utils.escapeHtml(title)}</p></div>`
              }
              return heading + `<div class="message-body">`
            } else {
              return '</div></article>'
            }
          }
        })

      }
    }
  }),
  mounted() {
    if (!this.source) {
      // if source is empty, trigger it instead
      this.onRendered()
    }
  },
  methods: {
    async onRendered() {
      if (process.server) {
        return
      }
      await this.$nextTick()
      const $vm = this
      Array
        .from(this.$el.querySelectorAll('a'))
        .forEach(link => {
          link.addEventListener('click', e => {
            const href = e.target.attributes.href.value
            if (/^\//.test(href)) {
              $vm.$router.push(href)
              e.preventDefault()
            }
          })
        })

      this.$el.querySelectorAll('pre > code').forEach((e) => {
        let isCode = false
        let lang = null
        e.classList.forEach((c) => {
          const splitted = c.split('language-')
          if (splitted.length === 2) {
            isCode = true
            lang = splitted[1]
            return false
          }
        })
        if (isCode) {
          const [a, b] = lang.split('|')
          e.parentElement.dataset.language = a
          e.parentElement.dataset.filename = b || a
          hljs.highlightBlock(e.parentElement)
        }
      })
      for (const el of this.$el.querySelectorAll('.markdown-image')) {
        const viewer = new Viewer(el ,{
          navbar: false,
          zoomRatio: 0.3,
          container: this.$refs.viewerContainer,
          url(image) {
            return image.src.split('?')[0]
          }
        })
      }
      this.$emit('ready')
    },
  },
}
</script>
