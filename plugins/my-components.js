import Vue from 'vue'
import header from '../components/header.vue'
import footer from '../components/footer.vue'
import sidebar from '../components/sidebar.vue'
import markdown from '../components/markdown.vue'
import date from '../filters/date'


Vue.component('my-header', header)
Vue.component('my-footer', footer)
Vue.component('my-sidebar', sidebar)
Vue.component('my-markdown', markdown)

Vue.filter('date', date)
