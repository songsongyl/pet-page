<template>
  <div class="complaint-handle-page tech-page tech-grid-bg">
    <div class="tech-title">
      <span class="tech-gradient-text">投诉举报处理管理</span>
      <span class="tech-subtitle">管理投诉举报的处理状态、处理结果及反馈</span>
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
      <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="100px" class="search-form">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="投诉ID" prop="complaintId">
              <el-input v-model="queryParams.complaintId" placeholder="请输入投诉ID" clearable @keyup.enter="handleQuery"
                class="tech-input">
                <template #prefix><el-icon>
                    <Document />
                  </el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="举报人ID" prop="reportUserId">
              <el-input v-model="queryParams.reportUserId" placeholder="请输入举报人ID" clearable @keyup.enter="handleQuery"
                class="tech-input">
                <template #prefix><el-icon>
                    <User />
                  </el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="处理状态" prop="handleStatus">
              <el-select v-model="queryParams.handleStatus" placeholder="请选择处理状态" clearable class="tech-select">
                <el-option v-for="dict in dansjd" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="处理人ID" prop="handleUserId">
              <el-input v-model="queryParams.handleUserId" placeholder="请输入处理人ID" clearable @keyup.enter="handleQuery"
                class="tech-input">
                <template #prefix><el-icon>
                    <UserFilled />
                  </el-icon></template>
              </el-input>
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
              <Warning />
            </el-icon>
            投诉举报处理列表
          </span>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </div>
      </template>

      <el-table v-loading="loading" :data="complaintList" @selection-change="handleSelectionChange" class="tech-table"
        stripe>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="complaintId" width="80" />
        <el-table-column label="举报人ID" align="center" prop="reportUserId" width="100" />
        <el-table-column label="举报对象类型" align="center" prop="targetType" width="120">
          <template #default="scope">
            <el-tag :type="getTargetTypeColor(scope.row.targetType)" effect="dark" size="small">
              <dict-tag :options="tsjb" :value="scope.row.targetType" />
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="举报对象ID" align="center" prop="targetId" width="100" />
        <el-table-column label="投诉类型" align="center" prop="complaintType" width="120">
          <template #default="scope">
            <el-tag :type="getComplaintTypeColor(scope.row.complaintType)" effect="dark" size="small">
              <dict-tag :options="afds" :value="scope.row.complaintType" />
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="投诉内容" align="center" prop="complaintContent" min-width="200" show-overflow-tooltip>
          <template #default="scope">
            <div class="complaint-content" v-html="scope.row.complaintContent"></div>
          </template>
        </el-table-column>
        <el-table-column label="处理状态" align="center" prop="handleStatus" width="100">
          <template #default="scope">
            <el-tag :type="getHandleStatusColor(scope.row.handleStatus)" effect="dark" size="small">
              <dict-tag :options="dansjd" :value="scope.row.handleStatus" />
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="处理人ID" align="center" prop="handleUserId" width="100" />
        <el-table-column label="处理结果" align="center" prop="handleRemark" min-width="150" show-overflow-tooltip />
        <el-table-column label="处理时间" align="center" prop="handleTime" width="160">
          <template #default="scope">
            <span class="time-text">{{ parseTime(scope.row.handleTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120" fixed="right">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleProcess(scope.row)">处理</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <el-dialog :title="title" v-model="open" width="700px" append-to-body class="tech-dialog">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="投诉ID" prop="complaintId">
              <el-input v-model="form.complaintId" placeholder="投诉ID" disabled class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="投诉内容" prop="complaintContent">
              <el-input v-model="form.complaintContent" type="textarea" placeholder="投诉内容" disabled
                class="tech-textarea" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理状态" prop="handleStatus">
              <el-select v-model="form.handleStatus" placeholder="请选择处理状态" class="tech-select">
                <el-option v-for="dict in dansjd" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理人ID" prop="handleUserId">
              <el-input v-model="form.handleUserId" placeholder="请输入处理人ID" class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理时间" prop="handleTime">
              <el-date-picker clearable v-model="form.handleTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择处理时间" class="tech-date-picker">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="处理结果" prop="handleRemark">
              <el-input v-model="form.handleRemark" type="textarea" placeholder="请输入处理结果" class="tech-textarea" />
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

<script setup name="ComplaintHandle">
import { listComplaintReport, getComplaintReport, updateComplaintReport } from "@/api/ComplaintReport/ComplaintReport"
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import Pagination from "@/components/Pagination/index.vue"
import RightToolbar from "@/components/RightToolbar/index.vue"
import DictTag from "@/components/DictTag/index.vue"
import { parseTime } from "@/utils/ruoyi"

const { proxy } = getCurrentInstance()
const { dansjd, tsjb, afds } = proxy.useDict('dansjd', 'tsjb', 'afds')

const complaintList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {
    complaintId: null,
    complaintContent: null,
    handleStatus: null,
    handleUserId: null,
    handleTime: null,
    handleRemark: null
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    complaintId: null,
    reportUserId: null,
    handleStatus: null,
    handleUserId: null
  },
  rules: {
    handleStatus: [
      { required: true, message: "处理状态不能为空", trigger: "change" }
    ],
    handleUserId: [
      { required: true, message: "处理人ID不能为空", trigger: "blur" }
    ],
    handleTime: [
      { required: true, message: "处理时间不能为空", trigger: "blur" }
    ],
    handleRemark: [
      { required: true, message: "处理结果不能为空", trigger: "blur" }
    ]
  }
})

const { queryParams, form, rules } = toRefs(data)

function getList() {
  loading.value = true
  listComplaintReport(queryParams.value).then(response => {
    complaintList.value = response.rows
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
    complaintId: null,
    complaintContent: null,
    handleStatus: null,
    handleUserId: null,
    handleTime: null,
    handleRemark: null
  }
  proxy.resetForm("formRef")
}

function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.complaintId)
}

