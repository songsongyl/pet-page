<template>
  <div class="donation-admin-approval tech-page tech-grid-bg">
    <div class="tech-title">
      <span class="tech-gradient-text">捐赠申请审批</span>
      <span class="tech-subtitle">管理捐赠，传递爱心</span>
    </div>

    <el-card shadow="hover" class="tech-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon">
              <Present />
            </el-icon>
            捐赠审批列表
          </span>
          <div class="batch-actions">
            <el-button type="success" class="tech-btn batch-confirm-btn" @click="handleBatchConfirm"
              :disabled="!selectedRows.length">
              <el-icon>
                <Check />
              </el-icon>
              批量确认
            </el-button>
            <el-button type="danger" class="tech-btn batch-cancel-btn" @click="handleBatchCancel"
              :disabled="!selectedRows.length">
              <el-icon>
                <Close />
              </el-icon>
              批量取消
            </el-button>
          </div>
        </div>
      </template>

      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="捐赠类型">
          <el-select v-model="queryParams.donationType" placeholder="请选择类型" clearable style="width: 120px"
            class="tech-select">
            <el-option label="物品" value="material" />
            <el-option label="资金" value="money" />
            <el-option label="志愿服务" value="volunteer" />
          </el-select>
        </el-form-item>
        <el-form-item label="捐赠状态">
          <el-select v-model="queryParams.donationStatus" placeholder="请选择状态" clearable style="width: 120px"
            class="tech-select">
            <el-option label="待确认" :value="0" />
            <el-option label="已确认" :value="1" />
            <el-option label="已取消" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="捐赠人">
          <el-input v-model="queryParams.donorName" placeholder="请输入捐赠人姓名" clearable style="width: 150px"
            class="tech-input">
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="tech-btn search-btn" @click="handleQuery">
            <el-icon>
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button class="reset-btn" @click="resetQuery">
            <el-icon>
              <RefreshRight />
            </el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" class="tech-table donation-table" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="donationId" label="捐赠编号" width="100" />
        <el-table-column prop="donorName" label="捐赠人" width="120" />
        <el-table-column prop="contactPhone" label="联系电话" width="150" />
        <el-table-column prop="donationType" label="捐赠类型" width="100">
          <template #default="scope">
            <span class="donation-type-tag" :class="scope.row.donationType">
              <el-icon>
                <component :is="getDonationTypeIcon(scope.row.donationType)" />
              </el-icon>
              {{ getDonationTypeText(scope.row.donationType) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="donationMethod" label="捐赠方式" width="120" />
        <el-table-column prop="donationTime" label="捐赠时间" width="180" />
        <el-table-column prop="donationStatus" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.donationStatus)">{{ getStatusText(scope.row.donationStatus)
              }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" class="view-btn" @click="handleView(scope.row.donationId)"
              v-if="scope.row.donationStatus !== 0">
              <el-icon>
                <View />
              </el-icon>
              查看
            </el-button>
            <el-button size="small" type="success" class="confirm-btn" @click="handleConfirm(scope.row.donationId)"
              v-if="scope.row.donationStatus === 0">
              <el-icon>
                <Check />
              </el-icon>
              确认收到
            </el-button>
            <el-button size="small" type="danger" class="cancel-btn" @click="handleCancel(scope.row.donationId)"
              v-if="scope.row.donationStatus === 0">
              <el-icon>
                <Close />
              </el-icon>
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-if="pagination.total > 0" v-model:current-page="pagination.current"
        v-model:page-size="pagination.size" :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" class="tech-pagination" />
    </el-card>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-card shadow="hover" class="tech-card stat-card">
        <div class="stat-content">
          <el-icon class="stat-icon">
            <Timer />
          </el-icon>
          <div class="stat-info">
            <h4>待确认</h4>
            <p class="stat-number">{{ stats.pending }}</p>
          </div>
        </div>
      </el-card>
      <el-card shadow="hover" class="tech-card stat-card">
        <div class="stat-content">
          <el-icon class="stat-icon">
            <Check />
          </el-icon>
          <div class="stat-info">
            <h4>已确认</h4>
            <p class="stat-number">{{ stats.confirmed }}</p>
          </div>
        </div>
      </el-card>
      <el-card shadow="hover" class="tech-card stat-card">
        <div class="stat-content">
          <el-icon class="stat-icon">
            <Close />
          </el-icon>
          <div class="stat-info">
            <h4>已取消</h4>
            <p class="stat-number">{{ stats.cancelled }}</p>
          </div>
        </div>
      </el-card>
      <el-card shadow="hover" class="tech-card stat-card">
        <div class="stat-content">
          <el-icon class="stat-icon">
            <Present />
          </el-icon>
          <div class="stat-info">
            <h4>总捐赠</h4>
            <p class="stat-number">{{ stats.total }}</p>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getDonationList, confirmDonation, cancelDonation, batchConfirmDonation, batchCancelDonation } from '@/api/donation/application'
