<template>
  <div class="donation-application tech-page tech-grid-bg">
    <div class="tech-title">
      <span class="tech-gradient-text">物品捐赠</span>
    </div>

    <el-card shadow="hover" class="tech-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon">
              <Present />
            </el-icon>
            填写捐赠信息
          </span>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="140px" class="tech-form">
        <!-- 捐赠人信息 -->
        <el-divider content-position="left" class="tech-divider">
          <span class="divider-content">
            <el-icon>
              <UserFilled />
            </el-icon>
            捐赠人信息
          </span>
        </el-divider>

        <div class="form-section">
          <el-form-item label="捐赠人姓名" prop="donorName">
            <el-input v-model="form.donorName" placeholder="请输入捐赠人姓名" class="tech-input" style="width: 280px;">
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

          <el-form-item label="捐赠类型" prop="donationType">
            <el-select v-model="form.donationType" placeholder="请选择捐赠类型" class="tech-select">
              <el-option label="食品" value="food">
                <el-icon class="option-icon">
                  <Food />
                </el-icon>
                食品
              </el-option>
              <el-option label="用品" value="supplies">
                <el-icon class="option-icon">
                  <Box />
                </el-icon>
                用品
              </el-option>
              <el-option label="药品" value="medicine">
                <el-icon class="option-icon">
                  <FirstAidKit />
                </el-icon>
                药品
              </el-option>
              <el-option label="其他" value="other">
                <el-icon class="option-icon">
                  <More />
                </el-icon>
                其他
              </el-option>
            </el-select>
          </el-form-item>
        </div>

        <!-- 捐赠物品 -->
        <el-divider content-position="left" class="tech-divider">
          <span class="divider-content">
            <el-icon>
              <List />
            </el-icon>
            捐赠物品清单
          </span>
        </el-divider>

        <div class="form-section">
          <div class="add-item-wrapper">
            <el-button type="primary" class="tech-btn add-btn" @click="addItem">
              <el-icon>
                <Plus />
              </el-icon>
              添加物品
            </el-button>
          </div>
          <el-table :data="form.items" class="tech-table donation-table" stripe>
            <el-table-column prop="name" label="物品名称" width="180">
              <template #default="scope">
                <el-input v-model="scope.row.name" placeholder="请输入物品名称" class="table-input" style="width: 160px;" />
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="120">
              <template #default="scope">
                <el-input v-model.number="scope.row.quantity" placeholder="数量" type="number" class="table-input" />
              </template>
            </el-table-column>
            <el-table-column prop="unit" label="单位" width="100">
              <template #default="scope">
                <el-input v-model="scope.row.unit" placeholder="单位" class="table-input" />
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" width="200">
              <template #default="scope">
                <el-input v-model="scope.row.description" placeholder="请输入描述" class="table-input"
                  style="width: 180px;" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="scope">
                <el-button type="danger" size="small" class="delete-btn" @click="removeItem(scope.$index)">
                  <el-icon>
                    <Delete />
                  </el-icon>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 捐赠方式 -->
        <el-divider content-position="left" class="tech-divider">
          <span class="divider-content">
            <el-icon>
              <Location />
            </el-icon>
            捐赠方式
          </span>
        </el-divider>

        <div class="form-section">
          <el-form-item label="捐赠方式" prop="donationMethod">
            <el-radio-group v-model="form.donationMethod" class="tech-radio">
              <el-radio label="现场捐赠">
                <el-icon>
                  <OfficeBuilding />
                </el-icon>
                现场捐赠
              </el-radio>
              <el-radio label="快递捐赠">
                <el-icon>
                  <Van />
                </el-icon>
                快递捐赠
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="捐赠地址" prop="donationAddress" v-if="form.donationMethod === '现场捐赠'">
            <el-input v-model="form.donationAddress" placeholder="请输入捐赠地址" class="tech-input" style="width: 400px;">
              <template #prefix>
                <el-icon>
                  <MapLocation />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="快递地址" prop="shippingAddress" v-if="form.donationMethod === '快递捐赠'">
            <el-input v-model="form.shippingAddress" placeholder="请输入快递地址" class="tech-input" style="width: 400px;">
              <template #prefix>
                <el-icon>
                  <MapLocation />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="捐赠时间" prop="donationTime">
            <el-date-picker v-model="form.donationTime" type="datetime" placeholder="请选择捐赠时间" class="tech-date-picker"
              :prefix-icon="Calendar" />
          </el-form-item>
        </div>

        <!-- 备注信息 -->
        <el-divider content-position="left" class="tech-divider">
          <span class="divider-content">
            <el-icon>
              <ChatDotRound />
            </el-icon>
            备注信息
          </span>
        </el-divider>

        <div class="form-section">
          <el-form-item label="备注" prop="remarks">
            <el-input type="textarea" v-model="form.remarks" placeholder="请输入备注信息" :rows="3" class="tech-textarea"
              style="width: 500px;" />
          </el-form-item>
        </div>

        <el-form-item class="form-actions">
          <el-button type="primary" @click="submitForm" class="tech-btn submit-btn">
            <el-icon>
              <Check />
            </el-icon>
            提交捐赠
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

    <!-- 捐赠说明卡片 -->
    <el-card shadow="hover" class="tech-card info-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon">
              <InfoFilled />
            </el-icon>
            捐赠说明
          </span>
        </div>
      </template>

      <div class="info-content">
        <div class="info-item">
          <el-icon class="info-icon">
            <CircleCheckFilled />
          </el-icon>
          <div class="info-text">
            <h4>食品捐赠</h4>
            <p>接受宠物食品、零食等，请确保在保质期内</p>
          </div>
        </div>

        <div class="info-item">
          <el-icon class="info-icon">
            <CircleCheckFilled />
          </el-icon>
          <div class="info-text">
            <h4>用品捐赠</h4>
            <p>接受宠物窝、玩具、牵引绳、食盆等用品</p>
          </div>
        </div>

        <div class="info-item">
          <el-icon class="info-icon">
            <CircleCheckFilled />
          </el-icon>
          <div class="info-text">
            <h4>药品捐赠</h4>
            <p>接受宠物药品、疫苗等，请提供相关说明</p>
          </div>
        </div>

        <div class="info-item">
          <el-icon class="info-icon">
            <WarningFilled />
          </el-icon>
          <div class="info-text">
            <h4>注意事项</h4>
            <p>请确保捐赠物品干净整洁，食品在保质期内</p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { submitDonationApplication } from '@/api/donation/application'
