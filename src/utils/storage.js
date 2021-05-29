import config from '../config'

/**
 * storage的二次封装
 */

export default {
  setItem(key, val) {
    let obj = this.getStorage()
    obj[key] = val
    this.setStorage(obj)
  },
  getItem(key) {
    return this.getStorage()[key]
  },
  clearItem(key) {
    let obj = this.getStorage()
    delete obj[key]
    this.setStorage(obj)
  },
  getStorage() {
    return JSON.parse(window.localStorage.getItem(config.namespace)) || {}
  },
  setStorage(obj) {
    window.localStorage.setItem(config.namespace, JSON.stringify(obj))
  },
  clear() {
    window.localStorage.clear()
  }
}