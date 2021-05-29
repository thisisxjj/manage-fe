import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Login from '../components/Login.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    meta: {
      title: '首页'
    },
    children: [
      {
        path: '/welcome',
        name: 'Home',
        component: Welcome,
        meta: {
          title: '欢迎页'
        }
      },
      {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
          title: '登录'
        }
      },
    ]
  }
]

export default createRouter({
  routes,
  history: createWebHashHistory()
})