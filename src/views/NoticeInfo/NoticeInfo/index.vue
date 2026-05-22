<template>
  <div class="notice-page tech-page tech-grid-bg">
    <div class="tech-title">
      <span class="tech-gradient-text">公告信息管理</span>
      <span class="tech-subtitle">管理系统公告、通知信息及发布状态</span>
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
            <el-form-item label="公告标题" prop="noticeTitle">
              <el-input v-model="queryParams.noticeTitle" placeholder="请输入公告标题" clearable @keyup.enter="handleQuery"
                class="tech-input">
                <template #prefix><el-icon>
                    <Document />
                  </el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="公告类型" prop="noticeType">
              <el-select v-model="queryParams.noticeType" placeholder="请选择公告类型" clearable class="tech-select">
                <el-option v-for="dict in gglx" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="发布人ID" prop="publishUserId">
              <el-input v-model="queryParams.publishUserId" placeholder="请输入发布人ID" clearable @keyup.enter="handleQuery"
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
              <Bell />
            </el-icon>
            公告列表
          </span>
          <div class="header-actions">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['NoticeInfo:NoticeInfo:add']"
              class="tech-btn tech-btn-primary">新增公告</el-button>
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
              v-hasPermi="['NoticeInfo:NoticeInfo:edit']" class="tech-btn tech-btn-success">修改</el-button>
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
              v-hasPermi="['NoticeInfo:NoticeInfo:remove']" class="tech-btn tech-btn-danger">删除</el-button>
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['NoticeInfo:NoticeInfo:export']" class="tech-btn tech-btn-warning">导出</el-button>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" :data="NoticeInfoList" @selection-change="handleSelectionChange" class="tech-table"
        stripe>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="noticeId" width="80" />
        <el-table-column label="公告标题" align="center" prop="noticeTitle" min-width="150" />
        <el-table-column label="公告类型" align="center" prop="noticeType" width="100">
          <template #default="scope">
            <el-tag :type="getNoticeTypeColor(scope.row.noticeType)" effect="dark" size="small">
              <dict-tag :options="gglx" :value="scope.row.noticeType" />
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="公告内容" align="center" prop="noticeContent" min-width="200">
          <template #default="scope">
            <div class="notice-content" v-html="scope.row.noticeContent"></div>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" align="center" prop="publishTime" width="160">
          <template #default="scope">
            <span class="time-text">{{ parseTime(scope.row.publishTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
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
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="240" fixed="right">
          <template #default="scope">
            <el-button link type="primary" icon="View" @click="handleView(scope.row)">查看</el-button>
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['NoticeInfo:NoticeInfo:edit']">修改</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)"
              v-hasPermi="['NoticeInfo:NoticeInfo:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <el-dialog :title="title" v-model="open" width="700px" append-to-body class="tech-dialog">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="公告标题" prop="noticeTitle">
              <el-input v-model="form.noticeTitle" placeholder="请输入公告标题" class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公告类型" prop="noticeType">
              <el-select v-model="form.noticeType" placeholder="请选择公告类型" class="tech-select">
                <el-option v-for="dict in gglx" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="公告内容" prop="noticeContent">
              <editor v-model="form.noticeContent" :min-height="192" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布人ID" prop="publishUserId">
              <el-input v-model="form.publishUserId" readonly placeholder="系统自动填充" class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="查看次数" prop="viewCount">
              <el-input v-model="form.viewCount" readonly placeholder="系统自动填充" class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布时间" prop="publishTime">
              <el-date-picker clearable v-model="form.publishTime" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择发布时间" class="tech-date-picker">
              </el-date-picker>
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

    <!-- 公告详情弹窗 -->
    <el-dialog title="公告详情" v-model="detailOpen" width="800px" append-to-body class="detail-dialog"
      :close-on-click-modal="false">
      <div class="detail-content">
        <div class="detail-header">
          <h2 class="detail-title">{{ detailData.noticeTitle }}</h2>
          <div class="detail-meta">
            <span class="meta-item">
              <el-tag :type="getNoticeTypeColor(detailData.noticeType)" size="small">
                {{ getNoticeTypeText(detailData.noticeType) }}
              </el-tag>
            </span>
            <span class="meta-divider"></span>
            <span class="meta-item">
              <el-icon class="meta-icon">
                <Calendar />
              </el-icon>
              {{ detailData.publishTime }}
            </span>
            <span class="meta-divider"></span>
            <span class="meta-item">
              <el-icon class="meta-icon">
                <Eye />
              </el-icon>
              {{ detailData.viewCount }} 次浏览
            </span>
          </div>
        </div>

        <div class="detail-body">
          <div class="content-section">
            <h3 class="section-label">公告内容</h3>
            <div class="content-body" v-html="detailData.noticeContent"></div>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">发布人ID</span>
              <span class="info-value">{{ detailData.publishUserId || '系统' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">创建时间</span>
              <span class="info-value">{{ detailData.createTime || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">更新时间</span>
              <span class="info-value">{{ detailData.updateTime || '-' }}</span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="detailOpen = false" class="tech-btn tech-btn-primary">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="NoticeInfo">
import { listNoticeInfo, getNoticeInfo, delNoticeInfo, addNoticeInfo, updateNoticeInfo, updateNoticeViewCount } from "@/api/NoticeInfo/NoticeInfo"
import useUserStore from "@/store/modules/user"
import { useDict } from "@/utils/dict"
import { ref, reactive, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Calendar, View } from '@element-plus/icons-vue'
import { parseTime } from "@/utils/ruoyi"
import DictTag from "@/components/DictTag/index.vue"
import Editor from "@/components/Editor/index.vue"
import Pagination from "@/components/Pagination/index.vue"
import RightToolbar from "@/components/RightToolbar/index.vue"

const { ljsc, mbyhlx, gglx } = useDict('ljsc', 'mbyhlx', 'gglx')

const NoticeInfoList = ref([])
const open = ref(false)
const detailOpen = ref(false)
const detailData = ref({})
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const formRef = ref()

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    noticeTitle: null,
    noticeType: null,
    noticeContent: null,
    targetUserType: null,
    publishTime: null,
    viewCount: null,
    isDeleted: null
  },
  rules: {
    noticeTitle: [
      { required: true, message: "公告标题不能为空", trigger: "blur" }
    ],
    noticeType: [
      { required: true, message: "公告类型不能为空", trigger: "change" }
    ],
    noticeContent: [
      { required: true, message: "公告内容不能为空", trigger: "blur" }
    ],

    publishTime: [
      { required: true, message: "发布时间不能为空", trigger: "blur" }
    ],
    createTime: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ],
    updateTime: [
      { required: true, message: "更新时间不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

function getList() {
  loading.value = true
  listNoticeInfo(queryParams.value).then(response => {
    NoticeInfoList.value = response.rows
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
    noticeId: null,
    noticeTitle: null,
    noticeType: null,
    noticeContent: null,
    targetUserType: null,
    publishTime: null,
    viewCount: null,
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
    noticeTitle: null,
    noticeType: null,
    noticeContent: null,
    targetUserType: null,
    publishTime: null,
    viewCount: null,
    isDeleted: null
  }
  handleQuery()
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.noticeId)
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
  form.value.publishTime = `${year}-${month}-${day}`
  form.value.publishUserId = userStore.id
  form.value.viewCount = 0
  open.value = true
  title.value = "添加公告信息"
}

function handleUpdate(row) {
  reset()
  const _noticeId = row.noticeId || ids.value
  getNoticeInfo(_noticeId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改公告信息"
  })
}

function handleView(row) {
  const noticeId = row.noticeId || ids.value
  getNoticeInfo(noticeId).then(response => {
    const notice = response.data
    // 更新浏览次数（前端+后端同步）
    notice.viewCount = (notice.viewCount || 0) + 1
    updateNoticeViewCount(noticeId).catch(() => {
      // 忽略错误
    })
    // 设置详情数据并显示弹窗
    detailData.value = notice
    detailOpen.value = true
    // 刷新列表以更新浏览次数
    getList()
  })
}

function getNoticeTypeText(type) {
  const typeMap = {
    '1': '通知',
    '2': '公告'
  }
  return typeMap[String(type)] || '未知'
}

function submitForm() {
  if (!formRef.value) return
  formRef.value.validate(valid => {
    if (valid) {
      if (form.value.noticeId != null) {
        updateNoticeInfo(form.value).then(response => {
          ElMessage.success("修改成功")
          open.value = false
          getList()
        }).catch(error => {
          ElMessage.error("修改失败")
        })
      } else {
        addNoticeInfo(form.value).then(response => {
          ElMessage.success("新增成功")
          open.value = false
          getList()
        }).catch(error => {
          ElMessage.error("新增失败")
        })
      }
    }
  })
}

function handleDelete(row) {
  const _noticeIds = row.noticeId || ids.value
  ElMessageBox.confirm('是否确认删除公告信息编号为"' + _noticeIds + '"的数据项？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(function () {
    return delNoticeInfo(_noticeIds)
  }).then(() => {
    getList()
    ElMessage.success("删除成功")
  }).catch(() => { })
}

function handleExport() {
  const url = '/NoticeInfo/NoticeInfo/export?' + new URLSearchParams(queryParams.value).toString()
  window.open(url, '_blank')
}

function getNoticeTypeColor(type) {
  const colorMap = {
    '0': 'primary',
    '1': 'success',
    '2': 'warning',
    '3': 'danger'
  }
  return colorMap[type] || 'info'
}

getList()
</script>

<style scoped lang="scss">
.notice-page {
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
    box-shadow: 0 4px 20px rgba(0, 123, 255, 0.15);
  }
}

.search-card {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    background: #ffffff;
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
    border: 1px solid #dcdfe6;
    box-shadow: none;
    transition: all 0.3s ease;

    &:hover {
      border-color: #c0c4cc;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    }

    &.is-focus {
      border-color: #409eff;
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }
  }

  :deep(.el-input__inner) {
    color: #303133;
    font-weight: 500;

    &::placeholder {
      color: #c0c4cc;
    }
  }

  :deep(.el-input__prefix) {
    color: #409eff;
  }
}

.tech-select {
  width: 100%;

  :deep(.el-input__wrapper) {
    background: #ffffff;
    border: 1px solid #dcdfe6;
    box-shadow: none;
    transition: all 0.3s ease;

    &:hover {
      border-color: #c0c4cc;
    }

    &.is-focus {
      border-color: #409eff;
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }
  }

  :deep(.el-input__inner) {
    color: #303133;
    font-weight: 500;
  }
}

.tech-date-picker {
  width: 100%;

  :deep(.el-input__wrapper) {
    background: #ffffff;
    border: 1px solid #dcdfe6;
    box-shadow: none;
    transition: all 0.3s ease;

    &:hover {
      border-color: #c0c4cc;
    }

    &.is-focus {
      border-color: #409eff;
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }
  }

  :deep(.el-input__inner) {
    color: #303133;
    font-weight: 500;
  }
}

.tech-btn {
  background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
  border: none;
  color: #fff;
  font-weight: 500;
  padding: 9px 20px;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #0069d9 0%, #5510e0 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
  }

  &.tech-btn-success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);

    &:hover {
      background: linear-gradient(135deg, #0ea58e 0%, #047857 100%);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    }
  }

  &.tech-btn-danger {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);

    &:hover {
      background: linear-gradient(135deg, #e04444 0%, #c92626 100%);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
    }
  }

  &.tech-btn-warning {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);

    &:hover {
      background: linear-gradient(135deg, #e0940b 0%, #c76d06 100%);
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
    }
  }
}

.tech-table {
  background: transparent;

  :deep(.el-table__header) {
    th {
      background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
      color: #333333;
      font-weight: 600;
      font-size: 13px;
      border-bottom: 1px solid #dee2e6;
      padding: 14px 0;
    }
  }

  :deep(.el-table__body) {
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

  :deep(.el-table__empty-block) {
    background: #ffffff;
  }

  :deep(.el-checkbox__inner) {
    background: #ffffff;
    border-color: #ddd;

    &:hover {
      border-color: #007bff;
    }
  }
}

.notice-content {
  color: #666666;
  font-size: 12px;
  line-height: 1.6;
  max-height: 60px;
  overflow: hidden;

  :deep(p) {
    margin: 0;
  }

  :deep(*) {
    color: #666666 !important;
  }
}

.stat-number {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #007bff;
  font-weight: 600;

  .el-icon {
    font-size: 14px;
    color: #007bff;
  }
}

.time-text {
  color: #666666;
  font-size: 12px;
  font-family: 'Courier New', monospace;
}

.tech-dialog {
  :deep(.el-dialog) {
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
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
    background: #f5f7fa;
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
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

  .el-select-dropdown__item {
    color: #666666;
    padding: 10px 16px;
    font-weight: 500;

    &:hover,
    &.selected {
      background: rgba(0, 123, 255, 0.08);
      color: #007bff;
    }

    &.selected {
      font-weight: 600;
    }
  }
}

:deep(.el-radio-group) {
  .el-radio {
    color: #666666;

    .el-radio__input.is-checked .el-radio__inner {
      background-color: #409eff;
      border-color: #409eff;
      box-shadow: 0 0 8px rgba(64, 158, 255, 0.4);
    }

    .el-radio__label {
      color: #333333;
      font-weight: 500;
    }
  }
}

/* 详情弹窗样式 - 使用浅色主题 */
.detail-dialog {
  :deep(.el-dialog) {
    background: #ffffff;
    border: 1px solid #e4e7ed;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  }

  :deep(.el-dialog__header) {
    background: linear-gradient(90deg, #f5f7fa 0%, #e4e7ed 100%);
    border-bottom: 1px solid #dcdfe6;
    padding: 20px 24px;
  }

  :deep(.el-dialog__title) {
    font-size: 20px;
    font-weight: 600;
    color: #303133;
  }

  :deep(.el-dialog__body) {
    padding: 0;
  }

  :deep(.el-dialog__footer) {
    background: #f5f7fa;
    border-top: 1px solid #e4e7ed;
    padding: 16px 24px;
  }
}

.detail-content {
  padding: 24px;
  background: #ffffff;
}

.detail-header {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e4e7ed;
}

.detail-title {
  font-size: 26px;
  font-weight: 700;
  color: #303133;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.detail-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #606266;
  font-size: 14px;
}

.meta-icon {
  font-size: 14px;
  color: #409eff;
}

.meta-divider {
  width: 1px;
  height: 16px;
  background: #dcdfe6;
}

.detail-body {
  min-height: 200px;
}

.content-section {
  margin-bottom: 24px;
}

.section-label {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    width: 4px;
    height: 18px;
    background: linear-gradient(180deg, #409eff 0%, #67c23a 100%);
    border-radius: 2px;
  }
}

.content-body {
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  color: #000000;
  line-height: 1.8;
  font-size: 15px;
  min-height: 150px;

  :deep(p) {
    margin: 0 0 12px 0;
    color: #000000;

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(span) {
    color: #000000;
  }

  :deep(div) {
    color: #000000;
  }

  :deep(strong) {
    color: #303133;
    font-weight: 600;
  }

  :deep(ul),
  :deep(ol) {
    margin: 12px 0;
    padding-left: 24px;
    color: #000000;
  }

  :deep(li) {
    margin-bottom: 8px;
    color: #000000;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.info-item {
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.info-label {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info-value {
  display: block;
  font-size: 14px;
  color: #303133;
  font-weight: 600;
}
</style>