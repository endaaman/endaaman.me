import Vue from 'vue'

import Common from '../components/common.vue'
import Footer from '../components/footer.vue'
import Burger from '../components/burger.vue'
import Header from '../components/header.vue'
import Logo from '../components/logo.vue'
import Markdown from '../components/markdown.vue'
import Sidebar from '../components/sidebar.vue'

import date from '../filters/date'


Vue.component('my-common', Common)
Vue.component('my-footer', Footer)
Vue.component('my-burger', Burger)
Vue.component('my-header', Header)
Vue.component('my-logo', Logo)
Vue.component('my-markdown', Markdown)
Vue.component('my-sidebar', Sidebar)

Vue.filter('date', date)
