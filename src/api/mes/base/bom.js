
import request from '@/utils/request'



// 查询BOM树
export function bomInfo(bomNo, itemNo) {
  return request({
    url: 'zy/mes/bomUsed/item_use_tree',
    method: 'get',
    params: { bomNo, itemNo }
  })
}



// 查询BOM列表（占位）
export function listBom() {
  return request({
    url: 'zy/mes/bom/list',
    method: 'get'
  })
}

// 新增子节点（占位）
export function addBomChild(data) {
  return request({
    url: 'zy/mes/bomUsed/add',
    method: 'post',
    data
  })
}

// 删除子节点（占位）
export function deleteBomChild(usedId) {
  return request({
    url: `zy/mes/bomUsed/${usedId}`,
    method: 'delete'
  })
}