import {
  Present,
  UserFilled,
  User,
  Phone,
  Food,
  Box,
  FirstAidKit,
  More,
  List,
  Delete,
  Plus,
  Location,
  OfficeBuilding,
  Van,
  MapLocation,
  Calendar,
  ChatDotRound,
  InfoFilled,
  CircleCheckFilled,
  WarningFilled,
  Check,
  RefreshRight
} from '@element-plus/icons-vue'

const router = useRouter()
const formRef = ref()
const form = reactive({
  donorName: '',
  contactPhone: '',
  donationType: '',
  items: [{
    name: '',
    quantity: 1,
    unit: '',
    description: ''
  }],
  donationMethod: '现场捐赠',
  donationAddress: '',
  shippingAddress: '',
  donationTime: new Date(),
  remarks: ''
})

const rules = {
  donorName: [{ required: true, message: '请输入捐赠人姓名', trigger: 'blur' }],
  contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  donationType: [{ required: true, message: '请选择捐赠类型', trigger: 'change' }],
  donationMethod: [{ required: true, message: '请选择捐赠方式', trigger: 'change' }],
  donationAddress: [{ required: true, message: '请输入捐赠地址', trigger: 'blur' }],
  donationTime: [{ required: true, message: '请选择捐赠时间', trigger: 'change' }]
}

const addItem = () => {
  form.items.push({
    name: '',
    quantity: 1,
    unit: '',
    description: ''
  })
}

