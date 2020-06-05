import Vue from 'vue'
import App from './App.vue'

import http from './utils/axios';

import echarts from 'echarts'

Vue.config.productionTip = false;

Vue.prototype.$http = http;
Vue.prototype.$echarts = echarts;

new Vue({
  render: h => h(App),
}).$mount('#app')
