import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import cookie from './utils/cookie'
import { access_token } from './config'
import Toast from 'muse-ui-toast'
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
      path: '/newPost',
      name: 'newPost',
      // route level code-splitting
      // this generates a separate chunk (newPost.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "newPost" */ './views/NewPost.vue'),
    },


    // 管理员可访问页面
    {
      path: '/admin',
      name: 'admin',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Admin/Admin.vue'),
      children: [
        {
          path: 'categories',
          name: 'adminCategory',
          // route level code-splitting
          // this generates a separate chunk (category.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "category" */ './views/Admin/AdminCategory/AdminCategory.vue'),
          redirect: 'categories/list',
          children: [
            {
              path: 'list',
              name: 'adminCategoryList',
              // route level code-splitting
              // this generates a separate chunk (categoryAdd.[hash].js) for this route
              // which is lazy-loaded when the route is visited.
              component: () => import(/* webpackChunkName: "categoryAdd" */ './views/Admin/AdminCategory/AdminCategoryList.vue'),

            },
            {
              path: 'add',
              name: 'adminCategoryAdd',
              // route level code-splitting
              // this generates a separate chunk (categoryAdd.[hash].js) for this route
              // which is lazy-loaded when the route is visited.
              component: () => import(/* webpackChunkName: "categoryAdd" */ './views/Admin/AdminCategory/AdminCategoryAdd.vue'),

            },
            {
              path: 'edit/:id',
              name: 'adminCategoryEdit',
              // route level code-splitting
              // this generates a separate chunk (categoryEdit.[hash].js) for this route
              // which is lazy-loaded when the route is visited.
              component: () => import(/* webpackChunkName: "categoryEdit" */ './views/Admin/AdminCategory/AdminCategoryEdit.vue'),

            },
          ]
        },
        {
          path: 'posts',
          name: 'adminPost',
          // route level code-splitting
          // this generates a separate chunk (category.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "post" */ './views/Admin/AdminPost.vue'),
        },
        {
          path: 'comments',
          name: 'adminComment',
          // route level code-splitting
          // this generates a separate chunk (comment.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "comment" */ './views/Admin/AdminComment.vue'),
        },
        {
          path: 'users',
          name: 'adminUser',
          // route level code-splitting
          // this generates a separate chunk (user.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "user" */ './views/Admin/AdminUser.vue'),
        },
      ]
    },
  ],
});

// 导航守卫，非登录状态先登录
router.beforeEach(async (to, from, next) => {
  let token = cookie.getCookie(access_token)
  // 登录验证 路由改变时刷新cookie中的token过期时间 30天
  let role = (router.app.$options.store as any).getters.userDetail && (router.app.$options.store as any).getters.userDetail.role;
  if (!token) {
    // token过期，清理vuex中的用户信息和已登录标记
    (router.app.$options.store as any).dispatch('clearUser')
    // 需要登录权限
    // 这些页面不可访问，提示登录，跳转主页面
    if (to.name === 'setting'
      || to.name === 'newPost'
      || to.name === 'notice'
      || to.name === 'message'
      // 获取角色权限
      || to.fullPath.indexOf('admin') !== -1
    ) {
      Toast.error('请先登录')
      next({ path: '/' })
    } else {
      next()
    }
    return
  } else {
    // 验证角色权限
    if (role === null) {
      // 如果刷新页面vuex里为空，则重新请求用户
      await (router.app.$options.store as any).dispatch('getUser')
      role = (router.app.$options.store as any).getters.userDetail && (router.app.$options.store as any).getters.userDetail.role;
    }
    if (role !== 'admin' && to.fullPath.indexOf('admin') !== -1) {
      console.log(role)
      Toast.error('没有管理员权限')
      next({ path: '/' })
    }
    // token未过期，刷新token在cookie里的时间
    cookie.setCookie(access_token, token, 24 * 30) // 30天
    next()
  }
})

export default router