const removeItem = (index) => {
  form.items.splice(index, 1)
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const donationData = {
          ...form,
          donationType: 'material',
          itemType: form.donationType
        }
        const response = await submitDonationApplication(donationData)
        ElMessage.success('捐赠提交成功')
        router.push('/donation/list')
      } catch (error) {
        ElMessage.error('捐赠提交失败')
      }
    }
  })
}

const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  form.items = [{
    name: '',
    quantity: 1,
    unit: '',
    description: ''
  }]
  form.donationMethod = '现场捐赠'
  form.donationTime = new Date()
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/tech-theme.scss';

.donation-application {
  min-height: 100vh;
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
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

.tech-divider {
  margin: 32px 0 24px 0;

  .divider-content {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: var(--tech-primary);

    .el-icon {
      font-size: 18px;
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
  .tech-textarea,
  .tech-date-picker {

    :deep(.el-input__wrapper),
    :deep(.el-textarea__inner),
    :deep(.el-input__wrapper) {
      background: var(--tech-bg-light);
      border: 1px solid var(--tech-border);
      border-radius: 8px;
      color: var(--tech-text-primary);

      &:focus {
        border-color: var(--tech-primary);
        box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
      }
    }

    :deep(.el-input__prefix) {
      color: var(--tech-primary);
    }
  }

  .tech-radio {
    :deep(.el-radio__input.is-checked .el-radio__inner) {
      background: var(--tech-primary);
      border-color: var(--tech-primary);
    }

    :deep(.el-radio__label) {
      color: var(--tech-text-secondary);
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
}

.donation-table {
  margin-bottom: 16px;
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

  .table-input {
    :deep(.el-input__wrapper) {
      background: var(--tech-bg-dark);
      border: 1px solid var(--tech-border);

      &:focus {
        border-color: var(--tech-primary);
      }
    }
  }

  .delete-btn {
    background: rgba(239, 68, 68, 0.2);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;

    &:hover {
      background: rgba(239, 68, 68, 0.3);
      border-color: #ef4444;
    }
  }
}

.add-item-wrapper {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 16px;

  .add-btn {
    background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
    border: none;
    padding: 10px 24px;

    &:hover {
      box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
    }
  }
}

.form-actions {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--tech-border);

  .submit-btn {
    background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
    border: none;
    padding: 12px 32px;
    font-size: 16px;
    font-weight: 600;

    &:hover {
      box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
    }
  }

  .reset-btn {
    background: transparent;
    border: 1px solid var(--tech-border);
    color: var(--tech-text-secondary);
    padding: 12px 24px;

    &:hover {
      border-color: var(--tech-primary);
      color: var(--tech-primary);
    }
  }
}

.info-card {
  .info-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
    padding: 16px;
  }

  .info-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    background: var(--tech-bg-light);
    border-radius: 12px;
    border: 1px solid var(--tech-border);
    transition: all 0.3s ease;

    &:hover {
      border-color: var(--tech-border-glow);
      transform: translateY(-2px);
    }

    .info-icon {
      font-size: 24px;
      color: var(--tech-primary);
      flex-shrink: 0;
    }

    .info-text {
      h4 {
        margin: 0 0 4px 0;
        color: var(--tech-text-primary);
        font-size: 15px;
        font-weight: 600;
      }

      p {
        margin: 0;
        color: var(--tech-text-muted);
        font-size: 13px;
        line-height: 1.5;
      }
    }
  }
}

.option-icon {
  margin-right: 8px;
  vertical-align: middle;
}

@media (max-width: 768px) {
  .donation-application {
    padding: 16px;
  }

  .tech-title .tech-gradient-text {
    font-size: 24px;
  }

  .form-section {
    padding: 0;
  }

  .donation-table {
    :deep(.el-table__body-wrapper) {
      overflow-x: auto;
    }
  }

  .info-content {
    grid-template-columns: 1fr;
  }
}
</style>