/**
 * axios二次封装
 */
import axios from 'axios'
import config from '../config'
import { ElMessage } from 'element-plus'
import router from '../router'
import defaultValue from '../utils/defaultValue'
import { getToken } from '../utils/auth'

const services = axios.create({
  baseURL: config.baseURL,
  timeout: 8000
})

services.interceptors.request.use((req) => {
  // TODO 添加token头
  if (!req.headers.authorization) {
    req.headers.authorization = 'Bearer ' + getToken()
  }
  return req
})

services.interceptors.response.use((res) => {
  const { code, data, msg } = res.data
  if (code === 200) {
    return data
  } else if (code === 20001 || code === 50001) {
    let message = ''
    if (code === 20001) {
      message = defaultValue.USER_ACCOUNT_ERROR
    } else if (code === 50001) {
      message = defaultValue.AUTH_ERROR
    }
    ElMessage.error(message)
    setTimeout(() => {
      router.push('/login')
    }, 1500)
    return Promise.reject(message)
  } else {
    let message = msg || defaultValue.BUSINESS_ERROR
    ElMessage.error(message)
    return Promise.reject(message)
  }
}, (error) => {
  let message = error.response.data.msg || defaultValue.BUSINESS_ERROR
  // console.log({ ...error })∂
  ElMessage.error(message)
  return Promise.reject(message)
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
  if (typeof options.mock !== undefined) {
    config.mock = options.mock
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