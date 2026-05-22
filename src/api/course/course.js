import request from '@/utils/request'

// 查询知识课堂列表
export function listCourse(query) {
  return request({
    url: '/course/course/list',
    method: 'get',
    params: query
  })
}

// 查询知识课堂详细
export function getCourse(courseId) {
  return request({
    url: '/course/course/' + courseId,
    method: 'get'
  })
}

// 新增知识课堂
export function addCourse(data) {
  return request({
    url: '/course/course',
    method: 'post',
    data: data
  })
}

// 修改知识课堂
export function updateCourse(data) {
  return request({
    url: '/course/course',
    method: 'put',
    data: data
  })
}

// 删除知识课堂
export function delCourse(courseId) {
  return request({
    url: '/course/course/' + courseId,
    method: 'delete'
  })
}

// 更新课程浏览次数
export function updateViewCount(courseId) {
  return request({
    url: '/course/course/' + courseId + '/view',
    method: 'put'
  })
}

// 更新课程收藏次数
export function updateCollectCount(courseId) {
  return request({
    url: '/course/course/' + courseId + '/collect',
    method: 'put'
  })
}
