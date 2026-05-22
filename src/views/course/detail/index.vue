<template>
  <div class="course-detail tech-page tech-grid-bg">
    <el-card shadow="hover" class="tech-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon">
              <Reading />
            </el-icon>
            课程详情
          </span>
          <el-button @click="goBack" class="back-btn">
            <el-icon>
              <ArrowLeft />
            </el-icon>
            返回列表
          </el-button>
        </div>
      </template>

      <div v-loading="loading" class="course-detail-content">
        <div class="course-header">
          <h1 class="course-title">{{ course.courseTitle }}</h1>
          <div class="course-info-row">
            <span class="info-item">
              <span class="info-icon">📚</span>
              <span class="info-label">课程类型：</span>
              <el-tag :type="getCourseTypeColor(course.courseType)" effect="dark" size="small" class="info-tag">
                {{ getCourseType(course.courseType) }}
              </el-tag>
            </span>
            <span class="info-divider">|</span>
            <span class="info-item">
              <span class="info-icon">📊</span>
              <span class="info-label">难度等级：</span>
              <el-tag :type="getDifficultyType(course.difficultyLevel)" effect="dark" size="small" class="info-tag">
                {{ getDifficultyLevel(course.difficultyLevel) }}
              </el-tag>
            </span>
            <span class="info-divider">|</span>
            <span class="info-item">
              <span class="info-icon">📅</span>
              <span class="info-label">发布时间：</span>
              <el-tag type="info" effect="dark" size="small" class="info-tag">
                {{ course.publishTime ? parseTime(course.publishTime, '{y}-{m}-{d}') : '暂无' }}
              </el-tag>
            </span>
          </div>
          <div class="course-meta">
            <span class="meta-item">
              <el-icon>
                <User />
              </el-icon>
              {{ course.teacherName }}
            </span>
            <span class="meta-item">
              <el-icon>
                <View />
              </el-icon>
              {{ course.viewCount || 0 }} 次浏览
            </span>
            <span class="meta-item">
              <el-icon>
                <Star />
              </el-icon>
              {{ course.collectCount || 0 }} 次收藏
            </span>
          </div>
        </div>

        <el-image v-if="course.courseCover" :src="getImageUrl(course.courseCover)" fit="cover" class="course-cover"
          :preview-src-list="[getImageUrl(course.courseCover)]" :preview-teleported="true">
          <template #error>
            <div class="image-placeholder">
              <el-icon>
                <Picture />
              </el-icon>
              <span>暂无封面</span>
            </div>
          </template>
        </el-image>
        <div v-else class="image-placeholder">
          <el-icon>
            <Picture />
          </el-icon>
          <span>暂无封面</span>
        </div>

        <el-divider content-position="left">
          <el-icon>
            <Document />
          </el-icon>
          课程内容
        </el-divider>

        <div class="course-content" v-html="course.courseContent"></div>

        <div class="course-actions">
          <el-button type="primary" @click="handleCollect" :icon="isCollected ? 'StarFilled' : 'Star'">
            {{ isCollected ? '已收藏' : '收藏' }}
          </el-button>
          <el-button @click="handleShare" icon="Share">分享</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { getCourse, updateViewCount, updateCollectCount } from '@/api/course/course'
import { parseTime } from '@/utils/ruoyi'
import { ArrowLeft, User, View, Star, Reading, Document, Share, Picture } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const course = ref({})
const isCollected = ref(false)
// 课程类型选项
const courese = ref([
  { label: '科学饲养宝典', value: '1' },
  { label: '救助实操指南', value: '2' },
  { label: '公益常识科普', value: '3' },
  { label: '专家直播课程', value: '4' }
])

// 难度等级选项
const tyepse = ref([
  { label: '入门', value: '1' },
  { label: '进阶', value: '2' },
  { label: '专业', value: '3' }
])

