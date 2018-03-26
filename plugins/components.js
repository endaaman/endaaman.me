import Vue from 'vue'
import VueMarkdown from '@endaaman/vue-markdown'
// import AceEditor from 'vue2-ace-editor'
import Buefy, { Toast } from 'buefy'

Vue.component('vue-markdown', VueMarkdown)
// Vue.component('vue-editor', AceEditor)


const components = [
  'Checkbox',
  'Datepicker',
  'Field',
  'Input',
  'Icon',
  'Pagination',
  'Select',
  'TabItem',
  'Tabs',
  'Tag',
  'Taginput',
]
for (const c of components) {
  Vue.component(Buefy[c].name, Buefy[c])
}
Vue.use({
  install(Vue) {
    Vue.prototype.$toast = Toast
  }
})
// Vue.use(Buefy)
