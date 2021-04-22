import request from '@/utils/request'

const baseUri = 'yeju-trade-rest-api/trade'

export function queryTradeList(args){

  return request({
    url: baseUri+'/query/list',
    method: 'GET',
    params: args
  })

}


