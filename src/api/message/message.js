import request from '@/utils/request'

export function getSystemMessageGroupNameAndId(){

  return request({
    url: '/yeju-all-rest-api/message/group/nameAndId',
    method: 'GET'

  })
}
