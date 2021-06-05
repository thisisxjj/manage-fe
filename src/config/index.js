/**
 * 环境配置封装
 */
const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
  dev: {
    baseApi: '/api/v1',
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
  namespace: 'manager',
  ...EnvConfig[env]
}