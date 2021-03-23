import request from '@/utils/request'

// 查询操作日志列表
export function list(currentPage,size) {
  return request({
    url:  'yeju-all-rest-api/log/operationLog/list/'+currentPage+'?size='+size,
    method: 'get',
  })
}

// 删除操作日志
export function delOperlog(operId) {
  return request({
    url: '/monitor/operlog/' + operId,
    method: 'delete'
  })
}

// 清空操作日志
export function cleanOperlog() {
  return request({
    url: '/system/operlog/clean',
    method: 'delete'
  })
}
