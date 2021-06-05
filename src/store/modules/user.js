import { getToken, setToken, removeToken } from '@/utils/auth'
import storage from '@/utils/storage'
import api from '@/api'
/**
 * 用户模块
 */

const state = {
  token: getToken(),
  userInfo: storage.getItem('userInfo') || ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}