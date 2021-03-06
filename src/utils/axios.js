import axios from 'axios';
// import qs from 'querystring';

const Service = axios.create({
    // timeout: 10000,
    baseURL: 'http://localhost:3000',
    //withCredentials: true
})

// 设置axios 请求拦截
Service.interceptors.request.use(
    config => {
      // config.headers['X-Requested-With'] = 'XMLHttpRequest'
      // config['crossDomain'] = true
      // config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
      return config
    },
    error => {
      Promise.reject(error)
    }
  )

const http = function(obj) {
  const postData = {}
  postData.url = obj.url;
  postData.method = obj.method;
  // postData.headers = obj.headers || {};
  postData.data = obj.data || {};
  if (obj.method === 'POST') {
    // postData.data = qs.stringify(obj.data);
  }
  if (obj.onUploadProgress) {
    postData.onUploadProgress = obj.onUploadProgress
  }
  if (obj.cancelToken) {
    postData.cancelToken = obj.cancelToken
  }

  return Service(postData)
}

export default http;
