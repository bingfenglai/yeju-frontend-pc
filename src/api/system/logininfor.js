import request from '@/utils/request'

// 查询登录日志列表
export function list(currentPage,size) {
  return request({
    url: '/yeju-all-rest-api/log/login/list/'+currentPage+'?size='+size,
    method: 'get',
  })
}

// 删除登录日志
export function delLogininfor(infoId) {
  return request({
    url: '/system/logininfor/' + infoId,
    method: 'delete'
  })
}

// 清空登录日志
export function cleanLogininfor() {
  return request({
    url: '/system/logininfor/clean',
    method: 'delete'
  })
}