import {
  Present,
  Plus,
  Search,
  RefreshRight,
  User,
  Food,
  Box,
  FirstAidKit,
  More,
  View,
  Check,
  Close,
  Timer,
  Wallet
} from '@element-plus/icons-vue'

const router = useRouter()
const tableData = ref([])
const selectedRows = ref([])
const queryParams = reactive({
  donationStatus: null,
  donorName: '',
  donationType: ''
})
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})
const stats = reactive({
  pending: 0,
  confirmed: 0,
  cancelled: 0,
  total: 0
})

const getStatusType = (status) => {
  switch (status) {
    case 0: return 'warning' // 待确认
    case 1: return 'success' // 已确认
    case 2: return 'danger' // 已取消
    default: return ''
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 0: return '待确认'
    case 1: return '已确认'
    case 2: return '已取消'
    default: return status
  }
}

const getDonationTypeText = (type) => {
  switch (type) {
    case 'material': return '物品'
    case 'money': return '资金'
    case 'volunteer': return '志愿服务'
    case 'food': return '食品'
    case 'supplies': return '用品'
    case 'medicine': return '药品'
    case 'other': return '其他'
    default: return type
  }
}

const getDonationTypeIcon = (type) => {
  switch (type) {
    case 'material': return 'Present'
    case 'money': return 'Wallet'
    case 'volunteer': return 'User'
    case 'food': return 'Food'
    case 'supplies': return 'Box'
    case 'medicine': return 'FirstAidKit'
    case 'other': return 'More'
    default: return 'Present'
  }
}

const updateStats = () => {
  stats.pending = tableData.value.filter(item => item.donationStatus === 0).length
  stats.confirmed = tableData.value.filter(item => item.donationStatus === 1).length
  stats.cancelled = tableData.value.filter(item => item.donationStatus === 2).length
  stats.total = tableData.value.length
}

const loadData = async () => {
  try {
    const response = await getDonationList({
      donationType: queryParams.donationType,
      donationStatus: queryParams.donationStatus,
      donorName: queryParams.donorName,
      pageNum: pagination.current,
      pageSize: pagination.size
    })
    console.log('API response:', response)
    if (response.rows && response.rows.length > 0) {
      console.log('First row data:', response.rows[0])
    }
    tableData.value = response.rows
    pagination.total = response.total
    updateStats()
  } catch (error) {
    ElMessage.error('获取数据失败')
  }
}

const handleQuery = () => {
  pagination.current = 1
  loadData()
}

