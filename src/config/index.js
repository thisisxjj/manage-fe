/**
 * 环境配置封装
 */
const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
  dev: {
    baseApi: '/',
    mockApi: 'https://www.fastmock.site/mock/b0ed426b682e514d853b8d9c205521cd/api'
  },
  test: {
    baseApi: '/',
    mockApi: 'https://www.fastmock.site/mock/b0ed426b682e514d853b8d9c205521cd/api'
  },
  prod: {
    baseApi: '/',
    mockApi: ''
  }
}
export default {
  env,
  mock: true,
  ...EnvConfig[env]
}