import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home.vue'
import { getToken } from '../utils/auth'
import api from '../api'

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
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('../views/404.vue'),
    meta: {
      title: '访问不到页面...'
    }
  }
]

const router = createRouter({
  routes,
  history: createWebHashHistory()
})

async function loadAsyncRoutes() {
  const token = getToken()
  if (token) {
    const { menuList } = await api.getMenuPermissionList()
    const asyncRoutes = []
    filterAsyncRoutes(menuList, asyncRoutes)
    asyncRoutes.map((route) => {
      let url = `./../views/${route.component}.vue`
      route.component = () => import(url)
      router.addRoute('Home', route)
    })
  }
}

router.beforeEach((to, from, next) => {
  document.title = '火星-' + (to.meta.title)
  next()
})

await loadAsyncRoutes()
function filterAsyncRoutes(routes, asyncRoutes) {
  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.children && !tmp.action) {
      tmp.children = filterAsyncRoutes(tmp.children, asyncRoutes)
    }
    if (tmp.menuType !== 2 && tmp.parentId[0]) {
      asyncRoutes.push({
        path: tmp.path,
        component: tmp.component,
        meta: {
          title: tmp.menuName
        }
      })
    }
  })
}
export default router