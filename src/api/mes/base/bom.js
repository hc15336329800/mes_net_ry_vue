
import request from '@/utils/request'



// 查询BOM树
export function bomInfo(bomNo, itemNo) {
  return request({
    url: 'zy/mes/bomUsed/item_use_tree',
    method: 'get',
    params: { bomNo, itemNo }
  })
}




// 新增子节点
// data 结构示例：
// [
//   {
//     itemNo: '614471',
//     useItemNo: '614970',
//     useItemCount: 2,
//     useItemType: '01'
//   }
// ]
export function addBomChild(data) {
  return request({
    url: 'zy/mes/bomUsed/load',
    method: 'post',
    data
  })
}

// 删除指定节点及其子节点
export function deleteBomChild(id) {
  return request({
    url: 'zy/mes/bomUsed/delete_bom',
    method: 'post',
    data: id
  })
}
