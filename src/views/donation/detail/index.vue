<template>
  <div class="donation-detail">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>物品捐赠详情</span>
          <el-button type="primary" @click="goBack">返回列表</el-button>
        </div>
      </template>
      
      <el-descriptions :column="1" border>
        <el-descriptions-item label="捐赠编号">{{ detail.donationId }}</el-descriptions-item>
        <el-descriptions-item label="捐赠人">{{ detail.donorName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ detail.contactPhone }}</el-descriptions-item>
        <el-descriptions-item label="捐赠类型">{{ getDonationTypeText(detail.donationType) }}</el-descriptions-item>
        <el-descriptions-item label="捐赠方式">{{ detail.donationMethod }}</el-descriptions-item>
        <el-descriptions-item label="捐赠地址" v-if="detail.donationMethod === '现场捐赠'">
          {{ detail.donationAddress }}
        </el-descriptions-item>
        <el-descriptions-item label="快递地址" v-if="detail.donationMethod === '快递捐赠'">
          {{ detail.shippingAddress }}
        </el-descriptions-item>
        <el-descriptions-item label="捐赠时间">{{ detail.donationTime }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(detail.donationStatus)">{{ getStatusText(detail.donationStatus) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="备注">{{ detail.remarks || '暂无' }}</el-descriptions-item>
      </el-descriptions>
      
      <el-divider content-position="left">捐赠物品</el-divider>
      <el-table :data="detail.items || []" style="width: 100%">
        <el-table-column prop="name" label="物品名称" width="180" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="unit" label="单位" width="100" />
        <el-table-column prop="description" label="描述" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { getDonationDetail } from '@/api/donation/application'

const route = useRoute()
const router = useRouter()
const detail = ref({})

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
    case 'food': return '食品'
    case 'supplies': return '用品'
    case 'medicine': return '药品'
    case 'other': return '其他'
    default: return type
  }
}

const loadDetail = async () => {
  try {
    console.log('Route params:', route.params)
    console.log('Donation ID:', route.params.donationId)
    if (!route.params.donationId) {
      ElMessage.error('缺少捐赠ID参数')
      return
    }
    const response = await getDonationDetail(route.params.donationId)
    console.log('API response:', response)
    detail.value = response.data || response
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

const goBack = () => {
  router.push('/donation/list')
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.donation-detail {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>