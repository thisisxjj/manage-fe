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
      mock: false
    })
  },
  getRoleList: (data) => {
    return request({
      url: '/role/list',
      data,
      mock: false
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
      mock: false
    })
  },
  roleSubmit: (data) => {
    return request({
      url: '/role/operate',
      method: 'post',
      data,
      mock: false
    })
  },
  updatePermission: (data) => {
    return request({
      url: '/role/update/permission',
      method: 'post',
      data,
      mock: false
    })
  },
  getMenuPermissionList: (data) => {
    return request({
      url: '/user/permission/list',
      mock: false
    })
  },
}
