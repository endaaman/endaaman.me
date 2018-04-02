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
    'highlight.js/styles/vs.css',
    { src: '@/css/bulma.scss', lang: 'scss' },
    { src: '@/css/katex.scss', lang: 'scss' },
    { src: '@/css/app.scss', lang: 'scss' },
    { src: '@/css/codemirror.scss', lang: 'scss' },
  ],
   build: {
    extend (config) {
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
      shouldPreload: (file, type) => {
        return ['script', 'style', 'font'].includes(type)
      }
    }
  },
  plugins: [
    '~plugins/buefy',
    { src: '~plugins/codemirror', ssr: false },
    '~plugins/components',
    '~plugins/filters',
    { src: '~plugins/ga', ssr: false },
    '~plugins/markdown',
    '~plugins/vuex-router-sync',
  ],
}
