
import request from '@/utils/request'



// 查询
export function bomInfo(bomNo) {
  return request({
    url: 'zy/mes/bomUsed/item_use_tree',
    method: 'get',
    params: { bomNo }
  })
}
