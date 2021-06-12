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
      mock: true
    })
  },
  getMenuList: (data) => {
    return request({
      url: '/menu/list',
      mock: false,
      data
    })
  },
  getUserList: (params) => {
    return request({
      url: '/user/list',
      data: params,
      mock: false
    })
  },
  userDelete: (data) => {
    return request({
      url: '/user/delete',
      method: 'post',
      data,
      mock: false
    })
  },
  getRoleAllList: () => {
    return request({
      url: '/role/allList',
      mock: true
    })
  },
  getDeptList: () => {
    return request({
      url: '/dept/list',
      mock: true
    })
  },
  userSubmit: (data) => {
    return request({
      url: '/user/operate',
      method: 'post',
      data,
      mock: false
    })
  },
  menuSubmit: (data) => {
    return request({
      url: '/menu/operate',
      method: 'post',
      data,
      mock: true
    })
  },
}
