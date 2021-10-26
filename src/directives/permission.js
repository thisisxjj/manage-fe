/**
 * 全局定义权限指令
 *  根据用户返回的权限码识别不同的权限
 */
import { toRaw } from 'vue'
import storage from '../utils/storage'
export default function (app) {
  app.directive('has', {
    beforeMount(el, binding) {
      const actionCodeList = storage.getItem('actionList')
      const value = binding.value
      // 判断如果权限码列表中没有对应的按钮权限,则隐藏对应按钮
      if (!actionCodeList.includes(value)) {
        el.style.display = 'none'
        setTimeout(() => {
          el.parentNode.removeChild(el)
        }, 0)
      }

    },
  })
}