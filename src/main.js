import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import config from './config'
import axios from 'axios'

axios.get(config.mockApi + '/login').then(res => console.log(res))
const app = createApp(App)
app.use(ElementPlus).use(router).mount('#app')
