/**
 * axios二次封装
 */
import axios from 'axios'
import config from '../config'
import { ElMessage } from 'element-plus'
import router from '../router'
import defaultValue from '../utils/defaultValue'

const services = axios.create({
  baseURL: config.baseURL,
  timeout: 8000
})

services.interceptors.request.use((req) => {
  // TODO 添加token头
  if (!req.headers.Authorization) {
    req.headers.Authorization = 'Bear Token'
  }
  return req
})

services.interceptors.response.use((res) => {
  const { code, data, msg } = res.data
  if (code === 200) {
    return data
  } else if (code === 40001) {
    ElMessage.error(defaultValue.TOKEN_INVALID)
    setTimeout(() => {
      router.push('/login')
    }, 1500)
    return Promise.reject(defaultValue.TOKEN_INVALID)
  } else {
    let message = msg || defaultValue.NETWORK_ERROR
    ElMessage.error(message)
    return Promise.reject(message)
  }
})

/**
 * 请求核心函数
 * @param {Object} options 请求相关配置
 * @param {String} options.method 请求的方法
 * @param {String} options.url 请求的路径
 * @param {Object} options.data 请求的传递的参数
 */
function request(options) {
  options.method = options.method || 'get'
  if (options.method.toLocaleLowerCase() === 'get') {
    options.params = options.data
  }
  if (config.env === 'prod') {
    services.defaults.baseURL = config.baseApi
  } else {
    services.defaults.baseURL = config.mock ? config.mockApi : config.baseApi
  }
  return services(options)
}

['get', 'put', 'post', 'delete', 'patch'].forEach(item => {
  request[item] = (url, data, options) => {
    return request({
      method: item,
      url,
      data,
      params: item === 'get' ? data : null
    })
  }
})

export default request