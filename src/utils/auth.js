import Cookies from 'js-cookie'
import { refreshToken } from '@/api/login'

import myStore from '@/store/token'

const TokenKey = 'Authorization'

const ExpiresInKey = 'Token-Expires-In'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getExpiresIn() {
  return Cookies.get(ExpiresInKey) || -1
}

export function setExpiresIn(time) {
  return Cookies.set(ExpiresInKey, time)
}

export function removeExpiresIn() {
  return Cookies.remove(ExpiresInKey)
}



export function refreshTokenMethod(){

  if (getToken()!==null && getToken()!==undefined &&myStore.countRefreshToken <3){
    refreshToken().then(res=>{
      let data = res.data;
      console.log(data.access_token)
      setToken(data.access_token);
      console.log("计数: ",myStore.countRefreshToken)
      myStore.countRefreshToken =1 + myStore.countRefreshToken
    })
  }


}
