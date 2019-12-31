import Vue from 'vue';
import Router from 'vue-router';
import HomeView from './views/HomeView.vue';
import PostListView from './views/PostListView.vue';
import cookie from './utils/cookie'
import { access_token } from './config'
import Toast from 'muse-ui-toast'
Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [

    // 主页
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: 'categories/:id/posts',
          name: 'PostListView',
          component: PostListView,
        }
      ]
    },

    // 发表文章页面
    {
      path: '/newPost',
      name: 'newPost',
      // route level code-splitting
      // this generates a separate chunk (newPost.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "newPost" */ './views/NewPostView.vue'),
    },

    // 文章详细信息
    {
      path: '/posts/:id',
      name: 'post',
      // route level code-splitting
      // this generates a separate chunk (posts.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "postDetail" */ './views/PostDetailView.vue'),
    },

    // 搜索文章、用户
    {
      path: '/search',
      name: 'search',
      // route level code-splitting
      // this generates a separate chunk (search.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "searchResultView" */ './views/SearchResultView.vue'),
    },

    // 用户详细信息
    {
      path: '/users/:id',
      name: 'user',
      // route level code-splitting
      // this generates a separate chunk (users.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "userView" */ './views/UserView/UserView.vue'),
      redirect: '/users/:id/posts',
      children: [
        {
          path: 'posts',
          name: 'userPosts',
          component: () => import(/* webpackChunkName: "userPostsView" */ './views/UserView/UserPostsView.vue'),
        },
        {
          path: 'comments',
          name: 'userComments',
          component: () => import(/* webpackChunkName: "userCommentsView" */ './views/UserView/UserCommentsView.vue'),
        },
        {
          path: 'fans',
          name: 'userFans',
          component: () => import(/* webpackChunkName: "userFansView" */ './views/UserView/UserFansView.vue'),
        },
        {
          path: 'follows',
          name: 'userFollows',
          component: () => import(/* webpackChunkName: "userFollowsView" */ './views/UserView/UserFollowsView/UserFollowsView.vue'),
          redirect: 'follows/followPosts',
          children: [
            {
              path: 'followPosts',
              name: 'userFollowsPosts',
              component: () => import(/* webpackChunkName: "userFollowsPostsView" */ './views/UserView/UserFollowsView/UserFollowsPostsView.vue'),
            },
            {
              path: 'followCategories',
              name: 'userFollowsCategories',
              component: () => import(/* webpackChunkName: "userFollowsCategoriesView" */ './views/UserView/UserFollowsView/UserFollowsCategoriesView.vue'),
            },
            {
              path: 'followUsers',
              name: 'userFollowsUsers',
              component: () => import(/* webpackChunkName: "userFollowsUsersView" */ './views/UserView/UserFollowsView/UserFollowsUsersView.vue'),
            }
          ]
        },
        {
          path: 'collections',
          name: 'userCollections',
          component: () => import(/* webpackChunkName: "userCollectionsView" */ './views/UserView/UserCollectionsView.vue'),
        },
      ]
    },

    // 用户设置界面
    {
      path: '/user/settings',
      name: 'userSettings',
      // route level code-splitting
      // this generates a separate chunk (users.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "UserSettingView" */ './views/UserSettingView/UserSettingView.vue'),
      redirect: '/user/settings/profile',
      children: [
        {
          path: 'profile',
          name: 'userSettingProfile',
          // route level code-splitting
          // this generates a separate chunk (UserSettingView.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "UserSettingProfile" */ './views/UserSettingView/UserSettingProfile.vue'),
        },
        {
          path: 'password',
          name: 'userSettingPassword',
          // route level code-splitting
          // this generates a separate chunk (categoryAdd.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "UserSettingPassword" */ './views/UserSettingView/UserSettingPassword.vue'),
        },

      ]
    },

    // 文章分类详细页面
    {
      path: '/categories/:id',
      name: 'category',
      // route level code-splitting
      // this generates a separate chunk (categories.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "categoryView" */ './views/CategoryView.vue'),
    },


    /***********************************************************
     * 管理员可访问页面
     * ********************************************************/
    {
      path: '/admin',
      name: 'admin',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "admin" */ './views/Admin/Admin.vue'),
      children: [
        {
          path: 'categories',
          name: 'adminCategory',
          // route level code-splitting
          // this generates a separate chunk (category.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "adminCategory" */ './views/Admin/AdminCategory/AdminCategory.vue'),
          redirect: 'categories/list',
          children: [
            {
              path: 'list',
              name: 'adminCategoryList',
              // route level code-splitting
              // this generates a separate chunk (categoryAdd.[hash].js) for this route
              // which is lazy-loaded when the route is visited.
              component: () => import(/* webpackChunkName: "adminCategoryList" */ './views/Admin/AdminCategory/AdminCategoryList.vue'),

            },
            {
              path: 'add',
              name: 'adminCategoryAdd',
              // route level code-splitting
              // this generates a separate chunk (categoryAdd.[hash].js) for this route
              // which is lazy-loaded when the route is visited.
              component: () => import(/* webpackChunkName: "adminCategoryAdd" */ './views/Admin/AdminCategory/AdminCategoryAdd.vue'),

            },
            {
              path: 'edit/:id',
              name: 'adminCategoryEdit',
              // route level code-splitting
              // this generates a separate chunk (categoryEdit.[hash].js) for this route
              // which is lazy-loaded when the route is visited.
              component: () => import(/* webpackChunkName: "adminCategoryEdit" */ './views/Admin/AdminCategory/AdminCategoryEdit.vue'),

            },
          ]
        },
        {
          path: 'posts',
          name: 'adminPost',
          // route level code-splitting
          // this generates a separate chunk (category.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "adminPost" */ './views/Admin/AdminPost.vue'),
        },
        {
          path: 'comments',
          name: 'adminComment',
          // route level code-splitting
          // this generates a separate chunk (comment.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "adminComment" */ './views/Admin/AdminComment.vue'),
        },
        {
          path: 'users',
          name: 'adminUser',
          // route level code-splitting
          // this generates a separate chunk (user.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "adminUser" */ './views/Admin/AdminUser.vue'),
        },
      ]
    },
  ],
});

const openLoading = (router: Router) => {
  (router.app.$options.store as any).dispatch('openLoading');
}

// 导航守卫，非登录状态先登录
router.beforeEach(async (to, from, next) => {
  openLoading(router);
  let token = cookie.getCookie(access_token)
  // 登录验证 路由改变时刷新cookie中的token过期时间 30天
  let role = (router.app.$options.store as any).getters.userDetail && (router.app.$options.store as any).getters.userDetail.role;
  if (!token) {
    // token过期，清理vuex中的用户信息和已登录标记
    (router.app.$options.store as any).dispatch('clearUser')
    // 需要登录权限
    // 这些页面不可访问，提示登录，跳转主页面
    if (to.name === 'userSettingProfile'
      || to.name === 'userSettingPassword'
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