// 设备管理接口js（ 路径：@/api/zm_device/DeviceManagement）

import request from '@/utils/request'

// 查询分页列表
export function pagelist(query) {
  return request({
    url: '/zm/deviceManagement/pagelist',
    method: 'get',
    params: query
  })
}

// 根据设备ID数组查询设备信息
export function listByIds(idList) {
  return request({
    url: '/zm/deviceManagement/listByIds',
    method: 'post',
    data: idList
  })
}


// 查询分页列表 -- 排序sortByMaintenanceCycle
export function pagelistByMaint(query) {
  return request({
    url: '/zm/deviceManagement/pagelistByMaint',
    method: 'get',
    params: query
  })
}

// 查询设备分类下的所有设备 （自定义SQL-涉及中间表）
export function pagelistbytype(query) {
  return request({
    url: '/zm/deviceManagement/pagelistbytype',
    method: 'get',
    params: query
  })
}


// 新增
export function add(data) {
  return request({
    url: '/zm/deviceManagement/add',
    method: 'post',
    data: data
  })
}

// 修改
export function update(data) {
  return request({
    url: '/zm/deviceManagement/update',
    method: 'post',
    data: data
  })
}



// 删除设备
export function del(deviceId) {
  return request({
    url: '/zm/deviceManagement/delete',
    method: 'post',
    data: deviceId
  });
}


// 根据巡检记录ID，查询巡检记录中的已完成设备ID数组
export function getFinishedDeviceIds(id) {
  return request({
    url: `/zm/record/getDeviceIds/${id}`,
    method: 'get'
  })
}