function handleProcess(row) {
  reset()
  getComplaintReport(row.complaintId).then(response => {
    form.value = {
      complaintId: response.data.complaintId,
      complaintContent: response.data.complaintContent,
      handleStatus: response.data.handleStatus,
      handleUserId: response.data.handleUserId,
      handleTime: response.data.handleTime,
      handleRemark: response.data.handleRemark
    }
    open.value = true
    title.value = "处理投诉举报"
  })
}

function submitForm() {
  proxy.$refs["formRef"].validate(valid => {
    if (valid) {
      updateComplaintReport(form.value).then(response => {
        proxy.$modal.msgSuccess("处理成功")
        open.value = false
        getList()
      })
    }
  })
}

function getTargetTypeColor(type) {
  const colorMap = {
    '0': 'primary',
    '1': 'success',
    '2': 'warning'
  }
  return colorMap[type] || 'info'
}

function getComplaintTypeColor(type) {
  const colorMap = {
    '0': 'danger',
    '1': 'warning',
    '2': 'info'
  }
  return colorMap[type] || 'info'
}

function getHandleStatusColor(status) {
  const colorMap = {
    '0': 'info',
    '1': 'warning',
    '2': 'success',
    '3': 'danger'
  }
  return colorMap[status] || 'info'
}

getList()
</script>

<style scoped lang="scss">
.complaint-handle-page {
  padding: 24px;
  min-height: calc(100vh - 84px);
  background: #ffffff;
}

.tech-title {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;

  .tech-gradient-text {
    font-size: 32px;
    font-weight: 700;
    color: #333333;
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

  :deep(.el-card__header) {
    background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
    border-bottom: 1px solid #e0e0e0;
    padding: 16px 20px;
  }

  :deep(.el-card__body) {
    padding: 20px;
  }

  &:hover {
    border-color: #007bff;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
  }
}

.search-card {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    background: #f8f9fa;
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
    }

    &.is-focus {
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
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
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
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
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
    }
  }

  :deep(.el-input__inner) {
    color: #333333;
    font-weight: 500;
  }
}

.tech-btn {
  background: #f8f9fa;
  border: 1px solid #ddd;
  color: #666666;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    border-color: #007bff;
    color: #007bff;
    background: rgba(0, 123, 255, 0.05);
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.15);
  }

  &.tech-btn-primary {
    background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
    border: none;
    color: #fff;

    &:hover {
      background: linear-gradient(135deg, #0069d9 0%, #550bd8 100%);
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
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
      border-bottom: 1px solid #e0e0e0;
      padding: 14px 0;
    }
  }

  :deep(.el-table__body-wrapper) {
    tr {
      background: transparent;
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

.complaint-content {
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
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  :deep(.el-dialog__header) {
    background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
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
    background: transparent;
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
      color: #94a3b8;
      font-weight: 500;
    }
  }
}

.tech-textarea {
  :deep(.el-textarea__inner) {
    background: #ffffff;
    border: 1px solid #ddd;
    color: #333333;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      border-color: #007bff;
    }

    &:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
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
    background: transparent;
    border: 1px solid rgba(0, 212, 255, 0.4);
    color: #94a3b8;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      border-color: #00d4ff;
      color: #00d4ff;
      background: rgba(0, 212, 255, 0.1);
    }
  }
}

:deep(.el-form-item__label) {
  color: #94a3b8;
}

:deep(.el-select-dropdown) {
  background: rgba(17, 25, 54, 0.95);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);

  .el-select-dropdown__item {
    color: #94a3b8;
    padding: 10px 16px;
    font-weight: 500;

    &:hover,
    &.selected {
      background: rgba(0, 212, 255, 0.15);
      color: #00d4ff;
    }

    &.selected {
      font-weight: 600;
    }
  }
}
</style>