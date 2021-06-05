import request from '../utils/request'
/**
 * api 管理 
 */
export default {
  login: (data) => {
    return request({
      method: 'post',
      url: '/user/login',
      data,
      mock: false
    })
  },
  logout: () => {
    return request({
      method: 'post',
      url: '/user/logout',
      mock: true
    })
  },
  noticeCount: () => {
    return request({
      url: '/leave/count',
      mock: false
    })
  },
  getMenuList: () => {
    return request({
      url: '/menu/list',
      mock: true
    })
  }
}
