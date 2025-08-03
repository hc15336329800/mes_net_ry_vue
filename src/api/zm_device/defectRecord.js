//   文件： @/api/zm_device/defectRecord.js

import request from '@/utils/request'

// 查询列表
export function list(query) {
  return request({
    url: '/zm/defectRecord/list',
    method: 'get',
    params: query
  })
}


// 查询详细
export function info(id) {
  return request({
    url: '/zm/defectRecord/info/' + id,
    method: 'get'
  })
}

// 新增
export function add(data) {
  return request({
    url: '/zm/defectRecord/add',
    method: 'post',
    data: data
  })
}

// 修改
export function update(data) {
  return request({
    url: '/zm/defectRecord/update',
    method: 'post',
    data: data
  })
}

// 删除
export function del(id) {
  return request({
    url: '/zm/defectRecord/delete/' + id,
    method: 'post'
  })
}
