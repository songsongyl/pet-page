<template>
  <div class="give-detail-page tech-page tech-grid-bg">
    <div class="tech-title">
      <span class="tech-gradient-text">救助信息详情</span>
    </div>

    <el-card shadow="hover" class="tech-card" v-loading="loading">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon">
              <List />
            </el-icon>基本信息
          </span>
          <el-button @click="goBack" class="back-btn">
            <el-icon>
              <ArrowLeft />
            </el-icon>
            返回列表
          </el-button>
        </div>
      </template>

      <el-descriptions :column="2" border v-if="detail">
        <el-descriptions-item label="救助ID">
          <span class="id-badge">{{ detail.rescueId }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="宠物编码">
          <span class="pet-code" style="color: #00d4ff; font-size: 14px; font-weight: bold;">{{ detail.petId || '-'
            }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="救助状态">
          <dict-tag :options="jzxq" :value="detail.rescueStatus" />
        </el-descriptions-item>
        <el-descriptions-item label="紧急程度">
          <dict-tag :options="jjcd" :value="detail.urgentLevel" />
        </el-descriptions-item>
        <el-descriptions-item label="审核状态">
          <dict-tag :options="sh" :value="detail.verifyStatus" />
        </el-descriptions-item>
        <el-descriptions-item label="目标资金">
          <span class="amount-text">{{ detail.targetAmount || 0 }} 元</span>
        </el-descriptions-item>
        <el-descriptions-item label="已筹资金">
          <span class="amount-raised">{{ detail.raisedAmount || 0 }} 元</span>
        </el-descriptions-item>
        <el-descriptions-item label="发现地点" :span="2">
          {{ detail.foundPlace || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="需求描述" :span="2">
          {{ detail.needDesc || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">
          {{ detail.startTime || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="结束时间">
          {{ detail.endTime || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ detail.createTime || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ detail.updateTime || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="媒体文件" :span="2" v-if="detail.mediaUrl">
          <div class="media-preview">
            <el-image v-if="isImage(detail.mediaUrl)" :src="detail.mediaUrl" fit="cover" class="detail-image"
              :preview-src-list="[detail.mediaUrl]" />
            <el-icon v-else class="media-icon">
              <VideoCamera />
            </el-icon>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 审核对话框 -->
    <el-dialog v-model="approveDialogVisible" title="审核救助信息" width="500px" class="tech-dialog">
      <el-form :model="approveForm" :rules="{
        result: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
        comments: [{ required: true, message: '请填写审核意见', trigger: 'blur' }]
      }" ref="approveFormRef" label-width="100px">
        <el-form-item label="审核结果" prop="result">
          <el-radio-group v-model="approveForm.result">
            <el-radio label="1">通过</el-radio>
            <el-radio label="2">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见" prop="comments">
          <el-input type="textarea" v-model="approveForm.comments" :rows="4" placeholder="请填写审核意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="approveDialogVisible = false" class="cancel-btn">取 消</el-button>
          <el-button type="primary" @click="submitApprove" class="tech-btn">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="GiveDetail">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getGive, updateGive } from "@/api/give/give"
import { useDict } from "@/utils/dict"
import { ElMessage } from 'element-plus'
import { ArrowLeft, List, VideoCamera, Check, Close } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const { jzxq, jjcd, sh } = useDict('jzxq', 'jjcd', 'sh')

const loading = ref(true)
const detail = ref(null)
const approveDialogVisible = ref(false)
const approveForm = ref({
  result: '',
  comments: ''
})
const approveFormRef = ref(null)

const loadDetail = async () => {
  loading.value = true
  try {
    const id = route.params.id
    const response = await getGive(id)
    detail.value = response.data
  } catch (error) {
    ElMessage.error('获取详情失败')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/give/give')
}

const handleApprove = () => {
  approveForm.value.result = ''
  approveForm.value.comments = ''
  approveDialogVisible.value = true
}

const submitApprove = async () => {
  if (!approveFormRef.value) return
  await approveFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await updateGive({
          rescueId: detail.value.rescueId,
          verifyStatus: parseInt(approveForm.value.result),
          comments: approveForm.value.comments
        })
        ElMessage.success('审核成功')
        approveDialogVisible.value = false
        loadDetail()
      } catch (error) {
        ElMessage.error('审核失败')
      }
    }
  })
}

const isImage = (url) => {
  if (!url) return false
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
  const ext = url.toLowerCase().substring(url.lastIndexOf('.'))
  return imageExtensions.includes(ext)
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped lang="scss">
.give-detail-page {
  padding: 20px;
  min-height: calc(100vh - 84px);
}

.tech-title {
  margin-bottom: 24px;

  .tech-gradient-text {
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.tech-card {
  background: #111936;
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 12px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #00d4ff, #7c3aed);
  }

  :deep(.el-card__header) {
    background: rgba(0, 212, 255, 0.05);
    border-bottom: 1px solid rgba(0, 212, 255, 0.1);
    padding: 16px 20px;
  }

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #00d4ff;

    .title-icon {
      font-size: 18px;
    }
  }

  .back-btn {
    background: transparent;
    border: 1px solid rgba(0, 212, 255, 0.3);
    color: #94a3b8;

    &:hover {
      border-color: #00d4ff;
      color: #00d4ff;
    }
  }
}

.id-badge {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 4px;
  color: #00d4ff;
  font-family: monospace;
  font-size: 12px;
}

.pet-code {
  color: #fff;
  font-weight: 500;
}

.amount-text {
  color: #f59e0b;
  font-weight: 600;
}

.amount-raised {
  color: #10b981;
  font-weight: 600;
}

.media-preview {
  display: flex;
  justify-content: center;
  align-items: center;

  .detail-image {
    width: 200px;
    height: 200px;
    border-radius: 8px;
    border: 1px solid rgba(0, 212, 255, 0.3);
  }

  .media-icon {
    font-size: 48px;
    color: #00d4ff;
  }
}

:deep(.el-descriptions__label) {
  background: rgba(0, 212, 255, 0.05);
  color: #00d4ff;
}

:deep(.el-descriptions__content) {
  color: #94a3b8;
}

.tech-dialog {
  :deep(.el-dialog) {
    background: #111936;
    border: 1px solid rgba(0, 212, 255, 0.3);
    border-radius: 12px;
  }

  :deep(.el-dialog__header) {
    background: rgba(0, 212, 255, 0.05);
    border-bottom: 1px solid rgba(0, 212, 255, 0.1);
    margin-right: 0;
    padding: 16px 20px;
  }

  :deep(.el-dialog__title) {
    color: #00d4ff;
    font-weight: 600;
  }

  :deep(.el-dialog__body) {
    padding: 20px;
  }

  :deep(.el-radio) {
    color: #94a3b8;
  }

  :deep(.el-textarea__inner) {
    background: #1e2746;
    border: 1px solid rgba(0, 212, 255, 0.2);
    color: #fff;

    &::placeholder {
      color: #64748b;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  background: transparent;
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: #94a3b8;

  &:hover {
    border-color: #00d4ff;
    color: #00d4ff;
  }
}

.tech-btn {
  background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
  border: none;
  color: #fff;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
  }
}
</style>
