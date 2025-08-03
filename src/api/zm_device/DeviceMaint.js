// DeviceMaint.js - 保养记录接口文件

import request from '@/utils/request'

// 获取设备详情 + 保养记录（扫码后使用  备用）
export function getDeviceDetail(deviceId) {
  return request({
    url: '/zm/deviceMaint/getDetailById',
    method: 'get',
    params: { deviceId }
  })
}



// 查询设备保养记录（根据设备ID）
export function listMaint(par) {
  return request({
    url: '/zm/deviceMaint/listbyid',
    method: 'get',
    params: { par }
  })
}

// 新增保养记录（含绑定关系）
export function addMaint(data) {
  return request({
    url: '/zm/deviceMaint/add',
    method: 'post',
    data
  })
}

// 修改保养记录（限制：当天创建记录可修改）
export function editMaint(data) {
  return request({
    url: '/zm/deviceMaint/edit',
    method: 'post',
    data
  })
}

// 删除保养记录（包含中间表）
export function deleteMain(id) {
  return request({
    url: '/zm/deviceMaint/delete',
    method: 'get',
    params: { id }
  })
}
