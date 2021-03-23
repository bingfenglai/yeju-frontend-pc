import request from '@/utils/request'


export function findPage(currentPage,size){
  return request({
    url: 'yeju-all-rest-api/product/house/list/'+currentPage+'?size='+size,
    method: 'GET',
  })
}

export function findDetailsByIdAndStatus(id,status){
  return request({
    url: 'yeju-all-rest-api/product/house/'+id+'?houseStatus='+status,
    method: 'GET'
  })
}
