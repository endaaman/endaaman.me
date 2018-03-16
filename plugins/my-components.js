import Vue from 'vue'
import Header from '../components/header.vue'
import Footer from '../components/footer.vue'
import Sidebar from '../components/sidebar.vue'
import Markdown from '../components/markdown.vue'
import Logo from '../components/logo.vue'
import Hamburger from '../components/hamburger.vue'
import date from '../filters/date'


Vue.component('my-header', Header)
Vue.component('my-footer', Footer)
Vue.component('my-sidebar', Sidebar)
Vue.component('my-markdown', Markdown)
Vue.component('my-logo', Logo)
Vue.component('my-hamburger', Hamburger)

Vue.filter('date', date)