const getDifficultyType = (level) => {
  switch (String(level)) {
    case '1': return 'success'
    case '2': return 'warning'
    case '3': return 'danger'
    default: return 'info'
  }
}

const getCourseTypeColor = (type) => {
  switch (String(type)) {
    case '1': return 'primary'
    case '2': return 'success'
    case '3': return 'warning'
    case '4': return 'danger'
    default: return 'info'
  }
}

const getCourseType = (type) => {
  const courseTypeMap = {
    '1': '科学饲养宝典',
    '2': '救助实操指南',
    '3': '公益常识科普',
    '4': '专家直播课程'
  }
  return courseTypeMap[String(type)] || '未知类型'
}

const getDifficultyLevel = (level) => {
  const difficultyMap = {
    '1': '入门',
    '2': '进阶',
    '3': '专业'
  }
  return difficultyMap[String(level)] || '未知等级'
}

const getImageUrl = (url) => {
  if (!url) return ''
  // 检查是否是本地文件路径
  if (url.startsWith('D:') || url.startsWith('C:') || url.includes('\\')) {
    // 对于本地路径，使用默认图片
    return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pet%20training%20course%20cover&image_size=square`
  }
  return url
}

const goBack = () => {
  router.push('/course/index')
}

const handleCollect = () => {
  const courseId = route.params.courseId || route.query.courseId
  if (isCollected.value) {
    ElMessage.warning('您已经收藏过此课程')
    return
  }
  isCollected.value = true
  course.value.collectCount = (course.value.collectCount || 0) + 1
  ElMessage.success('收藏成功')
  updateCollectCount(courseId).catch(() => {
    // 忽略错误
  })
}

const handleShare = () => {
  ElMessage.info('分享功能开发中')
}

const loadCourseDetail = async () => {
  loading.value = true
  try {
    const courseId = route.params.courseId || route.query.courseId
    if (!courseId) {
      ElMessage.error('无效的课程ID')
      goBack()
      return
    }
    const res = await getCourse(courseId)
    course.value = res.data || res
    // 更新浏览次数（前端+后端同步）
    course.value.viewCount = (course.value.viewCount || 0) + 1
    updateViewCount(courseId).catch(() => {
      // 忽略错误
    })
  } catch (error) {
    console.error('获取课程详情失败:', error)
    ElMessage.error('获取课程详情失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCourseDetail()
})
</script>

<style scoped>
.course-detail {
  padding: 20px;
}

.course-detail-content {
  padding: 20px;
}

.course-header {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.15);
}

.course-title {
  font-size: 28px;
  font-weight: 700;
  color: #00d4ff;
  margin-bottom: 16px;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
  letter-spacing: 1px;
}

.course-info-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(124, 58, 237, 0.05) 100%);
  border-radius: 10px;
  margin-bottom: 16px;
  border: 1px solid rgba(0, 212, 255, 0.15);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-icon {
  font-size: 16px;
}

.info-label {
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
}

.info-value {
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 600;
}

.info-tag {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.info-divider {
  color: rgba(0, 212, 255, 0.3);
  font-size: 16px;
  margin: 0 4px;
}

.course-meta {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--tech-text-secondary);
  font-size: 14px;
}

.course-cover {
  width: 100%;
  max-height: 400px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.image-placeholder {
  width: 100%;
  max-height: 400px;
  border-radius: 8px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #1e2746 0%, #1a2342 100%);
  border: 2px dashed rgba(0, 212, 255, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 14px;
  gap: 10px;
  min-height: 200px;

  .el-icon {
    font-size: 48px;
    color: #64748b;
  }
}

.course-info {
  margin-bottom: 20px;
}

.course-content {
  line-height: 1.8;
  color: var(--tech-text-primary);
  padding: 20px;
  background: var(--tech-bg-light);
  border-radius: 8px;
  min-height: 200px;
}

.course-actions {
  margin-top: 30px;
  display: flex;
  gap: 15px;
}

.back-btn {
  float: right;
}
</style>
