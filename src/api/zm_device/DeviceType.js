import request from '@/utils/request'

// 查询列表
export function listDept(query) {
  return request({
    url: '/zm/devicetype/list',
    method: 'get',
    params: query
  })
}

// 新增
export function addDept(data) {
  return request({
    url: '/zm/devicetype/add',
    method: 'post',
    data: data
  })
}


// 删除
export function delDept(deptId) {
  return request({
    url: '/zm/devicetype/delete/' + deptId,
    // url: `/zm/devicetype/delete/${deptId}`,
    method: 'get'
  })
}




// // 查询详细
export function getDept(deptId) {
  return request({
    url: '/zm/devicetype/info/' + deptId,
    method: 'get'
  })
}

// 查询列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return request({
    url: '/zm/devicetype/list/exclude/' + deptId,
    method: 'get'
  })
}

// 修改
export function updateDept(data) {
  return request({
    url: '/zm/devicetype/update',
    method: 'post',
    data: data
  })
}

// // // // // // // // // // // // // // // // // // // // // // // // //  EL树 // // // // // // // // // // // // // // // // //

// <el-tree>树结构填充和下拉框填充
export function getTreeNode() {
  return request({
    url: '/zm/devicetype/getTreeNode',
    method: 'get'
  })
}
