import request from '@/utils/request'

// 分页查询任务列表
export function getTaskPageList(query) {
  return request({
    url: '/zm/deviceInspectionTask/pagelist',
    method: 'get',
    params: query
  })
}


// 新增任务 （缺陷页面专属）
export function addTask(data) {
  return request({
    url: '/zm/deviceInspectionTask/add',
    method: 'post',
    data: data
  })
}


// 新增任务 （缺陷页面新增任务专属）
export function addQxTask(data) {
  return request({
    url: '/zm/deviceInspectionTask/addQx',
    method: 'post',
    data: data
  })
}




// 修改任务
export function updateTask(data) {
  return request({
    url: '/zm/deviceInspectionTask/update',
    method: 'post',
    data: data
  })
}


// 删除任务
export function deleteTask(ids) {
  return request({
    url: '/zm/deviceInspectionTask/delete',
    method: 'post',
    data: ids
  })
}
