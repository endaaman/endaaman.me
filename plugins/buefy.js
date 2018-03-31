import Vue from 'vue'
import Buefy from 'buefy'

Vue.use(Buefy, {
  defaultMonthNames: Array.from(new Array(12)).map((v,i)=> `${i}月`),
  defaultDayNames: ['日', '月', '火', '水', '木', '金', '土'],
  defaultToastDuration: 5000,
})
