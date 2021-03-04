import request from '@/utils/request'

// 查询字典数据列表
export function listData(currentPage,size,dictTypeId) {
  return request({
    url: 'yeju-all-rest-api/platform/dataDictionary/info/list/'+currentPage+'/'+size+'?dictTypeId='+dictTypeId,
    method: 'get',
  })
}



// 查询字典数据详细
export function getData(dictCode) {
  return request({
    url: '/system/dict/data/' + dictCode,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(type) {
  return request({
    url: 'yeju-all-rest-api/platform/dataDictionary/type/'+type+'/list',
    method: 'get',
  })
}

// 新增字典数据
export function addData(data) {
  return request({
    url: '/system/dict/data',
    method: 'post',
    data: data
  })
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: '/system/dict/data',
    method: 'put',
    data: data
  })
}

// 删除字典数据
export function delData(dictCode) {
  return request({
    url: '/system/dict/data/' + dictCode,
    method: 'delete'
  })
}
