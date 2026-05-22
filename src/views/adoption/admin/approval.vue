<template>
  <div class="adoption-admin-approval">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>领养申请审批</span>
          <el-button type="primary" @click="handleBatchApprove" :disabled="!selectedRows.length">
            批量审批
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="queryParams" class="mb-4">
        <el-form-item label="申请状态">
          <el-select v-model="queryParams.applyStatus" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="待审核" value="0" />
            <el-option label="审核通过" value="1" />
            <el-option label="审核驳回" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请人">
          <el-input v-model="queryParams.applicantName" placeholder="请输入申请人姓名" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="applicationId" label="申请编号" width="100" />
        <el-table-column prop="applicantName" label="申请人" width="120" />
        <el-table-column prop="contactPhone" label="联系电话" width="150" />
        <el-table-column label="住房类型" width="100">
          <template #default="scope">
            {{ getHousingTypeText(scope.row.housingType) }}
          </template>
        </el-table-column>
        <el-table-column prop="applyStatus" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.applyStatus)">{{ getStatusText(scope.row.applyStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="申请时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button size="small" type="primary" @click="handleApprove(scope.row)"
              v-if="scope.row.applyStatus === 0">审批</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px" />
    </el-card>

    <!-- 审批对话框 -->
    <el-dialog v-model="approveDialogVisible" title="审批领养申请" width="500px">
      <el-form :model="approveForm" :rules="approveRules" ref="approveFormRef" label-width="100px">
        <el-form-item label="审批结果" prop="result">
          <el-radio-group v-model="approveForm.result">
            <el-radio label="approved">通过</el-radio>
            <el-radio label="rejected">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批意见" prop="comments">
          <el-input type="textarea" v-model="approveForm.comments" placeholder="请输入审批意见" />
        </el-form-item>
        <el-form-item label="押金金额" prop="deposit" v-if="approveForm.result === 'approved'">
          <el-input v-model="approveForm.deposit" placeholder="请输入押金金额" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="approveDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitApprove">提交审批</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 批量审批对话框 -->
    <el-dialog v-model="batchApproveDialogVisible" title="批量审批" width="500px">
      <el-form :model="batchApproveForm" :rules="batchApproveRules" ref="batchApproveFormRef" label-width="100px">
        <el-form-item label="审批结果" prop="status">
          <el-radio-group v-model="batchApproveForm.status">
            <el-radio label="approved">通过</el-radio>
            <el-radio label="rejected">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批意见" prop="remark">
          <el-input type="textarea" v-model="batchApproveForm.remark" placeholder="请输入审批意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="batchApproveDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitBatchApprove">提交审批</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getAdoptionList, approveAdoption, batchApproveAdoption } from '@/api/adoption/application'

const router = useRouter()
const tableData = ref([])
const selectedRows = ref([])
const queryParams = reactive({
  applyStatus: null,
  applicantName: ''
})
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const approveDialogVisible = ref(false)
const approveFormRef = ref()
const currentApproveId = ref()
const approveForm = reactive({
  result: '',
  comments: '',
  deposit: 0
})

const approveRules = {
  result: [{ required: true, message: '请选择审批结果', trigger: 'change' }],
  comments: [{ required: true, message: '请输入审批意见', trigger: 'blur' }],
  deposit: [
    { 
      validator: (rule, value, callback) => {
        if (approveForm.result === 'approved') {
          if (!value && value !== 0) {
            callback(new Error('请输入押金金额'))
          } else if (typeof value === 'number' && value < 0) {
            callback(new Error('押金金额必须大于等于0'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const batchApproveDialogVisible = ref(false)
const batchApproveFormRef = ref()
const batchApproveForm = reactive({
  status: 'approved',
  remark: '',
  deposit: 0
})

const batchApproveRules = {
  status: [{ required: true, message: '请选择审批结果', trigger: 'change' }],
  remark: [{ required: true, message: '请输入审批意见', trigger: 'blur' }]
}

const getStatusType = (status) => {
  switch (status) {
    case 0: return 'warning' // 待审核
    case 1: return 'success' // 审核通过
    case 2: return 'danger' // 审核驳回
    case 3: return 'info' // 已领养
    case 4: return 'info' // 已取消
    default: return ''
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 0: return '待审核'
    case 1: return '审核通过'
    case 2: return '审核驳回'
    case 3: return '已领养'
    case 4: return '已取消'
    default: return status
  }
}

const getHousingTypeText = (type) => {
  switch (type) {
    case 'owned': return '自有房'
    case 'rented': return '租房'
    case 'dormitory': return '宿舍'
    default: return type
  }
}

const loadData = async () => {
  try {
    const response = await getAdoptionList({
      applyStatus: queryParams.applyStatus,
      applicantName: queryParams.applicantName,
      pageNum: pagination.current,
      pageSize: pagination.size
    })
    console.log('Response:', response)
    tableData.value = response.rows || []
    pagination.total = response.total || 0
  } catch (error) {
    console.error('Error:', error)
    ElMessage.error('获取数据失败')
  }
}

const handleQuery = () => {
  pagination.current = 1
  loadData()
}

const resetQuery = () => {
  queryParams.applyStatus = null
  queryParams.applicantName = ''
  pagination.current = 1
  loadData()
}

const handleSizeChange = (size) => {
  pagination.size = size
  loadData()
}

const handleCurrentChange = (current) => {
  pagination.current = current
  loadData()
}

const handleSelectionChange = (val) => {
  selectedRows.value = val
}

const handleView = (row) => {
  const applicationId = row.applicationId || row.id
  if (applicationId) {
    router.push(`/adoption/detail/${applicationId}`)
  } else {
    ElMessage.error('无效的申请ID')
  }
}

const handleApprove = (row) => {
  const applicationId = row.applicationId || row.id
  if (applicationId) {
    currentApproveId.value = applicationId
    approveForm.result = ''
    approveForm.comments = ''
    approveForm.deposit = 0
    approveDialogVisible.value = true
  } else {
    ElMessage.error('无效的申请ID')
  }
}

const submitApprove = async () => {
  if (!approveFormRef.value) return
  await approveFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 构建正确的请求参数
        const approvalData = {
          status: approveForm.result, // 转换为 approved 或 rejected
          remark: approveForm.comments
        }
        await approveAdoption(currentApproveId.value, approvalData)
        ElMessage.success('审批成功')
        approveDialogVisible.value = false
        loadData()
      } catch (error) {
        ElMessage.error('审批失败')
      }
    }
  })
}

const handleBatchApprove = () => {
  if (!selectedRows.value.length) return
  batchApproveForm.status = 'approved'
  batchApproveForm.remark = ''
  batchApproveForm.deposit = 0
  batchApproveDialogVisible.value = true
}

const submitBatchApprove = async () => {
  if (!batchApproveFormRef.value) return
  await batchApproveFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const ids = selectedRows.value.map(row => row.applicationId || row.id)
        await batchApproveAdoption({
          ids,
          status: batchApproveForm.status,
          remark: batchApproveForm.remark
        })
        ElMessage.success('批量审批成功')
        batchApproveDialogVisible.value = false
        loadData()
      } catch (error) {
        ElMessage.error('批量审批失败')
      }
    }
  })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.adoption-admin-approval {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dialog-footer {
  text-align: right;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .adoption-admin-approval {
    padding: 10px;
  }

  .el-table {
    font-size: 12px;
  }

  .el-table-column {
    width: auto !important;
  }
}
</style>