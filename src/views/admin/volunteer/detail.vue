<template>
  <div class="admin-volunteer-detail tech-page tech-grid-bg">
    <div class="tech-title">
      <!-- <span class="tech-gradient-text">志愿者详情</span> -->
      <!-- <span class="tech-subtitle">查看志愿者详细信息</span> -->
    </div>

    <el-card shadow="hover" class="tech-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon">
              <View />
            </el-icon>
            志愿者信息
          </span>
          <el-button @click="handleBack">返回列表</el-button>
        </div>
      </template>

      <div class="detail-info">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="ID">
            <span class="id-badge">#{{ volunteer.volunteerId || volunteer.id }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="姓名">
            <div class="user-info">
              <el-avatar :size="32" class="user-avatar">
                <el-icon>
                  <UserFilled />
                </el-icon>
              </el-avatar>
              <span class="user-name">{{ volunteer.name }}</span>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ volunteer.phone }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ volunteer.email }}</el-descriptions-item>
          <el-descriptions-item label="技能特长">
            <el-tag v-if="volunteer.skills" size="small" class="skill-tag">
              {{ volunteer.skills }}
            </el-tag>
            <span v-else class="text-muted">-</span>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(volunteer.status)" class="status-tag" effect="dark">
              <el-icon v-if="volunteer.status === 'pending'">
                <Clock />
              </el-icon>
              <el-icon v-else-if="volunteer.status === 'approved'">
                <CircleCheck />
              </el-icon>
              <el-icon v-else>
                <CircleClose />
              </el-icon>
              {{ getStatusText(volunteer.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="申请时间">{{ volunteer.createTime }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ volunteer.remarks || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { getVolunteerById } from '@/api/admin/volunteer'
import { View, UserFilled, Clock, CircleCheck, CircleClose } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const volunteer = ref({})

const getStatusType = (status) => {
  switch (status) {
    case 0: case '0': case 'pending': return 'warning'
    case 1: case '1': case 'approved': return 'success'
    case 2: case '2': case 'rejected': return 'danger'
    default: return ''
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 0: case '0': case 'pending': return '待审核'
    case 1: case '1': case 'approved': return '已通过'
    case 2: case '2': case 'rejected': return '已拒绝'
    default: return status
  }
}

const loadData = async () => {
  try {
    const id = route.params.id
    const response = await getVolunteerById(id)
    volunteer.value = response.data
  } catch (error) {
    ElMessage.error('获取数据失败')
  }
}

const handleBack = () => {
  router.push('/admin/volunteer')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-volunteer-detail {
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

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
}

.user-name {
  font-weight: 500;
}

.skill-tag {
  background: rgba(124, 58, 237, 0.2);
  border-color: rgba(124, 58, 237, 0.4);
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