const resetQuery = () => {
  queryParams.donationType = ''
  queryParams.donationStatus = null
  queryParams.donorName = ''
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

const handleView = (id) => {
  router.push(`/donation/detail/${id}`)
}

const handleConfirm = async (id) => {
  try {
    await confirmDonation(id)
    ElMessage.success('确认成功')
    loadData()
  } catch (error) {
    ElMessage.error('确认失败')
  }
}

const handleCancel = async (id) => {
  try {
    await cancelDonation(id)
    ElMessage.success('取消成功')
    loadData()
  } catch (error) {
    ElMessage.error('取消失败')
  }
}

const handleBatchConfirm = async () => {
  if (!selectedRows.value.length) return
  try {
    const ids = selectedRows.value.map(row => row.donationId)
    await batchConfirmDonation({ ids })
    ElMessage.success('批量确认成功')
    loadData()
  } catch (error) {
    ElMessage.error('批量确认失败')
  }
}

const handleBatchCancel = async () => {
  if (!selectedRows.value.length) return
  try {
    const ids = selectedRows.value.map(row => row.donationId)
    await batchCancelDonation({ ids })
    ElMessage.success('批量取消成功')
    loadData()
  } catch (error) {
    ElMessage.error('批量取消失败')
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/tech-theme.scss';

.donation-admin-approval {
  min-height: 100vh;
  padding: 24px;
}

.tech-title {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .tech-gradient-text {
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .tech-subtitle {
    font-size: 16px;
    color: var(--tech-text-secondary);
  }
}

.tech-card {
  margin-bottom: 24px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 600;
      color: var(--tech-text-primary);

      .title-icon {
        color: var(--tech-primary);
        font-size: 20px;
      }
    }

    .batch-actions {
      display: flex;
      gap: 12px;

      .batch-confirm-btn {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        border: none;

        &:hover {
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
        }
      }

      .batch-cancel-btn {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        border: none;

        &:hover {
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
        }
      }
    }
  }
}

.search-form {
  margin-bottom: 24px;

  .tech-input,
  .tech-select {
    :deep(.el-input__wrapper) {
      background: var(--tech-bg-light);
      border: 1px solid var(--tech-border);
      border-radius: 8px;

      .el-input__prefix {
        color: var(--tech-primary);
      }
    }
  }

  .search-btn {
    background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
    border: none;

    &:hover {
      box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
    }
  }

  .reset-btn {
    background: transparent;
    border: 1px solid var(--tech-border);
    color: var(--tech-text-secondary);

    &:hover {
      border-color: var(--tech-primary);
      color: var(--tech-primary);
    }
  }
}

.donation-table {
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;

  :deep(.el-table__header) {
    background: var(--tech-bg-light);

    th {
      background: var(--tech-bg-light);
      color: var(--tech-text-primary);
      font-weight: 600;
      border-bottom: 1px solid var(--tech-border);
    }
  }

  :deep(.el-table__body) {
    background: var(--tech-bg-card);

    td {
      background: var(--tech-bg-card);
      border-bottom: 1px solid var(--tech-border);
      color: var(--tech-text-secondary);
    }

    tr:hover td {
      background: var(--tech-bg-hover);
    }
  }

  .view-btn {
    background: rgba(59, 130, 246, 0.2);
    border: 1px solid rgba(59, 130, 246, 0.3);
    color: #3b82f6;

    &:hover {
      background: rgba(59, 130, 246, 0.3);
      border-color: #3b82f6;
    }
  }

  .confirm-btn {
    background: rgba(16, 185, 129, 0.2);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: #10b981;

    &:hover {
      background: rgba(16, 185, 129, 0.3);
      border-color: #10b981;
    }
  }

  .cancel-btn {
    background: rgba(239, 68, 68, 0.2);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;

    &:hover {
      background: rgba(239, 68, 68, 0.3);
      border-color: #ef4444;
    }
  }

  .donation-type-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;

    &.food {
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
    }

    &.supplies {
      background: rgba(59, 130, 246, 0.2);
      color: #3b82f6;
    }

    &.medicine {
      background: rgba(245, 158, 11, 0.2);
      color: #f59e0b;
    }

    &.other {
      background: rgba(148, 163, 184, 0.2);
      color: #94a3b8;
    }

    .el-icon {
      font-size: 14px;
    }
  }
}

.tech-pagination {
  justify-content: center;
  margin-top: 24px;

  :deep(.el-pagination__total),
  :deep(.el-pagination__jump) {
    color: var(--tech-text-secondary);
  }

  :deep(.el-pager li) {
    background: var(--tech-bg-light);
    border: 1px solid var(--tech-border);
    color: var(--tech-text-secondary);

    &:hover,
    &.is-active {
      background: var(--tech-primary);
      border-color: var(--tech-primary);
      color: white;
    }
  }

  :deep(.btn-prev),
  :deep(.btn-next) {
    background: var(--tech-bg-light);
    border: 1px solid var(--tech-border);
    color: var(--tech-text-secondary);

    &:hover {
      color: var(--tech-primary);
    }
  }

  :deep(.el-input__wrapper) {
    background: var(--tech-bg-light);
    border: 1px solid var(--tech-border);
  }
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.stat-card {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--tech-shadow-lg);
  }

  .stat-content {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;

    .stat-icon {
      font-size: 32px;
      color: var(--tech-primary);
      flex-shrink: 0;
    }

    .stat-info {
      flex: 1;

      h4 {
        margin: 0 0 4px 0;
        color: var(--tech-text-secondary);
        font-size: 14px;
        font-weight: 500;
      }

      .stat-number {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
        color: var(--tech-text-primary);
      }
    }
  }
}

.option-icon {
  margin-right: 8px;
  vertical-align: middle;
}

@media (max-width: 768px) {
  .donation-admin-approval {
    padding: 16px;
  }

  .tech-title .tech-gradient-text {
    font-size: 24px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    .batch-actions {
      width: 100%;
      justify-content: space-between;
    }
  }

  .search-form {
    .el-form-item {
      width: 100%;
      margin-right: 0;

      .tech-input,
      .tech-select {
        width: 100%;
      }
    }
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>