import request from '@/utils/request'

// 查询巡检记录表列表
export function list(query) {
  return request({
    url: '/zm/record/list',
    method: 'get',
    params: query
  })
}


// 查询巡检记录表详细
export function info(id) {
  return request({
    url: '/zm/record/info/' + id,
    method: 'get'
  })
}

// 新增巡检记录表
export function add(data) {
  return request({
    url: '/zm/record/add',
    method: 'post',
    data: data
  })
}

// 修改巡检记录表
export function update(data) {
  return request({
    url: '/zm/record/update',
    method: 'post',
    data: data
  })
}

// 删除巡检记录表
export function del(id) {
  return request({
    url: '/zm/record/delete/' + id,
    method: 'post'
  })
}
