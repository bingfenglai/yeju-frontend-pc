import request from '@/utils/request'

const baseUrl = 'yeju-all-rest-api/basedata/district';
// 查询地域结果树接口
export function queryDistrictTree(args){
  return request({
    url: baseUrl+'/tree/v2',
    method: 'GET',
    params: args
  })
}

export function queryDistrictTree2(){
  return request({
    url: baseUrl+'/tree',
    method: 'GET',
  })
}

export function createDistrict(args){
  return request({
    url: baseUrl,
    method: 'POST',
    data: args
  })
}

export function updateDistrictById(args){
  return request({
    url: baseUrl,
    method: 'PUT',
    data: args
  })
}

export function deleteDistrictById(id){
  return request({
    url: baseUrl+'/'+id,
    method: 'DELETE',
  })
}

export function getDirectChildNodeById(id){
  return request({
    url: baseUrl+'/direct/'+id,
    method: 'GET',
  })
}


