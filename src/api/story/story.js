import request from '@/utils/request'

// 发布故事
export function publishStory(data) {
  return request({
    url: '/story/publish',
    method: 'post',
    data
  })
}

// 获取故事列表
export function getStoryList(params) {
  return request({
    url: '/story/list',
    method: 'get',
    params
  })
}

// 获取故事详情
export function getStoryDetail(id) {
  return request({
    url: `/story/${id}`,
    method: 'get'
  })
}

// 更新故事
export function updateStory(data) {
  return request({
    url: '/story',
    method: 'put',
    data
  })
}

// 点赞故事
export function likeStory(id) {
  return request({
    url: `/story/${id}/like`,
    method: 'post'
  })
}

// 评论故事
export function commentStory(id, data) {
  return request({
    url: `/story/${id}/comment`,
    method: 'post',
    data
  })
}

// 获取故事评论列表
export function getStoryComments(id, params) {
  return request({
    url: `/story/${id}/comments`,
    method: 'get',
    params
  })
}

// 删除故事
export function deleteStory(id) {
  return request({
    url: `/story/${id}`,
    method: 'delete'
  })
}

// 更新故事浏览次数
export function addStoryViewCount(id) {
  return request({
    url: `/story/${id}/view`,
    method: 'put'
  })
}