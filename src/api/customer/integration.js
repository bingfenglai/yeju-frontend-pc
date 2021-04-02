import request from '@/utils/request'

export function getPage(args){
  return request({
    url: '',
    method: 'GET',
    params: args
  })
}
