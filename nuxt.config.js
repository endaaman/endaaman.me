const dev = process.env.NODE_ENV !== 'production'


module.exports = {
  env: {
    builtAt: new Date(),
    dev,
  },
  head: {
    titleTemplate(title) {
      return title ? `${title} | endaaman.me` : 'endaaman.me'
    },
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Ubuntu|Ubuntu+Condensed|Ubuntu+Mono', },
      { rel: 'icon', href: '/favicon.ico', },
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', vmid: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', vmid: 'description', content: `endaaman's website` },
      { property: 'og:title', vmid: 'og:title', content: 'endaaman.me' },
      { property: 'og:type', vmid: 'og:type', content: 'article' },
      { property: 'og:description', vmid: 'og:description', content: `endaaman's website` },
      { property: 'og:image', vmid: 'og:image', content: '/endaaman.png' },
      { property: 'og:sitename', vmid: 'og:sitename', content: `endaaman's website` },
      { name: 'twitter:card', vmid: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', vmid: 'twitter:site', content: '@endaaman' },
    ]
  },
  css: [
    'mdi/css/materialdesignicons.css',
    'highlight.js/styles/github.css',
    'viewerjs/dist/viewer.css',
    'katex/dist/katex.min.css',
    'simplebar/dist/simplebar.min.css',
    'codemirror/lib/codemirror.css',
    { src: '@/css/bulma.scss', lang: 'scss' },
    { src: '@/css/app.scss', lang: 'scss' },
  ],
  build: {
    extend (_config) {
      // config.module.rules.push({
      //   test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/, loader: "file-loader",
      // })
    },
    postcss: {
      plugins: {
        'postcss-custom-properties': false, // supress bulma warning
      }
    }
  },
  render: {
    bundleRenderer: {
      shouldPreload: (_file, type) => {
        return ['script', 'style', 'font'].includes(type)
      }
    }
  },
  plugins: [
    '~plugins/buefy',
    '~plugins/components',
    '~plugins/filters',
    '~plugins/markdown',
    '~plugins/simplebar',
    '~plugins/vuex-router-sync',
    { src: '~plugins/codemirror', ssr: false },
    { src: '~plugins/ga', ssr: false },
  ],
}
