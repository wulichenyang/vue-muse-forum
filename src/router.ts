import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import cookie from './utils/cookie'
import { access_token } from './config'

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});

// 导航守卫，非登录状态先登录
router.beforeEach((to, from, next) => {
  let token = cookie.getCookie(access_token)
  // 登录验证 路由改变时刷新cookie中的token过期时间 30天
  if (!token) {
    // token过期，清理vuex中的用户信息和已登录标记
    (router.app.$options.store as any).dispatch('clearUser')
    
    // 这些页面不可访问，跳转主页面
    if (to.name === 'setting'
      || to.name === 'admin'
      || to.name === 'newPost'
      || to.name === 'notice'
      || to.name === 'message'
    ) {
      next({ path: '/' })
    } else {
      next()
    }
    return
  } else {
    // token未过期，刷新token在cookie里的时间
    cookie.setCookie(access_token, token, 24 * 30) // 30天
    next()
  }
})

export default router