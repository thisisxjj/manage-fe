import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import config from './config'
import request from './utils/request'
import storage from './utils/storage'

const app = createApp(App)
console.log('环境变量 => ', import.meta.env)
app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage
app.use(ElementPlus).use(router).mount('#app')
