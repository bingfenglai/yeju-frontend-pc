import request from '@/utils/request'

// 综合条件查询接口
export function query(args){
  return request({
    url: 'yeju-all-rest-api/sms/template',
    method: 'GET',
    params: args
  })
}


export function createSmsTemplate(args){
  return request({
    url: 'yeju-all-rest-api/sms/template',
    method: 'POST',
    data: args
  })
}

export function updateSmsTemplate(args){
  return request({
    url: 'yeju-all-rest-api/sms/template',
    method: 'PUT',
    data: args
  })
}

export function deleteSmsTemplateById(id){
  return request({
    url: 'yeju-all-rest-api/sms/template/'+id,
    method: 'DELETE'
  })
}

export function deleteSmsTemplateByIdBatch(ids){
  return request({
    url: 'yeju-all-rest-api/sms/template',
    method: 'DELETE',
    data: ids
  })
}
