
import request from '@/utils/request'


// 查询物料分页列表
export function pagelist(query) {
  return request({
    url: 'zy/mes/itemStock/pagelistmaterial',
    method: 'get',
    params: query
  })
}
