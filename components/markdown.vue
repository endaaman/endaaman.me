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
    margin: 24px 0;
    font-size: $size-6;
  }

  ul, ol {
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
        content: attr(data-language)"";
        font-family: $family-monospace;
        font-style: italic;
        font-size: 12px;
        line-height: 12px;
        color: $grey-dark;
      }
    }
  }

  blockquote {
    margin: 24px 0;
    padding: 6px 12px 6px;
  //   border-left: $grey-lighter solid 36px;
  //   position: relative;
  //   &:before {
  //     position: absolute;
  //     top: 50%;
  //     transform: translateY(-50%);
  //     left: -24px;
  //     color: $white-ter;
  //     content: '\F756';
  //     font-family: 'Material Design Icons';
  //     font-size: 36px;
  //   }
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
}
</style>

<template lang="pug">
.md-content.content
  vue-markdown(v-bind="mdProps")
    slot
</template>

<script>
import hljs from 'highlight.js'
import mdItAttrs from 'markdown-it-attrs'
import mdItContainer from 'markdown-it-container'
import mdItMultimdTable from 'markdown-it-multimd-table'

export default {
  data: () => ({
    mdProps: {
      linkify: false,
      bre: false,
      breaks: false,
      plugins: [
        mdItAttrs,
        mdItMultimdTable,
      ],
      override(md) {
        // const org = md.renderer.rules.table_open
        // md.renderer.rules.table_open = (...args) => {
        //   const token = args[0][args[1]]
        //   token.attrs = [['class', 'variable-class']]
        //   return org(...args)
        // }
        md.use(mdItContainer, 'indent', {
          validate(params) {
            return params.trim().match(/^indent\s+(.*)$/);
          },
          render(tokens, idx) {
            const m = tokens[idx].info.trim().match(/^indent\s+(.*)$/);
            if (tokens[idx].nesting === 1) {
              return '<div class="indented">' + md.utils.escapeHtml(m[1]) + '\n';
            } else {
              return '</div>\n';
            }
          }
        })
      }
    }
  }),
  mounted () {
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
      let splitted = null
      e.classList.forEach((c) => {
        splitted = c.split('language-')
        if (splitted.length === 2) {
          isCode = true
          return false
        }
      })
      if (isCode) {
        e.parentElement.dataset.language = splitted[1]
        hljs.highlightBlock(e.parentElement)
      }
    })
  },
}
</script>
