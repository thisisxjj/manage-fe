import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import request from './utils/request'
import storage from './utils/storage'
import api from './api'
import SvgIcon from '@/components/SvgIcon/index.vue'

const app = createApp(App)
console.log('环境变量 => ', app)
app.config.globalProperties.$request = request
app.config.globalProperties.$api = api
app.config.globalProperties.$storage = storage
app.use(ElementPlus, { size: 'small' }).use(router).use(store).component('svg-icon', SvgIcon).mount('#app')
