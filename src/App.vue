<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
const { refreshTokenMethod} = require('@/utils/auth')
import myStore from '@/store/token'

export default  {
  name:  'App'
}

/**
 *  每5分种请求刷新token,并计数+1，最多可以连续请求3次
 */
setInterval(refreshTokenMethod,1000*60*3)
//setInterval(refreshTokenMethod,3000)
/*重置刷新token请求计数，每次操作都重置，
 * 连续操作下可以保证token不断被刷新，不会过期，但是不操作后，15分钟（countRefreshToken=3）后
 *不再请求刷新token，使得token自动失效
 */
function refreshTokenCounterReset(){

  console.log("重置",myStore.countRefreshToken)
  myStore.countRefreshToken = 0;
}

//
window.addEventListener("click", refreshTokenCounterReset)


</script>
