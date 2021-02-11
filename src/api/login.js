import request from '@/utils/request'
import qs from 'qs';
import Axios from 'axios'
import * as url from 'url'
import { praseStrEmpty } from '@/utils/ruoyi'

const client_id = 'web'
const client_secret = '123456'
const scope = 'server'

// 登录方法
export function login(principal, certificate, verificationCode, verificationCodeKey) {


  const data = {
    principal: principal,
    certificate: certificate,
    verificationCode: verificationCode
  }

  return request({
    url: '/auth-consumer/auth/login',
    method: 'post',
    data: qs.stringify(data),
    headers: {'verificationCodeKey':verificationCodeKey,
      'Content-Type': 'application/x-www-form-urlencoded'}
  })

}


// 刷新方法
export function refreshToken() {
  return request({
    url: '/auth-consumer/authz/refreshToken',
    method: 'get'
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/auth-consumer/authz/getAuthzDetailInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/auth-consumer/auth/logout',
    method: 'delete'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/auth-consumer/auth/code/image',
    method: 'get'
  })
}
