<template>
  <div class="adoption-detail">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>领养申请详情</span>
          <el-button type="primary" @click="goBack">返回列表</el-button>
        </div>
      </template>
      
      <el-descriptions :column="1" border>
        <el-descriptions-item label="申请编号">{{ detail.applicationId }}</el-descriptions-item>
        <el-descriptions-item label="申请人">{{ detail.applicantName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ detail.contactPhone }}</el-descriptions-item>
        <el-descriptions-item label="居住地址">{{ detail.address }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ detail.createTime }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(detail.applyStatus)">{{ getStatusText(detail.applyStatus) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="审批意见">{{ detail.reviewRemark || '暂无' }}</el-descriptions-item>
        <el-descriptions-item label="押金金额">{{ detail.depositAmount || 0 }} 元</el-descriptions-item>
      </el-descriptions>
      
      <el-divider content-position="left">基础居住条件</el-divider>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="住房类型">{{ getHousingTypeText(detail.housingType) }}</el-descriptions-item>
        <el-descriptions-item label="是否允许养宠">{{ getBooleanText(detail.petAllowed) }}</el-descriptions-item>
        <el-descriptions-item label="封闭阳台/纱窗">{{ getBooleanText(detail.hasEnclosedBalcony) }}</el-descriptions-item>
        <el-descriptions-item label="家庭成员同意">{{ getBooleanText(detail.familyAgree) }}</el-descriptions-item>
        <el-descriptions-item label="有无过敏情况">{{ getBooleanText(detail.hasAllergy) }}</el-descriptions-item>
      </el-descriptions>
      
      <el-divider content-position="left">经济与时间条件</el-divider>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="工作作息">{{ detail.workSchedule }}</el-descriptions-item>
        <el-descriptions-item label="每天陪伴时间">{{ getCompanionTimeText(detail.companionTime) }}</el-descriptions-item>
        <el-descriptions-item label="了解基础开销">{{ getBooleanText(detail.knowBasicCost) }}</el-descriptions-item>
        <el-descriptions-item label="承担医疗费用">{{ getBooleanText(detail.canAffordMedical) }}</el-descriptions-item>
      </el-descriptions>
      
      <el-divider content-position="left">喂养养护理念</el-divider>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="科学喂养">{{ getBooleanText(detail.scientificFeeding) }}</el-descriptions-item>
        <el-descriptions-item label="同意绝育/牵引">{{ getBooleanText(detail.agreeSterilization) }}</el-descriptions-item>
        <el-descriptions-item label="养宠经验">{{ detail.petExperience }}</el-descriptions-item>
      </el-descriptions>
      
      <el-divider content-position="left">长期责任承诺</el-divider>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="未来计划">{{ detail.futurePlans }}</el-descriptions-item>
        <el-descriptions-item label="不随意弃养">{{ getBooleanText(detail.noAbandon) }}</el-descriptions-item>
        <el-descriptions-item label="接受回访">{{ getBooleanText(detail.acceptVisit) }}</el-descriptions-item>
      </el-descriptions>
      
      <el-divider content-position="left">证明材料</el-divider>
      <div v-if="detail.livingProveUrl && detail.livingProveUrl !== ''" class="files-list">
        <el-image
          v-for="(url, index) in detail.livingProveUrl.split(',')"
          :key="index"
          :src="url"
          fit="cover"
          style="width: 100px; height: 100px; margin: 10px;"
          :preview-src-list="detail.livingProveUrl.split(',')"
        />
      </div>
      <div v-else class="no-files">暂无证明材料</div>
      
      <el-divider content-position="left">领养协议</el-divider>
      <div v-if="detail.agreementUrl && detail.agreementUrl !== ''" class="agreement-file">
        <el-button type="primary" @click="downloadAgreement">下载签署后的协议</el-button>
      </div>
      <div v-else class="no-agreement">暂无签署后的协议</div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { getAdoptionDetail } from '@/api/adoption/application'

const route = useRoute()
const router = useRouter()
const detail = ref({})

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

const getBooleanText = (value) => {
  return value === 1 ? '是' : '否'
}

const getHousingTypeText = (type) => {
  switch (type) {
    case 'owned': return '自有房'
    case 'rented': return '租房'
    case 'dormitory': return '宿舍'
    default: return type
  }
}

const getCompanionTimeText = (time) => {
  switch (time) {
    case 'less1': return '1小时以下'
    case '1-3': return '1-3小时'
    case '3-6': return '3-6小时'
    case 'more6': return '6小时以上'
    default: return time
  }
}

const loadDetail = async () => {
  const applicationId = route.params.applicationId
  if (!applicationId || isNaN(applicationId)) {
    ElMessage.error('无效的申请ID')
    return
  }
  try {
    const response = await getAdoptionDetail(applicationId)
    detail.value = response.data
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

const goBack = () => {
  router.push('/adoption/admin/approval')
}

const downloadAgreement = () => {
  // 实现协议下载逻辑
  ElMessage.success('协议下载功能开发中')
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.adoption-detail {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.files-list {
  margin-top: 10px;
}

.no-files,
.no-agreement {
  color: #999;
  padding: 20px;
  text-align: center;
}

.agreement-file {
  margin-top: 10px;
}
</style>