
import request from '@/utils/request'



// 查询BOM树
export function bomInfo(bomNo, itemNo) {
  return request({
    url: 'zy/mes/bomUsed/item_use_tree',
    method: 'get',
    params: { bomNo, itemNo }
  })
}
