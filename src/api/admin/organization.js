import request from '@/utils/request'

// 获取合作机构列表
export function getOrganizationList(params) {
  return request({
    url: '/admin/organization/list',
    method: 'get',
    params
  })
}

// 添加合作机构
export function addOrganization(data) {
  if (!data) {
    return Promise.reject(new Error('缺少机构数据'))
  }
  return request({
    url: '/admin/organization',
    method: 'post',
    data
  })
}

// 获取合作机构详情
export function getOrganizationDetail(id) {
  if (!id) {
    return Promise.reject(new Error('缺少机构ID参数'))
  }
  return request({
    url: `/admin/organization/${id}`,
    method: 'get'
  })
}

// 获取合作机构详情（用于编辑和查看页面）
export function getOrganizationById(id) {
  if (!id) {
    return Promise.reject(new Error('缺少机构ID参数'))
  }
  return request({
    url: `/admin/organization/${id}`,
    method: 'get'
  })
}

// 审核合作机构
export function approveOrganization(id, data) {
  if (!id) {
    return Promise.reject(new Error('缺少机构ID参数'))
  }
  return request({
    url: `/admin/organization/${id}/approve`,
    method: 'put',
    data
  })
}

// 删除合作机构
export function deleteOrganization(id) {
  if (!id) {
    return Promise.reject(new Error('缺少机构ID参数'))
  }
  return request({
    url: `/admin/organization/${id}`,
    method: 'delete'
  })
}

// 更新合作机构信息
export function updateOrganization(data) {
  if (!data || !data.id) {
    return Promise.reject(new Error('缺少机构ID参数'))
  }
  return request({
    url: `/admin/organization/${data.id}`,
    method: 'put',
    data
  })
}



// 获取合作机构统计数据
export function getOrganizationStats() {
  return request({
    url: '/admin/organization/stats',
    method: 'get'
  })
}