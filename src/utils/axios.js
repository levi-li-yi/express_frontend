import axios from 'axios';

const Service = axios.create({
    timeout: 7000,
    baseURL: 'http://localhost:3000',
    // withCredentials: true
})

// 设置axios 请求拦截
Service.interceptors.request.use(
    config => {
      // config.headers['X-Requested-With'] = 'XMLHttpRequest'
      //config['crossDomain'] = true
      return config
    },
    error => {
      Promise.reject(error)
    }
  )

const http = function(obj) {
    return new Service(obj)
}

export default http;