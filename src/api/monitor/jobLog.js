import request from '@/utils/request'

// 查询调度日志列表
export function listJobLog(currentPage,size) {
  return request({
    url:  'yeju-all-rest-api/log/jobLog/list/'+currentPage+'?size='+size,
    method: 'get',
  })
}

// 删除调度日志
export function delJobLog(jobLogId) {
  return request({
    url: '/schedule/job/log/' + jobLogId,
    method: 'delete'
  })
}

// 清空调度日志
export function cleanJobLog() {
  return request({
    url: '/schedule/job/log/clean',
    method: 'delete'
  })
}
