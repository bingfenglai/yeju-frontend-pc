import request from '@/utils/request'

const baseUri = 'yeju-all-rest-api/integration'

export function getIntegrationList(args){
  return request({
    url: baseUri+'/list',
    method: 'GET',
    params: args
  })
}
