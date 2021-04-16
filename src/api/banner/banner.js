import request from '@/utils/request'

//条件分页查询
export function list(args){
  return request({
    url: 'yeju-all-rest-api/advertisement/banner/list',
    method: 'GET',
    params: args
  })
}

// 创建轮播图
export function create(args){
  return request({
    url: 'yeju-all-rest-api/advertisement/banner',
    method: 'POST',
    data: args
  })
}

