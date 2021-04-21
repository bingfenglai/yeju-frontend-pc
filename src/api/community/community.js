import request from '@/utils/request'

const baseUri = 'yeju-all-rest-api/basedata/community'

export function getList(args){
  return request({
    url: baseUri,
    method: 'GET',
    params: args
  })
}

export function addCommunity(args){
  return request({
    url: baseUri,
    method: 'POST',
    data: args
  })
}

export function updateCommunity(args){
  return request({
    url: baseUri,
    method: 'PUT',
    data: args
  })
}

export function deleteCommunityById(id){
  return request({
    url: baseUri+'/'+id,
    method: 'DELETE',
  })
}

export function deleteBatchCommunityByIds(ids){
  return request({
    url: baseUri,
    method: 'DELETE',
    data: ids
  })
}


