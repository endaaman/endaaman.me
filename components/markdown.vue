<template lang="pug">
VueMarkdown(v-bind="mdProps")
  slot
</template>

<script>
import hljs from 'highlight.js'
import markdownItAttrs from 'markdown-it-attrs'

export default {
  data: () => ({
    mdProps: {
      linkify: false,
      bre: false,
      breaks: false,
      plugins: [
        markdownItAttrs,
      ],
      override(md) { }
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
