<template>
  <div class="course-page tech-page tech-grid-bg">
    <div class="tech-title">
      <span class="tech-gradient-text">知识课堂</span>
      <span class="tech-subtitle">宠物知识学习与智能问答</span>
    </div>

    <div class="quick-entry-cards">
      <div class="entry-card ai-assistant-card" @click="goToAIChat">
        <div class="entry-icon">🐾</div>
        <div class="entry-content">
          <h4>宠物智能助手</h4>
          <p>AI智能问答，解答您的养宠疑惑</p>
        </div>
        <div class="entry-arrow">
          <el-icon>
            <ArrowRight />
          </el-icon>
        </div>
      </div>
    </div>

    <el-card shadow="hover" class="tech-card search-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon">
              <Search />
            </el-icon>
            搜索条件
          </span>
        </div>
      </template>
      <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="90px" class="search-form">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="课程标题" prop="courseTitle">
              <el-input v-model="queryParams.courseTitle" placeholder="请输入课程标题" clearable @keyup.enter="handleQuery"
                class="tech-input">
                <template #prefix><el-icon>
                    <Reading />
                  </el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="课程类型" prop="courseType">
              <el-select v-model="queryParams.courseType" placeholder="请选择课程类型" clearable class="tech-select">
                <el-option v-for="dict in courese" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="难度等级" prop="difficultyLevel">
              <el-select v-model="queryParams.difficultyLevel" placeholder="请选择难度等级" clearable class="tech-select">
                <el-option v-for="dict in tyepse" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="讲师名称" prop="teacherName">
              <el-input v-model="queryParams.teacherName" placeholder="请输入讲师名称" clearable @keyup.enter="handleQuery"
                class="tech-input">
                <template #prefix><el-icon>
                    <User />
                  </el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="发布时间" prop="publishTime">
              <el-date-picker clearable v-model="queryParams.publishTime" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择发布时间" class="tech-date-picker">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="16" :lg="12">
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery"
                class="tech-btn tech-btn-primary">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery" class="tech-btn">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="hover" class="tech-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon">
              <Collection />
            </el-icon>
            课程列表
          </span>
          <div class="header-actions">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['course:course:add']"
              class="tech-btn tech-btn-primary">新增课程</el-button>
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
              v-hasPermi="['course:course:edit']" class="tech-btn tech-btn-success">修改</el-button>
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
              v-hasPermi="['course:course:remove']" class="tech-btn tech-btn-danger">删除</el-button>
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['course:course:export']"
              class="tech-btn tech-btn-warning">导出</el-button>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" :data="courseList" @selection-change="handleSelectionChange" class="tech-table"
        stripe>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="课程ID" align="center" prop="courseId" width="80" />
        <el-table-column label="封面" align="center" width="100">
          <template #default="scope">
            <el-image v-if="scope.row.courseCover" :src="getImageUrl(scope.row.courseCover)"
              :preview-src-list="[getImageUrl(scope.row.courseCover)]" fit="cover" class="course-cover">
              <template #error>
                <div class="image-placeholder">
                  <el-icon>
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
            <div v-else class="image-placeholder">
              <el-icon>
                <Picture />
              </el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="课程标题" align="center" prop="courseTitle" min-width="150" show-overflow-tooltip />
        <el-table-column label="课程类型" align="center" prop="courseType" width="100">
          <template #default="scope">
            <dict-tag :options="courese" :value="scope.row.courseType" />
          </template>
        </el-table-column>
        <el-table-column label="难度等级" align="center" prop="difficultyLevel" width="100">
          <template #default="scope">
            <el-tag :type="getDifficultyType(scope.row.difficultyLevel)" effect="dark" size="small"
              class="difficulty-tag">
              {{ getDifficultyLevel(scope.row.difficultyLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="讲师名称" align="center" prop="teacherName" width="120" />
        <el-table-column label="查看次数" align="center" prop="viewCount" width="100">
          <template #default="scope">
            <span class="stat-number">
              <el-icon>
                <View />
              </el-icon>
              {{ scope.row.viewCount || 0 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="收藏次数" align="center" prop="collectCount" width="100">
          <template #default="scope">
            <span class="stat-number collect">
              <el-icon>
                <Star />
              </el-icon>
              {{ scope.row.collectCount || 0 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" align="center" prop="publishTime" width="160">
          <template #default="scope">
            <span class="time-text">{{ parseTime(scope.row.publishTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" fixed="right">
          <template #default="scope">
            <el-button link type="primary" icon="View" @click="handleView(scope.row)">查看</el-button>
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['course:course:edit']">修改</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)"
              v-hasPermi="['course:course:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <el-dialog :title="title" v-model="open" width="700px" append-to-body class="tech-dialog">
      <el-form ref="courseRef" :model="form" :rules="rules" label-width="100px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="课程标题" prop="courseTitle">
              <el-input v-model="form.courseTitle" placeholder="请输入课程标题" class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程类型" prop="courseType">
              <el-select v-model="form.courseType" placeholder="请选择课程类型" class="tech-select">
                <el-option v-for="dict in courese" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="难度等级" prop="difficultyLevel">
              <el-select v-model="form.difficultyLevel" placeholder="请选择难度等级" class="tech-select">
                <el-option v-for="dict in tyepse" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="封面图片" prop="courseCover">
              <el-upload class="avatar-uploader" action="#" :auto-upload="false" :show-file-list="false"
                accept="image/*" :on-change="handleCoverUpload">
                <div v-if="form.courseCover" class="media-preview">
                  <el-image :src="form.courseCover" fit="cover" class="uploaded-image" />
                  <div class="media-overlay">
                    <el-icon>
                      <Refresh />
                    </el-icon>
                    <span>更换</span>
                  </div>
                </div>
                <div v-else class="upload-placeholder">
                  <el-icon class="upload-icon">
                    <Plus />
                  </el-icon>
                  <span>上传封面图片</span>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="课程内容" prop="courseContent">
              <editor v-model="form.courseContent" :min-height="192" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="讲师名称" prop="teacherName">
              <el-input v-model="form.teacherName" placeholder="请输入讲师名称" class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="查看次数" prop="viewCount">
              <el-input v-model="form.viewCount" placeholder="请输入查看次数" class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收藏次数" prop="collectCount">
              <el-input v-model="form.collectCount" placeholder="请输入收藏次数" class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布人" prop="publishUserId">
              <el-input v-model="form.publishUserId" placeholder="请输入发布人" class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布时间" prop="publishTime">
              <el-date-picker clearable v-model="form.publishTime" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择发布时间" class="tech-date-picker">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="讲师简介" prop="teacherDesc">
              <el-input v-model="form.teacherDesc" type="textarea" placeholder="请输入内容" class="tech-textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm" class="tech-btn tech-btn-primary">确 定</el-button>
          <el-button @click="cancel" class="tech-btn cancel-btn">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Course">
import { listCourse, getCourse, delCourse, addCourse, updateCourse } from "@/api/course/course"
import { useRouter, onBeforeRouteUpdate } from 'vue-router'
import { onActivated } from 'vue'
import useUserStore from "@/store/modules/user"
import { useDict } from "@/utils/dict"
import { ref, reactive, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, RefreshRight, Plus, Edit, Delete, Download, Reading, User, Collection, ArrowRight, Picture, Refresh } from '@element-plus/icons-vue'
import DictTag from "@/components/DictTag/index.vue"
import Editor from "@/components/Editor/index.vue"
import Pagination from "@/components/Pagination/index.vue"
import RightToolbar from "@/components/RightToolbar/index.vue"

const router = useRouter()

// 组件被激活时刷新列表数据（keep-alive缓存时使用）
onActivated(() => {
  getList()
})

// 监听路由变化，从详情页返回时刷新列表
onBeforeRouteUpdate(() => {
  getList()
})

const goToAIChat = () => {
  router.push('/ai/chat')
}

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

const courseList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const courseRef = ref()

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    courseTitle: null,
    courseType: null,
    difficultyLevel: null,
    courseCover: null,
    courseContent: null,
    teacherName: null,
    teacherDesc: null,
    viewCount: null,
    collectCount: null,
    publishStatus: null,
    publishUserId: null,
    publishTime: null,
    isDeleted: null
  },
  rules: {
    courseTitle: [
      { required: true, message: "课程标题不能为空", trigger: "blur" }
    ],
    courseType: [
      { required: true, message: "课程类型不能为空", trigger: "change" }
    ],
    courseContent: [
      { required: true, message: "课程内容不能为空", trigger: "blur" }
    ],
    publishUserId: [
      { required: true, message: "发布人不能为空", trigger: "blur" }
    ]
  }
})

const { queryParams, form, rules } = toRefs(data)

function getList() {
  loading.value = true
  listCourse(queryParams.value).then(response => {
    courseList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

function cancel() {
  open.value = false
  reset()
}

function reset() {
  form.value = {
    courseId: null,
    courseTitle: null,
    courseType: null,
    difficultyLevel: null,
    courseCover: null,
    courseContent: null,
    teacherName: null,
    teacherDesc: null,
    viewCount: null,
    collectCount: null,
    publishStatus: null,
    publishUserId: null,
    publishTime: null,
    createTime: null,
    updateTime: null,
    isDeleted: null
  }
}

function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

function resetQuery() {
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
    courseTitle: null,
    courseType: null,
    difficultyLevel: null,
    courseCover: null,
    courseContent: null,
    teacherName: null,
    teacherDesc: null,
    viewCount: null,
    collectCount: null,
    publishStatus: null,
    publishUserId: null,
    publishTime: null,
    isDeleted: null
  }
  handleQuery()
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.courseId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

function handleAdd() {
  reset()
  const userStore = useUserStore()
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  form.value.viewCount = 0
  form.value.collectCount = 0
  form.value.publishTime = `${year}-${month}-${day}`
  form.value.publishUserId = userStore.id
  open.value = true
  title.value = "添加知识课堂"
}

function handleView(row) {
  const courseId = row.courseId || row.id
  if (courseId) {
    router.push('/course/detail/' + courseId)
  } else {
    ElMessage.error('无效的课程ID')
  }
}

function handleUpdate(row) {
  reset()
  const _courseId = row.courseId || ids.value
  getCourse(_courseId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改知识课堂"
  })
}

function submitForm() {
  if (!courseRef.value) return
  courseRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (form.value.courseId != null) {
          await updateCourse(form.value)
          ElMessage.success("修改成功")
        } else {
          await addCourse(form.value)
          ElMessage.success("新增成功")
        }
        open.value = false
        getList()
      } catch (error) {
        ElMessage.error('操作失败，请重试')
      }
    }
  })
}

function handleDelete(row) {
  const _courseIds = row.courseId || ids.value
  ElMessageBox.confirm('是否确认删除知识课堂编号为"' + _courseIds + '"的数据项？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(function () {
    return delCourse(_courseIds)
  }).then(() => {
    getList()
    ElMessage.success("删除成功")
  }).catch(() => { })
}

function handleExport() {
  const url = '/course/course/export?' + new URLSearchParams(queryParams.value).toString()
  window.open(url, '_blank')
}

// 封面图片上传处理（本地预览）
function handleCoverUpload(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.courseCover = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

function getDifficultyType(level) {
  const typeMap = {
    '0': 'success',
    '1': 'warning',
    '2': 'danger'
  }
  return typeMap[level] || 'info'
}

function getDifficultyLevel(level) {
  const difficultyMap = {
    '1': '入门',
    '2': '进阶',
    '3': '专业'
  }
  return difficultyMap[level] || '未知等级'
}

function getImageUrl(url) {
  if (!url) return ''
  // 检查是否是本地文件路径
  if (url.startsWith('D:') || url.startsWith('C:') || url.includes('\\')) {
    // 对于本地路径，使用默认图片
    return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pet%20training%20course%20cover&image_size=square`
  }
  return url
}

getList()
</script>

<style scoped lang="scss">
.course-page {
  padding: 24px;
  min-height: calc(100vh - 84px);
  background: #ffffff;
}

.tech-title {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  .tech-gradient-text {
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: block;
    margin-bottom: 8px;
  }

  .tech-subtitle {
    font-size: 14px;
    color: #666666;
    font-weight: 400;
  }
}

.quick-entry-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
}

.entry-card {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #ff9a56 0%, #ff6b95 100%);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(255, 107, 149, 0.3);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(255, 107, 149, 0.4);
  }
}

.ai-assistant-card {
  flex: 1;
}

.entry-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-right: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.entry-content {
  flex: 1;

  h4 {
    margin: 0 0 6px 0;
    font-size: 18px;
    font-weight: 600;
    color: #333333;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #666666;
  }
}

.entry-arrow {
  width: 36px;
  height: 36px;
  background: rgba(0, 123, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #007bff;
  font-size: 18px;
  transition: all 0.3s ease;

  .entry-card:hover & {
    background: rgba(0, 123, 255, 0.2);
    transform: translateX(4px);
  }
}

.tech-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #007bff, #6610f2);
    opacity: 0.9;
  }

  :deep(.el-card__header) {
    background: linear-gradient(90deg, rgba(0, 123, 255, 0.05) 0%, rgba(102, 16, 242, 0.05) 100%);
    border-bottom: 1px solid #e0e0e0;
    padding: 16px 20px;
  }

  :deep(.el-card__body) {
    padding: 20px;
    background: #ffffff;
  }

  &:hover {
    border-color: #007bff;
    box-shadow: 0 4px 16px rgba(0, 123, 255, 0.15);
  }
}

.search-card {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    // background: rgba(30, 39, 70, 0.3);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #333333;

  .title-icon {
    color: #007bff;
    font-size: 20px;
  }
}

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.search-form {
  .el-form-item {
    margin-bottom: 18px;

    :deep(.el-form-item__label) {
      color: #666666;
      font-weight: 500;
    }
  }
}

.tech-input {
  :deep(.el-input__wrapper) {
    background: #ffffff;
    border: 1px solid #ddd;
    box-shadow: none;
    transition: all 0.3s ease;

    &:hover {
      border-color: #007bff;
      box-shadow: 0 0 8px rgba(0, 123, 255, 0.1);
    }

    &.is-focus {
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15), 0 0 12px rgba(0, 123, 255, 0.2);
    }
  }

  :deep(.el-input__inner) {
    color: #333333;
    font-weight: 500;

    &::placeholder {
      color: #999999;
    }
  }

  :deep(.el-input__prefix) {
    color: #007bff;
  }
}

.tech-select {
  width: 100%;

  :deep(.el-input__wrapper) {
    background: #ffffff;
    border: 1px solid #ddd;
    box-shadow: none;
    transition: all 0.3s ease;

    &:hover {
      border-color: #007bff;
    }

    &.is-focus {
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15), 0 0 12px rgba(0, 123, 255, 0.2);
    }
  }

  :deep(.el-input__inner) {
    color: #333333;
    font-weight: 500;
  }
}

.tech-date-picker {
  width: 100%;

  :deep(.el-input__wrapper) {
    background: #ffffff;
    border: 1px solid #ddd;
    box-shadow: none;
    transition: all 0.3s ease;

    &:hover {
      border-color: #007bff;
    }

    &.is-focus {
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15), 0 0 12px rgba(0, 123, 255, 0.2);
    }
  }

  :deep(.el-input__inner) {
    color: #333333;
    font-weight: 500;
  }
}

.tech-btn {
  background: #ffffff;
  border: 1px solid #ddd;
  color: #666666;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    border-color: #007bff;
    color: #007bff;
    background: rgba(0, 123, 255, 0.05);
    box-shadow: 0 0 12px rgba(0, 123, 255, 0.2);
  }

  &.tech-btn-primary {
    background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
    border: none;
    color: #fff;

    &:hover {
      background: linear-gradient(135deg, #0069d9 0%, #5510e0 100%);
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
    }
  }

  &.tech-btn-success {
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    border: none;
    color: #fff;

    &:hover {
      background: linear-gradient(135deg, #218838 0%, #17a689 100%);
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
    }
  }

  &.tech-btn-danger {
    background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
    border: none;
    color: #fff;

    &:hover {
      background: linear-gradient(135deg, #c82333 0%, #e67700 100%);
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
    }
  }

  &.tech-btn-warning {
    background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
    border: none;
    color: #fff;

    &:hover {
      background: linear-gradient(135deg, #e0a800 0%, #e67700 100%);
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
    }
  }
}

.tech-table {
  :deep(.el-table__header-wrapper) {
    background: transparent;

    th {
      background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
      color: #333333;
      font-weight: 600;
      font-size: 13px;
      border-bottom: 1px solid #dee2e6;
      padding: 14px 0;
    }
  }

  :deep(.el-table__body-wrapper) {
    tr {
      background: #ffffff;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(0, 123, 255, 0.05) !important;
      }

      td {
        border-bottom: 1px solid #e9ecef;
        color: #333333;
        padding: 12px 0;
        font-size: 13px;
      }
    }
  }

  :deep(.el-checkbox__inner) {
    background: #ffffff;
    border-color: #ddd;

    &:hover {
      border-color: #007bff;
    }
  }
}

.course-cover {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  border: 2px solid rgba(0, 212, 255, 0.4);
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 212, 255, 0.15);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 212, 255, 0.25);
  }
}

.image-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  border: 2px dashed #ddd;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999999;
  margin: 0 auto;
  transition: all 0.3s ease;

  &:hover {
    border-color: #007bff;
    color: #007bff;
  }
}

.stat-number {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #666666;
  font-weight: 500;

  .el-icon {
    font-size: 14px;
  }

  &.collect {
    color: #ffc107;

    .el-icon {
      color: #ffc107;
      filter: drop-shadow(0 0 4px rgba(255, 193, 7, 0.4));
    }
  }
}

.time-text {
  color: #999999;
  font-size: 12px;
  font-family: 'Courier New', monospace;
}

.tech-dialog {
  :deep(.el-dialog) {
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  :deep(.el-dialog__header) {
    background: linear-gradient(90deg, rgba(0, 123, 255, 0.05) 0%, rgba(102, 16, 242, 0.05) 100%);
    border-bottom: 1px solid #e0e0e0;
    padding: 16px 20px;
    margin-right: 0;

    .el-dialog__title {
      color: #333333;
      font-weight: 600;
      font-size: 18px;
    }
  }

  :deep(.el-dialog__body) {
    background: #ffffff;
    padding: 20px;
  }

  :deep(.el-dialog__footer) {
    background: #f8f9fa;
    border-top: 1px solid #e0e0e0;
    padding: 16px 20px;
  }
}

.dialog-form {
  .el-form-item {
    margin-bottom: 18px;

    :deep(.el-form-item__label) {
      color: #666666;
      font-weight: 500;
    }
  }
}

.tech-textarea {
  :deep(.el-textarea__inner) {
    background: #ffffff;
    border: 1px solid #ddd;
    color: #333333;
    transition: all 0.3s ease;

    &:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15), 0 0 12px rgba(0, 123, 255, 0.2);
    }

    &::placeholder {
      color: #999999;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  .cancel-btn {
    background: #ffffff;
    border: 1px solid #ddd;
    color: #666666;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      border-color: #007bff;
      color: #007bff;
      background: rgba(0, 123, 255, 0.05);
    }
  }
}

:deep(.el-form-item__label) {
  color: #666666;
}

:deep(.el-select-dropdown) {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  .el-select-dropdown__item {
    color: #333333;

    &:hover,
    &.selected {
      background: rgba(0, 123, 255, 0.1);
      color: #007bff;
    }
  }
}

/* 上传组件样式 */
.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed #ddd;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background: #f8f9fa;
    transition: all 0.3s ease;

    &:hover {
      border-color: #007bff;
      background: rgba(0, 123, 255, 0.05);
    }
  }

  :deep(.el-upload-dragger) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 320px;
    height: 180px;
    flex-direction: column;
    gap: 12px;
  }
}

.media-preview {
  position: relative;
  width: 320px;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;

  .uploaded-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .media-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    cursor: pointer;
    gap: 5px;

    &:hover {
      opacity: 1;
    }

    .el-icon {
      color: #fff;
      font-size: 24px;
    }

    span {
      color: #fff;
      font-size: 14px;
    }
  }
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 320px;
  height: 180px;
  gap: 12px;
  background: #f8f9fa;
  border: 2px dashed #ddd;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #007bff;
    background: rgba(0, 123, 255, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);
  }

  .upload-icon {
    color: #007bff;
    font-size: 48px;
    filter: drop-shadow(0 0 10px rgba(0, 123, 255, 0.3));
  }

  span {
    color: #666666;
    font-size: 16px;
    font-weight: 500;
  }
}

:deep(.el-picker-panel) {
  background: #ffffff;
  border: 1px solid #e0e0e0;

  .el-date-picker__header-label,
  .el-date-table th,
  .el-date-table td span {
    color: #333333;
  }

  .el-date-table td.current:not(.disabled) span {
    background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
    color: #fff;
  }

  .el-date-table td.today span {
    color: #007bff;
  }

  .el-picker-panel__icon-btn {
    color: #666666;

    &:hover {
      color: #007bff;
    }
  }
}

.difficulty-tag {
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 11px;
  padding: 2px 8px;
}
</style>
