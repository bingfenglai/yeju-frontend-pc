import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  return request({
    url: '/yeju-all-rest-api/platform/menu/getRouters',
    method: 'get'
  })
}
