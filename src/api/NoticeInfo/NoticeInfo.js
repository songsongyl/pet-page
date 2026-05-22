import request from '@/utils/request'

// 查询公告信息列表
export function listNoticeInfo(query) {
  return request({
    url: '/NoticeInfo/NoticeInfo/list',
    method: 'get',
    params: query
  })
}

// 查询公告信息详细
export function getNoticeInfo(noticeId) {
  return request({
    url: '/NoticeInfo/NoticeInfo/' + noticeId,
    method: 'get'
  })
}

// 新增公告信息
export function addNoticeInfo(data) {
  return request({
    url: '/NoticeInfo/NoticeInfo',
    method: 'post',
    data: data
  })
}

// 修改公告信息
export function updateNoticeInfo(data) {
  return request({
    url: '/NoticeInfo/NoticeInfo',
    method: 'put',
    data: data
  })
}

// 删除公告信息
export function delNoticeInfo(noticeId) {
  return request({
    url: '/NoticeInfo/NoticeInfo/' + noticeId,
    method: 'delete'
  })
}

// 更新公告浏览次数
export function updateNoticeViewCount(noticeId) {
  return request({
    url: '/NoticeInfo/NoticeInfo/' + noticeId + '/view',
    method: 'put'
  })
}
