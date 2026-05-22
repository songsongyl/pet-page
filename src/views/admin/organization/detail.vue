<template>
  <div class="admin-organization-detail tech-page tech-grid-bg">
    <div class="tech-title">
      <!-- <span class="tech-gradient-text">合作机构详情</span> -->
      <!-- <span class="tech-subtitle">查看合作机构详细信息</span> -->
    </div>

    <el-card shadow="hover" class="tech-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon">
              <View />
            </el-icon>
            合作机构信息
          </span>
          <el-button @click="handleBack">返回列表</el-button>
        </div>
      </template>

      <div class="detail-info">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="ID">
            <span class="id-badge">#{{ organization.orgId }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="机构名称">
            <div class="org-info">
              <div class="org-avatar">
                <el-icon>
                  <OfficeBuilding />
                </el-icon>
              </div>
              <span class="org-name">{{ organization.orgName }}</span>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="联系人">
            <div class="contact-info">
              <el-icon>
                <User />
              </el-icon>
              <span>{{ organization.contactPerson }}</span>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">
            <div class="contact-info">
              <el-icon>
                <Phone />
              </el-icon>
              <span>{{ organization.contactPhone }}</span>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="地址">
            <div class="address-info">
              <el-icon>
                <Location />
              </el-icon>
              <span>{{ organization.address }}</span>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(organization.status)" class="status-tag" effect="dark">
              <el-icon v-if="organization.status === 0">
                <Clock />
              </el-icon>
              <el-icon v-else-if="organization.status === 1">
                <CircleCheck />
              </el-icon>
              <el-icon v-else-if="organization.status === 2">
                <CircleClose />
              </el-icon>
              {{ getStatusText(organization.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="申请时间">{{ organization.createTime }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ organization.remarks || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { getOrganizationById } from '@/api/admin/organization'
import { View, OfficeBuilding, User, Phone, Location, Clock, CircleCheck, CircleClose } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const organization = ref({})

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

const loadData = async () => {
  try {
    const id = route.params.id
    const response = await getOrganizationById(id)
    organization.value = response.data
  } catch (error) {
    ElMessage.error('获取数据失败')
  }
}

const handleBack = () => {
  router.push('/admin/organization')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-organization-detail {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.detail-info {
  margin-top: 20px;
}

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

.text-muted {
  color: #909399;
}
</style>