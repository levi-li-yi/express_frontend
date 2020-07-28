import Vue from 'vue'
import axios from 'axios';
import App from './App.vue'

import http from './utils/axios';

import echarts from 'echarts'

Vue.config.productionTip = false;

Vue.prototype.$http = http;
Vue.prototype.$echarts = echarts;
Vue.prototype.$axios = axios;

new Vue({
  render: h => h(App),
}).$mount('#app')
