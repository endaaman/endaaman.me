import Vue from 'vue'
import Header from '../components/header.vue'
import Footer from '../components/footer.vue'
import Sidebar from '../components/sidebar.vue'
import Markdown from '../components/markdown.vue'
import ArticleDetail from '../components/article-detail.vue'
import date from '../filters/date'


Vue.component('my-header', Header)
Vue.component('my-footer', Footer)
Vue.component('my-sidebar', Sidebar)
Vue.component('my-markdown', Markdown)
Vue.component('article-detail', ArticleDetail)

Vue.filter('date', date)
