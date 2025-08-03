import request from '@/utils/request'

// 查询设备巡检操作票表列表
export function listTicket(query) {
  return request({
    url: '/zm/ticket/list',
    method: 'get',
    params: query
  })
}

// 查询设备巡检操作票表详细
export function getTicket(id) {
  return request({
    url: '/zm/ticket/info/' + id,
    method: 'get'
  })
}

// 新增设备巡检操作票表
export function addTicket(data) {
  return request({
    url: '/zm/ticket/add',
    method: 'post',
    data: data
  })
}

// 修改设备巡检操作票表
export function updateTicket(data) {
  return request({
    url: '/zm/ticket/update',
    method: 'post',
    data: data
  })
}

// 删除设备巡检操作票表
export function delTicket(id) {
  return request({
    url: '/zm/ticket/delete/' + id,
    method: 'post'
  })
}
