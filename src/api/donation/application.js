import request from '@/utils/request'

// ==================== 物资捐赠相关接口 ====================

/**
 * 查询物资捐赠申请列表
 */
export function getDonationList(params) {
  return request({
    url: '/donation/application/list',
    method: 'get',
    params
  })
}

/**
 * 导出物资捐赠申请列表
 */
export function exportDonationList(data) {
  return request({
    url: '/donation/application/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

/**
 * 获取物资捐赠申请详细信息
 */
export function getDonationDetail(donationId) {
  return request({
    url: `/donation/application/${String(donationId)}`,
    method: 'get'
  })
}

/**
 * 新增物资捐赠申请
 */
export function addDonation(data) {
  return request({
    url: '/donation/application',
    method: 'post',
    data
  })
}

/**
 * 修改物资捐赠申请
 */
export function editDonation(data) {
  return request({
    url: '/donation/application',
    method: 'put',
    data
  })
}

/**
 * 删除物资捐赠申请
 */
export function deleteDonation(donationIds) {
  return request({
    url: `/donation/application/${donationIds.join(',')}`,
    method: 'delete'
  })
}

/**
 * 提交物资捐赠申请
 */
export function submitDonationApplication(data) {
  return request({
    url: '/donation/application/submit',
    method: 'post',
    data
  })
}

/**
 * 确认收到捐赠
 */
export function confirmDonation(donationId) {
  return request({
    url: `/donation/application/${String(donationId)}/confirm`,
    method: 'put'
  })
}

/**
 * 取消捐赠
 */
export function cancelDonation(donationId) {
  return request({
    url: `/donation/application/${String(donationId)}/cancel`,
    method: 'put'
  })
}

/**
 * 获取待确认捐赠申请列表（管理员）
 */
export function getAdminDonationList(params) {
  return request({
    url: '/donation/application/admin/list',
    method: 'get',
    params
  })
}

/**
 * 批量确认捐赠（管理员）
 */
export function batchConfirmDonation(data) {
  return request({
    url: '/donation/application/admin/batch-confirm',
    method: 'put',
    data
  })
}

/**
 * 批量取消捐赠（管理员）
 */
export function batchCancelDonation(data) {
  return request({
    url: '/donation/application/admin/batch-cancel',
    method: 'put',
    data
  })
}

// ==================== 资金捐助相关接口 ====================

/**
 * 提交资金捐助
 */
export function submitFundDonation(data) {
  return request({
    url: '/donation/application/submit',
    method: 'post',
    data
  })
}

/**
 * 获取资金捐助列表
 */
export function getFundDonationList(params) {
  return request({
    url: '/donation/application/list',
    method: 'get',
    params
  })
}

// ==================== 志愿服务相关接口 ====================

/**
 * 志愿者注册/提交志愿服务申请
 */
export function registerVolunteer(data) {
  return request({
    url: '/donation/application/submit',
    method: 'post',
    data
  })
}

/**
 * 获取志愿者列表
 */
export function getVolunteerList(params) {
  return request({
    url: '/donation/application/list',
    method: 'get',
    params
  })
}

// ==================== 捐赠记录公示相关接口 ====================

/**
 * 获取捐赠公示列表
 */
export function getDonationPublicList(params) {
  return request({
    url: '/donation/application/list',
    method: 'get',
    params
  })
}