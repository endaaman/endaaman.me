const dev = process.env.NODE_ENV !== 'production'
const host = process.env.HOST
const staticHost = dev 
  ? 'localhost:3002'
  : 'static.${ host }',

module.exports = {
  env: {
    // apiRoot: 'http://localhost:3001/',
    apiRoot: dev 
      ? 'http://192.168.11.2:3001/'
      : 'https://api.${ host }/',
    staticRoot: `${ dev ? 'http' : 'https' }://${ staticHost }/`,
    builtAt: new Date(),
    dev,
  },
  dev: process.env.NODE_ENV !== 'production',
  head: {
    titleTemplate(title) {
      return title ? `${title} | endaaman.me` : 'endaaman.me'
    },
    link: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Ubuntu|Ubuntu+Condensed|Ubuntu+Mono',
      },
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
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
  // serverMiddleware: [
  //   { path: '/static', handler: '~api/static' }
  // ],
}
