<template>
  <div class="adoption-list">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>领养申请列表</span>
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

      <el-table :data="tableData" style="width: 100%">
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
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px" />
    </el-card>


  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getAdoptionList } from '@/api/adoption/application'

const router = useRouter()
const tableData = ref([])
const queryParams = reactive({
  applyStatus: null,
  applicantName: ''
})
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const getStatusType = (status) => {
  switch (status) {
    case 0: return 'warning'
    case 1: return 'success'
    case 2: return 'danger'
    case 3: return 'info'
    case 4: return 'info'
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
    tableData.value = response.rows || []
    pagination.total = response.total || 0
  } catch (error) {
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

const handleAdd = () => {
  router.push('/adoption/application')
}

const handleView = (row) => {
  const applicationId = row.applicationId || row.id
  if (applicationId) {
    router.push(`/adoption/detail/${applicationId}`)
  } else {
    ElMessage.error('无效的申请ID')
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.adoption-list {
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
  .adoption-list {
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