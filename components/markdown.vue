<style lang="scss">
@import "../css/variables";

.content.md-content {
  *:first-child {
    margin-top: 0px; /* delete margin for parent is flex */
  }

  @mixin hr {
    border-bottom: dotted 1px $border;
  }

  h2 {
    margin: 48px 0 24px;
    padding: 8px 0;
    font-size: $size-4;
    line-height: 1.5;
    @media screen and (max-width: $breakpoint) {
      font-size: $size-5;
    }
    font-weight: bold;

    @include hr
  }

  hr {
    background: none;
    margin: 32px 0;
    @include hr;
  }

  h3, h4 {
    margin: 48px 0 24px;
    font-weight: bold;
    font-size: $size-5;
    // @media screen and (max-width: $breakpoint) {
    //   margin-bottom: 32px;
    //   font-size: $size-5;
    // }
  }

  h2 + h3 {
    margin-top: 16px;
  }

  & > p {
    font-size: $size-6;
    line-height: 1.5;
    margin: 0 0 16px;
  }

  ul, ol {
    margin: 24px 0 24px 16px;
    li {
      line-height: 1.5;
      margin-bottom: 8px;
      p {
        margin: 0;
      }
    }
  }

  li {
    ul, ol {
      margin-top: 8px;
      margin-bottom: 8px;
    }
  }

  table {
    width: 100%;
    margin: 32px 0;
    /* display: inline-block; */
    td, th {
      padding: 8px;
      font-size: 14px;
      @media screen and (max-width: $breakpoint) {
        padding: 8px 4px;
      }
    }
    &.bordered {
      td, th {
        border-width: 1px;
      }
      tr {
        &:last-child {
          td, th {
            border-bottom-width: 1px
          }
        }
      }
    }
    &.no-bordered {
      margin: 0 -8px;
      td, th, tr {
        border: 0;
      }
    }
    &.compact {
      width: auto;
    }
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
    margin: 32px 0;
    padding: 8px 8px;
    max-height: 600px;
    overflow-y: auto;
    @media screen and (max-width: $breakpoint) {
      padding: 4px 8px;
    }
    background-color: $white-bis;
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

  blockquote {
    position: relative;
    margin: 24px 0;
    padding: 24px 64px 24px 48px;
    font-style: italic;
    display: flex;
    flex-direction: column;
    &:before {
      position: absolute;
      top: 0px;
      left: 8px;
      font-family: "Material Design Icons";
      content: "\F756";
      font-size: 32px;
      color: $border;
    }
    &:after {
      position: absolute;
      bottom: 0px;
      right: 24px;
      font-family: "Material Design Icons";
      content: "\F27E";
      font-size: 32px;
      color: $border;
    }
    cite {
      color: $grey;
      order: 1;
      text-align: right;
      padding-top: 8px;
      padding-right: 8px;
      /* margin-top: 16px; */
    }
  }

  .center {
    text-align: center;
  }

  .right {
    text-align: right;
  }

  .message {
    margin: 32px 0;
  }

  .markdown-image {
    cursor: zoom-in;
  }

  .video-container {
    max-width: 100%;
    width: 640px;
  }

  .youtube-container {
    max-width: 100%;
    iframe {
      max-width: 100%;
    }
  }

  figure {
    display: inline-block;
    margin: 16px 0;
    .figure-inner {
      & > p {
        margin-bottom: 0px;
      }
      display: flex;
      flex-direction: column;
      figcaption {
        order: 1;
        color: $dark;
        text-align: center;
        font-style: italic;
        max-width: 100%;
        word-break : break-all;
      }
    }
    /* display: inline-block; */
  }
}

p.no-content {
  color: $grey;
  font-style: italic;
}
</style>

<template lang="pug">
.md-root
  .md-content.content(v-if="source")
    vue-markdown(:source="source", v-bind="mdProps", @rendered="onRendered")
      slot
  p.no-content(v-else) No content

  div(ref="viewerContainer")
</template>

<script>
import { parse as shellSplit } from 'shell-quote'
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
            const splitted = shellSplit(param.trim())
            return splitted[0] === 'video'
          },
          render(tokens, idx, options, env, self) {
            if (tokens[idx].nesting === 1) {
              const param = tokens[idx].info.trim()
              const [_, url] = shellSplit(param)
              return `<video class="video-container" src="${ md.utils.escapeHtml(url) }" controls>`
            } else {
              return '</video>\n'
            }
          }
        })

        md.use(mdItContainer, 'message', {
          validate: function(param) {
            const splitted = shellSplit(param.trim())
            return splitted[0] === 'message'
          },
          render(tokens, idx, options, env, self) {
            if (tokens[idx].nesting === 1) {
              const param = tokens[idx].info.trim()
              const [_, title, mode, icon] = shellSplit(param)
              let heading = ''
              if (title) {
                heading += `<div class="message-header"><p>`
                if (icon) {
                  heading += `<i class="mdi mdi-18px mdi-${icon}"></i> `
                }
                heading += `${md.utils.escapeHtml(title)}</p></div>`
              }
              return heading + `<div class="message-body">`
            } else {
              return '</div></article>'
            }
          }
        })

        md.use(mdItContainer, 'quote', {
          validate: function(param) {
            const splitted = shellSplit(param.trim())
            return splitted[0] === 'quote'
          },
          render(tokens, idx, options, env, self) {
            if (tokens[idx].nesting === 1) {
              const param = tokens[idx].info.trim()
              const [_, title, url] = shellSplit(param)
              let body = `<blockquote>`
              if (title) {
                body += `<cite>`
                if (url) {
                  body += `<a href="${url}">${title}</a>`
                } else {
                  body += title
                }
                body += `</cite>`
              }
              return body
            } else {
              return '</blockquote>'
            }
          }
        })

        md.use(mdItContainer, 'youtube', {
          validate: function(param) {
            const splitted = shellSplit(param.trim())
            return splitted[0] === 'youtube'
          },
          render(tokens, idx, options, env, self) {
            if (tokens[idx].nesting === 1) {
              const param = tokens[idx].info.trim()
              let [_, url, width, height] = shellSplit(param)
              const w = parseInt(width) || 640
              const h = parseInt(height) || 360
              return `<div class="youtube-container">`
                + `<iframe type="text/html" src="${url}" width="${w}px" height="${h}px" frameborder="0">`
            } else {
              return `</iframe></div>`
            }
          }
        })

        md.use(mdItContainer, 'figure', {
          validate(param) {
            const splitted = shellSplit(param.trim())
            return splitted[0] === 'figure'
          },
          render(tokens, idx, options, env, self) {
            const param = tokens[idx].info.trim()
            const [_, text] = shellSplit(param)
            if (tokens[idx].nesting === 1) {
              return `<figure><div class="figure-inner">`
                + `<figcaption>${text}</figcaption>`
            } else {
              return '</div></figure>'
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
      await this.$nextTick()
      this.$emit('ready')
    },
  },
}
</script>
