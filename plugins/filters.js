import Vue from 'vue'
import date from '../filters/date'
import json from '../filters/json'
import formatByteSize from '../filters/format-byte-size'


Vue.filter('date', date)
Vue.filter('json', json)
Vue.filter('formatByteSize', formatByteSize)
