import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    noCache: true                // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/redirect'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error/401'], resolve),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: (resolve) => require(['@/views/index'], resolve),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: false,
    redirect: 'noRedirect',
    children: [
      {
        path: 'profile',
        component: (resolve) => require(['@/views/system/user/profile/index'], resolve),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:dictId(\\d+)',
        component: (resolve) => require(['@/views/system/dict/data'], resolve),
        name: 'Data',
        meta: { title: '字典数据', icon: '' }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'log',
        component: (resolve) => require(['@/views/log/joblog'], resolve),
        name: 'JobLog',
        meta: { title: '调度日志' }
      }
    ]
  },

  {
    path: '/gen',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'edit/:tableId(\\d+)',
        component: (resolve) => require(['@/views/tool/gen/editTable'], resolve),
        name: 'GenEdit',
        meta: { title: '修改生成配置' }
      }
    ]
  },
  /**  ====================================================================
   *   特别说明： 以下路由提前被定义好，但是只有后端根据权限传来对应的路由信息后才能被显示出来
   *   显示顺序由后端决定
   *   如果不提前定义，浏览器会出现 304
   *   =====================================================================
   */

  {
    path: '/system',
    component: Layout,
    hidden : true,
    children : [
      {
        path: 'user',
        component : (resolve) => require(['@/views/system/user/index'],resolve),
        name: 'User',
        meta : {title : '用户管理'}
      },

      {
        path: 'role',
        component : (resolve) => require(['@/views/system/role/index'],resolve),
        name: 'Role',
        meta : {title : '角色管理'}
      },

      {
        path: 'menu',
        component : (resolve) => require(['@/views/system/menu/index'],resolve),
        name: 'Menu',
        meta : {title : '菜单管理'}
      },

      {
        path: 'dict',
        component : (resolve) => require(['@/views/system/dict/index'],resolve),
        name: 'Dict',
        meta : {title : '数据字典'}
      }



    ]
  },

  {
    path: '/monitor',
    component: Layout,
    hidden : true,
    children: [
      {
        path: '/online',
        component : (resolve) => require(['@/views/monitor/online/index'],resolve),
        name: 'online',
        meta : {title : '在线用户'}
      },

    ]
  },

  {
    path: '/product',
    component: Layout,
    hidden : true,
    children : [
      {

        path: '/house',
        component : (resolve) => require(['@/views/product/house/index']),
        name: 'house',
        hidden : false,
        meta : {title : 'API文档'}
      },
      {
        path: '/house/details/:house_id/:houseStatus(\\d+)',
        component : (resolve) => require(['@/views/product/house/details'],resolve),
        name: 'house_details',
        hidden: false,
        meta: {title: '房源详情'}
      }


    ]
  },

  {
    path: '/tool',
    component: Layout,
    hidden : true,
    children: [

      ]
  }

]

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
