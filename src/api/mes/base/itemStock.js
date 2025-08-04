import request from '@/utils/request'

// 查询bom分页列表
export function pagelist(query) {
  return request({
    url: 'zy/mes/itemStock/pagelist',
    method: 'get',
    params: query
  })
}

// 查询物料分页列表
export function pagelistmaterial(query) {
  return request({
    url: 'zy/mes/itemStock/pagelistmaterial',
    method: 'get',
    params: query
  })
}


// 查询bom和物料 分页列表
export function pagelistall(query) {
  return request({
    url: 'zy/mes/itemStock/pagelistall',
    method: 'get',
    params: query
  })
}
