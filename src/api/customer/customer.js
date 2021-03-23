import request from '@/utils/request'

export function getCustomerList(currentPage,size){
  return request({
    url: 'yeju-all-rest-api/customer/list/'+currentPage + '?size='+size,
    method: 'GET'
  })
}
