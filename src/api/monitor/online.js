import request from '@/utils/request'

// 查询在线用户列表
export function list(currentPage,size) {
  return request({
    url: 'yeju-all-rest-api/platform/online/list/'+currentPage+'?size='+size,
    method: 'get'
  })
}

// 强退用户
export function forceLogout(principal) {
  return request({
    url: 'yeju-all-rest-api/platform/online/' + principal,
    method: 'delete'
  })
}
