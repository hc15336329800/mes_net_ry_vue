import request from '@/utils/request'

// 查询物料库存分页列表
export function pagelist(query) {
  return request({
    url: 'zy/mes/itemStock/pagelist',
    method: 'get',
    params: query
  })
}
