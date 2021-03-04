import request from '@/utils/request'

export function getJobGroupNameAndId(){
  return request({
    url : '/yeju-all-rest-api/job/jobGroup/getNameAndId',
    method: 'get'

  })
}
