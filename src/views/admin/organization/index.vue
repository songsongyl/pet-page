<template>
  <div class="admin-organization tech-page tech-grid-bg">
    <div class="tech-title">
      <!-- <span class="tech-gradient-text">合作机构管理</span> -->
      <!-- <span class="tech-subtitle">管理合作机构信息，审核机构申请</span> -->
    </div>

    <el-card shadow="hover" class="tech-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon">
              <OfficeBuilding />
            </el-icon>
            合作机构列表
          </span>
          <div class="header-buttons">
            <el-button type="primary" class="tech-btn" @click="handleAdd">
              <el-icon>
                <Plus />
              </el-icon>
              添加合作机构
            </el-button>
            <el-button type="warning" class="tech-btn" @click="handleBatchEdit" :disabled="!selectedRows.length">
              <el-icon>
                <Edit />
              </el-icon>
              编辑
            </el-button>
            <el-button type="danger" class="tech-btn" @click="handleBatchDelete" :disabled="!selectedRows.length">
              <el-icon>
                <Delete />
              </el-icon>
              删除
            </el-button>
          </div>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="机构名称">
          <el-input v-model="searchForm.name" placeholder="请输入机构名称" class="tech-input">
            <template #prefix>
              <el-icon>
                <OfficeBuilding />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" class="tech-select">
            <el-option label="全部状态" value="" />
            <el-option label="待审核" :value="0">
              <el-icon class="option-icon">
                <Clock />
              </el-icon>
              待审核
            </el-option>
            <el-option label="已通过" :value="1">
              <el-icon class="option-icon">
                <CircleCheck />
              </el-icon>
              已通过
            </el-option>
            <el-option label="已拒绝" :value="2">
              <el-icon class="option-icon">
                <CircleClose />
              </el-icon>
              已拒绝
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="tech-btn search-btn" @click="handleSearch">
            <el-icon>
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button class="reset-btn" @click="resetSearch">
            <el-icon>
              <RefreshRight />
            </el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 统计卡片 -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon pending">
            <el-icon>
              <Clock />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.pendingCount || 0 }}</div>
            <div class="stat-label">待审核</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon approved">
            <el-icon>
              <CircleCheck />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.approvedCount || 0 }}</div>
            <div class="stat-label">已通过</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon total">
            <el-icon>
              <OfficeBuilding />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalCount || 0 }}</div>
            <div class="stat-label">机构总数</div>
          </div>
        </div>
      </div>

      <el-table :data="tableData" style="width: 100%" class="tech-table" v-loading="loading"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="orgId" label="ID" width="80" align="center">
          <template #default="scope">
            <span>{{ scope.row.orgId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="机构名称" width="180">
          <template #default="scope">
            <div class="org-info">
              <div class="org-avatar">
                <el-icon>
                  <OfficeBuilding />
                </el-icon>
              </div>
              <span class="org-name">{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="contactPerson" label="联系人" width="120">
          <template #default="scope">
            <div class="contact-info">
              <el-icon>
                <User />
              </el-icon>
              <span>{{ scope.row.contactPerson }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="contactPhone" label="联系电话" width="150">
          <template #default="scope">
            <div class="contact-info">
              <el-icon>
                <Phone />
              </el-icon>
              <span>{{ scope.row.contactPhone }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址" width="200" show-overflow-tooltip>
          <template #default="scope">
            <div class="address-info">
              <el-icon>
                <Location />
              </el-icon>
              <span>{{ scope.row.address }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)" class="status-tag" effect="dark">
              <el-icon v-if="scope.row.status === 0">
                <Clock />
              </el-icon>
              <el-icon v-else-if="scope.row.status === 1">
                <CircleCheck />
              </el-icon>
              <el-icon v-else>
                <CircleClose />
              </el-icon>
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="申请时间" width="180">
          <template #default="scope">
            <div class="time-info">
              <el-icon>
                <Calendar />
              </el-icon>
              {{ scope.row.createTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <div class="action-btns">
              <el-button size="small" class="action-btn view-btn" @click="handleView(scope.row.orgId)">
                <el-icon>
                  <View />
                </el-icon>
                查看
              </el-button>
              <el-button v-if="scope.row.status === 0" size="small" type="primary" class="action-btn approve-btn"
                @click="handleApprove(scope.row.orgId)">
                <el-icon>
                  <Check />
                </el-icon>
                审核
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-if="pagination.total > 0" v-model:current-page="pagination.current"
        v-model:page-size="pagination.size" :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" class="tech-pagination" />

      <!-- 空状态 -->
      <div v-if="tableData.length === 0 && !loading" class="empty-state">
        <el-icon class="empty-icon">
          <OfficeBuilding />
        </el-icon>
        <p>暂无合作机构数据</p>
        <el-button type="primary" class="tech-btn" @click="handleAdd">
          <el-icon>
            <Plus />
          </el-icon>
          添加合作机构
        </el-button>
      </div>
    </el-card>

    <!-- 审核对话框 -->
    <el-dialog v-model="approveDialogVisible" title="审核合作机构" width="500px" class="tech-dialog" destroy-on-close>
      <div class="dialog-content">
        <el-form :model="approveForm" :rules="approveRules" ref="approveFormRef" label-width="100px">
          <el-form-item label="审核结果" prop="result">
            <el-radio-group v-model="approveForm.result" class="approve-radio-group">
              <el-radio :label="1" class="approve-radio">
                <el-icon class="radio-icon success">
                  <CircleCheck />
                </el-icon>
                <span>通过</span>
              </el-radio>
              <el-radio :label="2" class="approve-radio">
                <el-icon class="radio-icon danger">
                  <CircleClose />
                </el-icon>
                <span>拒绝</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见" prop="comments">
            <el-input type="textarea" v-model="approveForm.comments" placeholder="请输入审核意见" :rows="4"
              class="tech-textarea" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="approveDialogVisible = false" class="cancel-btn">取消</el-button>
          <el-button type="primary" class="tech-btn" @click="submitApprove">
            <el-icon>
              <Check />
            </el-icon>
            提交审核
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { getOrganizationList, approveOrganization, deleteOrganization, getOrganizationStats } from '@/api/admin/organization'
import {
  OfficeBuilding, Plus, Search, RefreshRight, Clock, CircleCheck, CircleClose,
  User, Phone, Location, Calendar, View, Check, Edit, Delete
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const tableData = ref([])
const loading = ref(false)
const stats = ref({})
const searchForm = reactive({
  name: '',
  status: ''
})
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})
const selectedRows = ref([])
const approveDialogVisible = ref(false)
const approveFormRef = ref()
const currentApproveId = ref()
const approveForm = reactive({
  result: '',
  comments: ''
})

const approveRules = {
  result: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
  comments: [{ required: true, message: '请输入审核意见', trigger: 'blur' }]
}

const getStatusType = (status) => {
  switch (status) {
    case 0: return 'warning'
    case 1: return 'success'
    case 2: return 'danger'
    default: return ''
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 0: return '待审核'
    case 1: return '已通过'
    case 2: return '已拒绝'
    default: return status
  }
}

const updateStats = () => {
  stats.value.pendingCount = tableData.value.filter(item => item.status === 0).length
  stats.value.approvedCount = tableData.value.filter(item => item.status === 1).length
  stats.value.totalCount = tableData.value.length
}

const loadData = async () => {
  loading.value = true
  try {
    const response = await getOrganizationList({
      ...searchForm,
      pageNum: pagination.current,
      pageSize: pagination.size
    })
    console.log('API响应:', response)
    tableData.value = response.rows
    pagination.total = response.total
    // 打印数据结构，检查ID字段
    if (tableData.value.length > 0) {
      console.log('机构数据结构:', tableData.value[0])
      console.log('机构所有字段:', Object.keys(tableData.value[0]))
      // 尝试不同的ID字段名称
      console.log('尝试不同的ID字段:', {
        id: tableData.value[0].id,
        orgId: tableData.value[0].orgId,
        organizationId: tableData.value[0].organizationId
      })
    }
    // 根据表格数据计算统计数据
    updateStats()
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.current = 1
  loadData()
}

const resetSearch = () => {
  searchForm.name = ''
  searchForm.status = ''
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

const handleBatchEdit = () => {
  if (selectedRows.value.length !== 1) {
    ElMessage.warning('请选择一条数据进行编辑')
    return
  }
  const row = selectedRows.value[0]
  handleEdit(row.id)
}

const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的数据')
    return
  }
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条数据吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const ids = selectedRows.value.map(row => row.orgId)
    for (const id of ids) {
      await deleteOrganization(id)
    }
    ElMessage.success('删除成功')
    loadData()
    updateStats()
    selectedRows.value = []
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleAdd = () => {
  console.log(11111)
  router.push('/admin/organization/add')
}

const handleView = (id) => {
  router.push(`/admin/organization/detail/${id}`)
}

const handleEdit = (id) => {
  router.push(`/admin/organization/edit/${id}`)
}

const handleApprove = (id) => {
  currentApproveId.value = id
  approveForm.result = ''
  approveForm.comments = ''
  approveDialogVisible.value = true
}

const submitApprove = async () => {
  if (!approveFormRef.value) return
  await approveFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 转换审核结果格式，确保后端能正确处理
        const approveData = {
          status: approveForm.result,
          comments: approveForm.comments
        }
        await approveOrganization(currentApproveId.value, approveData)
        ElMessage.success('审核成功')
        approveDialogVisible.value = false
        loadData()
        updateStats()
      } catch (error) {
        ElMessage.error('审核失败')
      }
    }
  })
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该合作机构吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteOrganization(id)
    ElMessage.success('删除成功')
    loadData()
    loadStats()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error(error.message || '删除失败')
    }
  }
}

onMounted(() => {
  loadData()
  updateStats()
})
</script>

<style scoped>
.admin-organization {
  padding: 20px;
}

/* 头部按钮 */
.header-buttons {
  display: flex;
  gap: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

/* 统计卡片 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: rgba(0, 212, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 212, 255, 0.15);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.stat-icon.pending {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.4) 100%);
  color: #f59e0b;
}

.stat-icon.approved {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.4) 100%);
  color: #10b981;
}

.stat-icon.total {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(124, 58, 237, 0.4) 100%);
  color: #00d4ff;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: var(--tech-text-secondary);
  margin-top: 4px;
}

/* 表格样式 */
.id-badge {
  display: inline-block;
  padding: 2px 8px;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 4px;
  font-size: 12px;
  color: #00d4ff;
  font-family: 'Courier New', monospace;
}

.org-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.org-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.org-name {
  font-weight: 500;
  color: var(--tech-text-primary);
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--tech-text-secondary);
}

.contact-info .el-icon {
  color: #00d4ff;
}

.address-info {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--tech-text-secondary);
}

