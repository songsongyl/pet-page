<template>
  <div class="fund-donation tech-page tech-grid-bg">
    <div class="tech-title">
      <span class="tech-gradient-text">资金捐助</span>
      <span class="tech-subtitle">为流浪动物救助贡献一份爱心</span>
    </div>

    <!-- 捐助统计卡片 -->
    <div class="stats-grid">
      <el-card class="tech-card stat-card">
        <div class="stat-content">
          <div class="stat-icon primary">
            <el-icon>
              <Wallet />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">¥{{ animatedTotalAmount }}</div>
            <div class="stat-label">累计捐助金额</div>
          </div>
        </div>
      </el-card>

      <el-card class="tech-card stat-card">
        <div class="stat-content">
          <div class="stat-icon success">
            <el-icon>
              <UserFilled />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ animatedDonorCount }}</div>
            <div class="stat-label">捐助人数</div>
          </div>
        </div>
      </el-card>

      <el-card class="tech-card stat-card">
        <div class="stat-content">
          <div class="stat-icon warning">
            <el-icon>
              <Star />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ animatedProjectCount }}</div>
            <div class="stat-label">支持项目数</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 捐助表单 -->
    <el-card shadow="hover" class="tech-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon">
              <CreditCard />
            </el-icon>
            在线捐助
          </span>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="tech-form">
        <div class="form-section">
          <el-form-item label="捐助金额" prop="amount">
            <div class="amount-input-wrapper">
              <el-input v-model.number="form.amount" type="number" placeholder="请输入捐助金额" class="tech-input amount-input"
                :min="1">
                <template #prefix>
                  <span class="amount-prefix">¥</span>
                </template>
              </el-input>
              <div class="quick-amounts">
                <el-button v-for="amount in quickAmounts" :key="amount" type="default" size="small"
                  :class="{ 'active': form.amount === amount }" @click="form.amount = amount">
                  ¥{{ amount }}
                </el-button>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="捐助项目" prop="projectId">
            <el-select v-model="form.projectId" placeholder="请选择捐助项目" class="tech-select">
              <el-option v-for="project in projects" :key="project.id" :label="project.name" :value="project.id">
                <span class="option-label">{{ project.name }}</span>
                <span class="option-progress">目标: ¥{{ project.targetAmount }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="捐赠方式" prop="donationMethod">
            <el-radio-group v-model="form.donationMethod" class="tech-radio">
              <el-radio label="cash">
                <el-icon>
                  <CreditCard />
                </el-icon>
                现金
              </el-radio>
              <el-radio label="scan">
                <el-icon>
                  <Wallet />
                </el-icon>
                扫码支付
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="支付方式" prop="paymentMethod" v-if="form.donationMethod === 'scan'">
            <el-radio-group v-model="form.paymentMethod" class="tech-radio">
              <el-radio label="wechat">
                <el-icon>
                  <Message />
                </el-icon>
                微信支付
              </el-radio>
              <el-radio label="alipay">
                <el-icon>
                  <Wallet />
                </el-icon>
                支付宝
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="捐助者姓名" prop="donorName">
            <el-input v-model="form.donorName" placeholder="请输入您的姓名" class="tech-input" style="width: 280px;">
              <template #prefix>
                <el-icon>
                  <User />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="联系电话" prop="contactPhone">
            <el-input v-model="form.contactPhone" placeholder="请输入联系电话" class="tech-input" style="width: 280px;">
              <template #prefix>
                <el-icon>
                  <Phone />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="联系地址" prop="donationAddress" v-if="form.donationMethod === 'cash'">
            <el-input v-model="form.donationAddress" placeholder="请输入联系地址（方便我们联系您收取现金）" class="tech-input">
              <template #prefix>
                <el-icon>
                  <MapLocation />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="留言备注" prop="remarks">
            <el-input type="textarea" v-model="form.remarks" placeholder="想说点什么..." :rows="3" class="tech-textarea"
              style="width: 500px;" />
          </el-form-item>
        </div>

        <el-form-item class="form-actions">
          <el-button type="primary" @click="submitDonation" class="tech-btn submit-btn">
            <el-icon>
              <Star />
            </el-icon>
            确认捐助
          </el-button>
          <el-button @click="resetForm" class="reset-btn">
            <el-icon>
              <RefreshRight />
            </el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 捐助记录 -->
    <el-card shadow="hover" class="tech-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon">
              <Clock />
            </el-icon>
            最近捐助记录
          </span>
        </div>
      </template>

      <el-table :data="donationRecords" class="tech-table" stripe>
        <el-table-column prop="donorName" label="捐助者" width="120" />
        <el-table-column prop="amount" label="捐助金额" width="120">
          <template #default="scope">
            <span class="amount-value">¥{{ scope.row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="projectName" label="捐助项目" width="180" />
        <el-table-column prop="createTime" label="捐助时间" width="160" />
        <el-table-column prop="remarks" label="留言" min-width="200" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Wallet,
  UserFilled,
  Star,
  CreditCard,
  Message,
  User,
  Phone,
  RefreshRight,
  Clock,
  MapLocation
} from '@element-plus/icons-vue'
import {
  submitFundDonation,
  getFundDonationList
} from '@/api/donation/application'

const formRef = ref()
const form = reactive({
  amount: 50,
  projectId: '',
  donationMethod: 'scan',
  paymentMethod: 'wechat',
  donorName: '',
  contactPhone: '',
  remarks: '',
  donationAddress: ''
})

const quickAmounts = [10, 50, 100, 200, 500]

const rules = {
  amount: [
    { required: true, message: '请输入捐助金额', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value < 1) {
          callback(new Error('捐助金额不能小于1元'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  projectId: [{ required: true, message: '请选择捐助项目', trigger: 'change' }],
  donationMethod: [{ required: true, message: '请选择捐赠方式', trigger: 'change' }],
  paymentMethod: [{
    validator: (rule, value, callback) => {
      if (form.donationMethod === 'scan' && !value) {
        callback(new Error('请选择支付方式'))
      } else {
        callback()
      }
    },
    trigger: 'change'
  }],
  donorName: [{ required: true, message: '请输入捐助者姓名', trigger: 'blur' }],
  contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  donationAddress: [{
    required: true,
    validator: (rule, value, callback) => {
      if (form.donationMethod === 'cash' && !value) {
        callback(new Error('现金捐赠请填写地址'))
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }],

}

const projects = ref([
  { id: 1, name: '流浪猫狗医疗救助', targetAmount: 50000, raisedAmount: 32000 },
  { id: 2, name: '宠物口粮储备计划', targetAmount: 30000, raisedAmount: 18000 },
  { id: 3, name: '宠物绝育手术项目', targetAmount: 25000, raisedAmount: 12000 },
  { id: 4, name: '冬季保暖物资筹集', targetAmount: 15000, raisedAmount: 8500 }
])

const donationRecords = ref([
  { donorName: '爱心人士', amount: 200, projectName: '流浪猫狗医疗救助', createTime: '2024-01-15 14:30', remarks: '希望小动物们健康快乐' },
  { donorName: '小明', amount: 100, projectName: '宠物口粮储备计划', createTime: '2024-01-15 12:15', remarks: '' },
  { donorName: '爱心网友', amount: 500, projectName: '流浪猫狗医疗救助', createTime: '2024-01-14 16:45', remarks: '尽一点绵薄之力' },
  { donorName: '志愿者小李', amount: 50, projectName: '冬季保暖物资筹集', createTime: '2024-01-14 10:20', remarks: '' },
  { donorName: '爱心团体', amount: 1000, projectName: '宠物绝育手术项目', createTime: '2024-01-13 09:00', remarks: '支持公益事业' }
])

const totalAmount = ref(93650)
const donorCount = ref(1256)
const projectCount = ref(4)

const animatedTotalAmount = ref(0)
const animatedDonorCount = ref(0)
const animatedProjectCount = ref(0)

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const animateNumbers = () => {
  const duration = 1500
  const startTime = Date.now()

  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOut = 1 - Math.pow(1 - progress, 3)

    animatedTotalAmount.value = Math.floor(totalAmount.value * easeOut).toLocaleString()
    animatedDonorCount.value = Math.floor(donorCount.value * easeOut)
    animatedProjectCount.value = Math.floor(projectCount.value * easeOut)

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  animate()
}

const submitDonation = async () => {
  if (!formRef.value) return
  try {
    const valid = await formRef.value.validate()
    console.log('表单验证结果:', valid)
    if (valid) {
      const selectedProject = projects.value.find(p => p.id === form.projectId)
      console.log('选中的项目:', selectedProject)
      console.log('表单数据:', form)

      // 正确的提交数据（驼峰命名 + 无语法错误）
      const donationData = {
        donationType: 'money',
        donationAmount: Number(form.amount),
        donationMethod: form.donationMethod,
        payType: form.donationMethod === 'scan' ? form.paymentMethod : '',
        projectName: selectedProject ? selectedProject.name : '',
        donationAddress: form.donationAddress,
        shippingAddress: '',
        donorName: form.donorName || '匿名',
        contactPhone: form.contactPhone || '',
        remarks: form.remarks || '',
        donationStatus: 0,
        donationTime: formatDate(new Date()),
        isDeleted: 0
      }

      console.log('发送的数据:', donationData)
      console.log('donationData 类型:', typeof donationData)
      console.log('donationData 完整JSON:', JSON.stringify(donationData))
      console.log('金额类型:', typeof form.amount, '金额值:', form.amount)

      const response = await submitFundDonation(donationData)
      console.log('收到的响应:', response)

      if (response && response.code === 200) {
        ElMessage.success(`感谢您的爱心捐助！已成功捐助 ¥${form.amount}`)
        resetForm()
        loadData()
      } else {
        ElMessage.error(response?.msg || '捐助失败，请稍后重试')
      }
    }
  } catch (error) {
    console.error('捐助失败:', error)
    console.error('错误详情:', error.response?.data || error.message)
    ElMessage.error(error.response?.data?.msg || '捐助失败，请稍后重试')
  }
}

const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  form.amount = 50
  form.paymentMethod = 'wechat'
}

const loadData = async () => {
  try {
    const params = { donationType: 'money' }
    const recordsRes = await getFundDonationList(params)
    console.log('后端返回数据:', recordsRes)

    if (recordsRes && recordsRes.rows) {
      donationRecords.value = recordsRes.rows.map(item => {
        console.log('原始记录:', item)
        return {
          donorName: item.donorName || item.donor_name || item.donorname || '匿名',
          amount: item.amount || item.donationAmount || 0,
          projectName: item.projectName || item.project_name || item.projectname || item.targetProject || item.target_project || '',
          createTime: item.donationTime || item.donation_time || item.createdTime || item.created_time || item.createTime || '',
          remarks: item.remarks || item.note || ''
        }
      })

      // 计算累计捐赠金额（数据库所有捐赠金额相加）
      totalAmount.value = recordsRes.rows.reduce((sum, item) => {
        const amount = Number(item.amount) || Number(item.donationAmount) || Number(item.donation_amount) || 0
        return sum + amount
      }, 0)

      donorCount.value = recordsRes.rows.length
    }
  } catch (error) {
    console.error('加载数据失败', error)
  }
}

onMounted(() => {
  animateNumbers()
  loadData()
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/tech-theme.scss';

.fund-donation {
  min-height: 100vh;
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
}

.tech-title {
  margin-bottom: 24px;

  .tech-gradient-text {
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #f97316 0%, #ef4444 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: block;
    margin-bottom: 8px;
  }

  .tech-subtitle {
    font-size: 14px;
    color: var(--tech-text-muted);
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
  width: 100%;
}

.stat-card {
  :deep(.el-card) {
    border: none;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(249, 115, 22, 0.08);
    background: linear-gradient(145deg, #ffffff 0%, #fef9f3 100%);
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(249, 115, 22, 0.15);
    }

    .el-card__body {
      padding: 24px;
    }
  }

  .stat-content {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .stat-icon {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex-shrink: 0;

    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border-radius: 16px;
      opacity: 0.3;
      filter: blur(8px);
    }

    &.primary {
      background: linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%);
      color: #f97316;

      &::before {
        background: #f97316;
      }
    }

    &.success {
      background: linear-gradient(135deg, rgba(103, 194, 58, 0.15) 0%, rgba(52, 211, 153, 0.15) 100%);
      color: #67c23a;

      &::before {
        background: #67c23a;
      }
    }

    &.warning {
      background: linear-gradient(135deg, rgba(251, 146, 60, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%);
      color: #fb923c;

      &::before {
        background: #fb923c;
      }
    }

    .el-icon {
      font-size: 32px;
    }
  }

  .stat-info {
    flex: 1;

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 6px;
      letter-spacing: -1px;
    }

    .stat-label {
      font-size: 14px;
      color: #8c8c8c;
      font-weight: 500;
    }
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
  }
}

.form-section {
  padding: 0 16px;
}

.tech-form {
  .el-form-item {
    margin-bottom: 20px;
  }

  .el-form-item__label {
    color: var(--tech-text-secondary);
    font-weight: 500;
  }

  .tech-input,
  .tech-select,
  .tech-textarea {

    :deep(.el-input__wrapper),
    :deep(.el-textarea__inner) {
      background: var(--tech-bg-light);
      border: 1px solid var(--tech-border);
      border-radius: 8px;
      color: var(--tech-text-primary);

      &:focus {
        border-color: #f97316;
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
      }
    }

    :deep(.el-input__prefix) {
      color: #f97316;
    }
  }

  .tech-radio {
    :deep(.el-radio__input.is-checked .el-radio__inner) {
      background: #f97316;
      border-color: #f97316;
    }

    :deep(.el-radio__label) {
      color: var(--tech-text-secondary);
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
}

.amount-input-wrapper {
  .amount-input {
    :deep(.el-input__wrapper) {
      font-size: 20px;
      font-weight: 600;
    }

    .amount-prefix {
      font-size: 20px;
      font-weight: 600;
      color: #f97316;
    }
  }

  .quick-amounts {
    display: flex;
    gap: 8px;
    margin-top: 12px;

    .el-button {
      border: 1px solid var(--tech-border);
      background: var(--tech-bg-light);
      color: var(--tech-text-secondary);

      &.active {
        background: #f97316;
        border-color: #f97316;
        color: white;
      }
    }
  }
}

.form-actions {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--tech-border);

  .submit-btn {
    background: linear-gradient(135deg, #f97316 0%, #ef4444 100%);
    border: none;
    padding: 12px 32px;
    font-size: 16px;
    font-weight: 600;

    &:hover {
      box-shadow: 0 0 20px rgba(249, 115, 22, 0.4);
    }
  }

  .reset-btn {
    background: transparent;
    border: 1px solid var(--tech-border);
    color: var(--tech-text-secondary);
    padding: 12px 24px;

    &:hover {
      border-color: #f97316;
      color: #f97316;
    }
  }
}

.tech-table {
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
    td {
      background: var(--tech-bg-card);
      border-bottom: 1px solid var(--tech-border);
      color: var(--tech-text-secondary);
    }

    tr:hover td {
      background: var(--tech-bg-hover);
    }
  }

  .amount-value {
    color: #f97316;
    font-weight: 600;
  }
}

.option-label {
  display: block;
  font-weight: 500;
}

.option-progress {
  display: block;
  font-size: 12px;
  color: var(--tech-text-muted);
}

@media (max-width: 768px) {
  .fund-donation {
    padding: 16px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .form-section {
    padding: 0;
  }
}
</style>
