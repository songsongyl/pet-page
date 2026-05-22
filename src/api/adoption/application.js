import request from '@/utils/request'

// 提交领养申请
export function submitAdoptionApplication(data) {
  return request({
    url: '/adoption/application/submit',
    method: 'post',
    data
  })
}

// 下载领养协议模板
export function downloadAgreementTemplate() {
  return request({
    url: '/adoption/application/agreement/download',
    method: 'get',
    responseType: 'blob'
  })
}

// Mock下载领养协议模板（用于演示，实际部署时移除）
export function downloadAgreementTemplateMock() {
  return new Promise((resolve) => {
    // 创建一个简单的PDF内容
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
>>
endobj
xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
trailer
<<
/Size 4
/Root 1 0 R
>>
startxref
199
%%EOF`

    const blob = new Blob([pdfContent], { type: 'application/pdf' })
    resolve(blob)
  })
}

// 获取领养申请列表
export function getAdoptionList(params) {
  return request({
    url: '/adoption/application/list',
    method: 'get',
    params
  })
}

// 获取领养申请详情
export function getAdoptionDetail(id) {
  return request({
    url: `/adoption/application/${id}`,
    method: 'get'
  })
}

// 审批领养申请
export function approveAdoption(id, data) {
  return request({
    url: `/adoption/application/${id}/approve`,
    method: 'put',
    data
  })
}

// 上传签署后的协议
export function uploadAgreement(id, file) {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: `/adoption/application/${id}/agreement`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 批量审批领养申请
export function batchApproveAdoption(data) {
  return request({
    url: '/adoption/application/admin/batch-approve',
    method: 'post',
    data
  })
}