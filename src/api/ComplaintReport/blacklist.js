import request from '@/utils/request'

export function listBlacklist(query) {
  return request({
    url: '/ComplaintReport/blacklist/list',
    method: 'get',
    params: query
  })
}

export function getBlacklist(blacklistId) {
  return request({
    url: '/ComplaintReport/blacklist/' + blacklistId,
    method: 'get'
  })
}

export function addBlacklist(data) {
  return request({
    url: '/ComplaintReport/blacklist',
    method: 'post',
    data: data
  })
}

export function updateBlacklist(data) {
  return request({
    url: '/ComplaintReport/blacklist',
    method: 'put',
    data: data
  })
}

export function delBlacklist(blacklistId) {
  return request({
    url: '/ComplaintReport/blacklist/' + blacklistId,
    method: 'delete'
  })
}

export function unblockBlacklist(blacklistIds) {
  return request({
    url: '/ComplaintReport/blacklist/unblock/' + blacklistIds,
    method: 'put'
  })
}

export function checkUserInBlacklist(userId) {
  return request({
    url: '/ComplaintReport/blacklist/check/' + userId,
    method: 'get'
  })
}

export function getUserInfo(userId) {
  return request({
    url: '/system/user/' + userId,
    method: 'get'
  })
}
