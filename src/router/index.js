import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: 'welcome',
    meta: {
      title: '首页'
    },
    children: [
      {
        path: 'welcome',
        name: 'Welcome',
        component: () => import('../views/Welcome.vue'),
        meta: {
          title: '欢迎页'
        }
      },
      {
        path: '/user',
        name: 'User',
        component: () => import('../views/Welcome.vue'),
        meta: {
          title: '用户管理'
        },
        children: [
          {
            path: 'info',
            name: 'UserInfo',
            component: () => import('../views/Welcome.vue'),
            meta: {
              title: '信息统计'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: '登录'
    }
  },
]

export default createRouter({
  routes,
  history: createWebHashHistory()
})