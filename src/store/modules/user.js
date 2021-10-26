import { getToken, setToken, removeToken } from '@/utils/auth'
import storage from '@/utils/storage'
import api from '@/api'
import router from '../../router'
/**
 * 用户模块
 */

const state = {
  token: getToken(),
  userInfo: storage.getItem('userInfo') || '',
  menuList: storage.getItem('menuList') || [],
  actionList: storage.getItem('actionList') || [],
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_MENU_LIST: (state, menuList) => {
    state.menuList = menuList
  },
  SET_ACTION_LIST: (state, actionList) => {
    state.actionList = actionList
  }
}

const actions = {
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      api.login({ username: username.trim(), password })
        .then(res => {
          // console.log('vux:----', res)
          let { token, user } = res
          commit('SET_TOKEN', token)
          commit('SET_USER_INFO', user)
          setToken(token)
          storage.setItem('userInfo', user)
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      api.logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_USER_INFO', '')
        storage.setItem('userInfo', '')
        removeToken()

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  savePermisMenuAction({ commit }) {
    return new Promise((resolve, reject) => {
      api.getMenuPermissionList().then(res => {
        const { menuList, actionList } = { ...res }
        commit('SET_MENU_LIST', menuList)
        commit('SET_ACTION_LIST', actionList)
        storage.setItem('actionList', actionList)
        storage.setItem('menuList', menuList)
        resolve()
      }).catch(err => reject(err))
    })
  }
}



export default {
  namespaced: true,
  state,
  mutations,
  actions
}