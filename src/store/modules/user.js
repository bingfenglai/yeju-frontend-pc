import { login, logout, getInfo, refreshToken } from '@/api/login'
import { getToken, setToken, setExpiresIn, removeToken } from '@/utils/auth'
import {realTimeNotice} from '@/api/system/notice'
const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: 'http://8.129.77.225:9000/yeju/8469f77f-b29d-43cb-b90c-b5acab2a4bba56eb70e8c716a.jpg',
    roles: [],
    permissions: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_EXPIRES_IN: (state, time) => {
      state.expires_in = time
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {

      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const principal = userInfo.principal
      const certificate = userInfo.certificate
      const verificationCode = userInfo.verificationCode
      const verificationCodeKey = userInfo.verificationCodeKey
      return new Promise((resolve, reject) => {
        login(principal, certificate, verificationCode, verificationCodeKey).then(res => {

          let data = res.data;
          setToken(data.accessToken)
          commit('SET_TOKEN', data.accessToken)
          setExpiresIn(data.expiresAt)
          commit('SET_EXPIRES_IN', data.expiresAt)

          //读取系统通知
          //realTimeNotice(data.accessToken);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {

      return new Promise((resolve, reject) => {

        getInfo(state.token).then(res => {
          console.log(res)
          //const user = res.user
          const data = res.data
          //const avatar = user.avatar === "" ? require("@/assets/image/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;

          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组

            commit('SET_ROLES', data.roles)
            commit('SET_PERMISSIONS', data.permissions)
          } else {

            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)

          resolve(res)

        }).catch(error => {
          reject(error)
        })

      })

    },

    // 刷新token
    RefreshToken({commit, state}) {
      return new Promise((resolve, reject) => {
        refreshToken(state.token).then(res => {
          setExpiresIn(res.data.expires_in)
          setToken(res.data.access_token)
          commit('SET_EXPIRES_IN', res.data.expires_at)
          commit('SET_TOKEN',res.data.access_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
