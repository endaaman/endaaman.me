<style lang="scss">
@import "../css/variables";

.content.md-content {
  h2 {
    margin: 48px 0 24px;
    line-height: 48px;
    font-size: $size-4;
    border-bottom: solid 2px $border;
    font-weight: bold;
  }

  h3 {
    margin: 24px 0 24px;
    padding: 16px;
    font-size: $size-6;
    border-left: solid 2px $black-ter;
    font-weight: bold;
    // color: $black-ter;
  }

  h4 {
    margin: 24px 0 24px;
    font-size: $size-6;
    font-weight: bold;
  }

  p {
    line-height: 24px;
    margin: 24px 0;
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
        // md.use(mdItContainer, 'spoiler', {
        //   validate(params) {
        //   },
        //   render(tokens, idx) {
        //   }
        // })
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
