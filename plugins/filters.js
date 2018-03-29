import Vue from 'vue'
import date from '../filters/date'
import json from '../filters/json'


Vue.filter('date', date)
Vue.filter('json', json)