.address-info .el-icon {
  color: #a78bfa;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.time-info {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--tech-text-secondary);
}

.time-info .el-icon {
  color: #00d4ff;
}

.action-btns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.view-btn {
  background: rgba(0, 212, 255, 0.1);
  border-color: rgba(0, 212, 255, 0.3);
  color: #00d4ff;
}

.view-btn:hover {
  background: rgba(0, 212, 255, 0.2);
  border-color: rgba(0, 212, 255, 0.5);
}

.approve-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
}

.edit-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border: none;
}

.delete-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
}

/* 审核对话框 */
.dialog-content {
  padding: 20px 0;
}

.approve-radio-group {
  display: flex;
  gap: 24px;
}

.approve-radio {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  border: 1px solid rgba(0, 212, 255, 0.2);
  transition: all 0.3s ease;
}

.approve-radio:hover {
  border-color: rgba(0, 212, 255, 0.5);
  background: rgba(0, 212, 255, 0.05);
}

.approve-radio.is-checked {
  border-color: #00d4ff;
  background: rgba(0, 212, 255, 0.1);
}

.radio-icon {
  font-size: 20px;
}

.radio-icon.success {
  color: #10b981;
}

.radio-icon.danger {
  color: #ef4444;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn:hover {
  border-color: #00d4ff;
  color: #00d4ff;
}

/* 响应式 */
@media (max-width: 1200px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: 1fr;
  }

  .action-btns {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
