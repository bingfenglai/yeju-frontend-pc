import { constantRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'

const permission = {
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getRouters().then(res => {
          console.log(res.data)
          const accessedRoutes = filterAsyncRouter(res.data)
          console.log("向后端请求路由数据",res.data)
          accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
          //accessedRoutes.push(accessedRoutes)

          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        })
      })
    }
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {


  return asyncRouterMap.filter(route => {

    console.log("转换前：",route)
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        console.log("组件路径：",route.component)
        route.component = Layout
      } else {
        route.component = loadView(route.component)

        console.log("组件封装后：",route.component)
      }
    }
    console.log("子菜单： ",route.children)
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
}

export const loadView = (view) => { // 路由懒加载
  console.log("视图： ",view)
  return (resolve) =>  require([`@/views/${view}`], resolve)
}

export default permission
