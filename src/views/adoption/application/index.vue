<template>
  <div class="adoption-application tech-page tech-grid-bg">
    <div class="tech-title">
      <span class="tech-gradient-text">领养申请</span>
    </div>

    <el-card shadow="hover" class="tech-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon">
              <Document />
            </el-icon>
            填写申请信息
          </span>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="140px" class="tech-form">
        <!-- 基础居住条件 -->
        <el-divider content-position="left" class="tech-divider">
          <span class="divider-content">
            <el-icon>
              <HomeFilled />
            </el-icon>
            基础居住条件
          </span>
        </el-divider>

        <div class="form-section">
          <el-form-item label="住房类型" prop="housingType">
            <el-select v-model="form.housingType" placeholder="请选择住房类型" class="tech-select">
              <el-option label="自有房" value="owned" />
              <el-option label="租房" value="rented" />
              <el-option label="宿舍" value="dormitory" />
            </el-select>
          </el-form-item>

          <el-form-item label="是否允许养宠" prop="petAllowed">
            <el-radio-group v-model="form.petAllowed" class="tech-radio">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="封闭阳台/纱窗" prop="hasEnclosedBalcony">
            <el-radio-group v-model="form.hasEnclosedBalcony" class="tech-radio">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="家庭成员同意" prop="familyAgree">
            <el-radio-group v-model="form.familyAgree" class="tech-radio">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="有无过敏情况" prop="hasAllergy">
            <el-radio-group v-model="form.hasAllergy" class="tech-radio">
              <el-radio label="1">有</el-radio>
              <el-radio label="0">无</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <!-- 经济与时间条件 -->
        <el-divider content-position="left" class="tech-divider">
          <span class="divider-content">
            <el-icon>
              <Money />
            </el-icon>
            经济与时间条件
          </span>
        </el-divider>

        <div class="form-section">
          <el-form-item label="工作作息" prop="workSchedule">
            <el-input type="textarea" v-model="form.workSchedule" placeholder="请描述您的日常工作作息" :rows="3"
              class="tech-textarea" />
          </el-form-item>

          <el-form-item label="每天陪伴时间" prop="companionTime">
            <el-select v-model="form.companionTime" placeholder="请选择每天陪伴时间" class="tech-select">
              <el-option label="1小时以下" value="less1" />
              <el-option label="1-3小时" value="1-3" />
              <el-option label="3-6小时" value="3-6" />
              <el-option label="6小时以上" value="more6" />
            </el-select>
          </el-form-item>

          <el-form-item label="了解基础开销" prop="knowBasicCost">
            <el-radio-group v-model="form.knowBasicCost" class="tech-radio">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="承担医疗费用" prop="canAffordMedical">
            <el-radio-group v-model="form.canAffordMedical" class="tech-radio">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <!-- 喂养养护理念 -->
        <el-divider content-position="left" class="tech-divider">
          <span class="divider-content">
            <el-icon>
              <FirstAidKit />
            </el-icon>
            喂养养护理念
          </span>
        </el-divider>

        <div class="form-section">
          <el-form-item label="科学喂养" prop="scientificFeeding">
            <el-radio-group v-model="form.scientificFeeding" class="tech-radio">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="同意绝育/牵引" prop="agreeSterilization">
            <el-radio-group v-model="form.agreeSterilization" class="tech-radio">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="养宠经验" prop="petExperience">
            <el-input type="textarea" v-model="form.petExperience" placeholder="请描述您的养宠经验" :rows="4"
              class="tech-textarea" />
          </el-form-item>
        </div>

        <!-- 长期责任承诺 -->
        <el-divider content-position="left" class="tech-divider">
          <span class="divider-content">
            <el-icon>
              <CircleCheckFilled />
            </el-icon>
            长期责任承诺
          </span>
        </el-divider>

        <div class="form-section">
          <el-form-item label="未来计划" prop="futurePlans">
            <el-input type="textarea" v-model="form.futurePlans" placeholder="请描述您的未来计划及如何安置宠物" :rows="4"
              class="tech-textarea" />
          </el-form-item>

          <el-form-item label="不随意弃养" prop="noAbandon">
            <el-radio-group v-model="form.noAbandon" class="tech-radio">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="接受回访" prop="acceptVisit">
            <el-radio-group v-model="form.acceptVisit" class="tech-radio">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <!-- 智能推荐区域 -->
        <el-divider content-position="left" class="tech-divider">
          <span class="divider-content">
            <el-icon>
              <UserFilled />
            </el-icon>
            智能推荐宠物
          </span>
        </el-divider>

        <div class="form-section">
          <div class="recommend-tips">
            <p>填写您的偏好，系统将为您推荐最合适的宠物</p>
          </div>

          <div class="recommend-form">
            <div class="form-row">
              <div class="form-item">
                <label>宠物类型</label>
                <el-select v-model="recommendForm.preferPetType" placeholder="不限" clearable class="tech-select">
                  <el-option label="不限" :value="null" />
                  <el-option label="猫" :value="1" />
                  <el-option label="狗" :value="2" />
                  <el-option label="兔子" :value="3" />
                  <el-option label="仓鼠" :value="4" />
                  <el-option label="鸟类" :value="5" />
                  <el-option label="其他" :value="6" />
                </el-select>
              </div>
              <div class="form-item">
                <label>品种</label>
                <el-input v-model="recommendForm.preferBreed" placeholder="如：金毛" clearable class="tech-input"
                  style="width: 120px;" />
              </div>
              <div class="form-item">
                <label>性别</label>
                <el-select v-model="recommendForm.preferGender" placeholder="不限" clearable class="tech-select">
                  <el-option label="不限" :value="null" />
                  <el-option label="公" :value="1" />
                  <el-option label="母" :value="0" />
                </el-select>
              </div>
              <div class="form-item">
                <label>年龄</label>
                <el-select v-model="recommendForm.preferAge" placeholder="不限" clearable class="tech-select">
                  <el-option label="不限" :value="0" />
                  <el-option label="幼年" :value="1" />
                  <el-option label="成年" :value="2" />
                  <el-option label="老年" :value="3" />
                </el-select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-item">
                <label>健康状态</label>
                <el-select v-model="recommendForm.preferHealthStatus" placeholder="不限" clearable class="tech-select">
                  <el-option label="不限" :value="null" />
                  <el-option label="健康" :value="1" />
                  <el-option label="需治疗" :value="2" />
                </el-select>
              </div>
              <div class="form-item">
                <label>位置</label>
                <el-input v-model="recommendForm.preferLocation" placeholder="如：成都市" clearable class="tech-input"
                  style="width: 120px;" />
              </div>
              <div class="form-item">
                <el-button type="primary" @click="handleRecommend" :loading="recommendLoading"
                  class="tech-btn recommend-btn">
                  <el-icon v-if="!recommendLoading">
                    <Search />
                  </el-icon>
                  {{ recommendLoading ? '推荐中...' : '立即推荐' }}
                </el-button>
              </div>
            </div>
          </div>

          <!-- 推荐结果展示 -->
          <div v-if="recommendResults.length > 0" class="recommend-results">
            <div class="recommend-header">
              <span>为您找到 {{ recommendResults.length }} 只匹配宠物</span>
            </div>
            <div class="recommend-list">
              <div v-for="pet in recommendResults" :key="pet.petId" class="recommend-item"
                @click="handleSelectPet(pet)">
                <div class="pet-info">
                  <div class="pet-name">{{ pet.petName || pet.name }}</div>
                  <div class="pet-detail">
                    {{ getPetTypeText(pet.petType) }} | {{ pet.breed || '未知品种' }} |
                    {{ pet.gender === 1 ? '公' : '母' }} | {{ pet.age || 0 }}岁
                  </div>
                  <div class="pet-location" v-if="pet.location">
                    <el-icon>
                      <Location />
                    </el-icon> {{ pet.location }}
                  </div>
                </div>
                <div class="match-info">
                  <div class="match-score" :class="getMatchClass(pet.matchScore)">
                    {{ Math.round(pet.matchScore) }}
                  </div>
                  <div class="match-tag">{{ pet.matchTag }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="hasSearched" class="no-results">
            <el-empty description="暂无符合条件的宠物" />
          </div>
        </div>

        <!-- 领养宠物信息 -->
        <el-divider content-position="left" class="tech-divider">
          <span class="divider-content">
            <el-icon>
              <UserFilled />
            </el-icon>
            领养宠物信息
          </span>
        </el-divider>

        <div class="form-section">
          <el-form-item label="选择宠物" prop="releaseId">
            <el-select v-model="form.releaseId" placeholder="请选择要领养的宠物" class="tech-select" @change="handlePetSelect">
              <el-option v-for="pet in petList" :key="pet.petId || pet.id" :label="pet.petName || pet.name || '未知宠物'"
                :value="pet.petId || pet.id" />
            </el-select>
          </el-form-item>
        </div>

        <!-- 其他信息 -->
        <el-divider content-position="left" class="tech-divider">
          <span class="divider-content">
            <el-icon>
              <UserFilled />
            </el-icon>
            其他信息
          </span>
        </el-divider>

        <div class="form-section">
          <el-form-item label="申请人姓名" prop="applicantName">
            <el-input v-model="form.applicantName" placeholder="请输入申请人姓名" class="tech-input">
              <template #prefix>
                <el-icon>
                  <User />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="联系电话" prop="contactPhone">
            <el-input v-model="form.contactPhone" placeholder="请输入联系电话" class="tech-input">
              <template #prefix>
                <el-icon>
                  <Phone />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="居住地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入居住地址" class="tech-input">
              <template #prefix>
                <el-icon>
                  <Location />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="上传证明材料">
            <el-upload class="upload-demo tech-upload" action="#" :on-change="handleFileChange" :auto-upload="false"
              multiple drag>
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                拖拽文件到此处或 <em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  请上传经济情况、居住环境等证明材料
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </div>

        <el-form-item class="form-actions">
          <el-button type="primary" @click="submitForm" class="tech-btn submit-btn">
            <el-icon>
              <Check />
            </el-icon>
            提交申请
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

    <!-- 协议下载和上传 -->
    <el-card shadow="hover" class="tech-card agreement-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon">
              <DocumentChecked />
            </el-icon>
            领养协议
          </span>
        </div>
      </template>

      <div class="agreement-content">
        <div class="agreement-item">
          <div class="agreement-info">
            <el-icon class="agreement-icon">
              <Download />
            </el-icon>
            <div class="agreement-text">
              <h4>下载协议模板</h4>
              <p>下载标准的领养协议模板，打印后手动签署</p>
            </div>
          </div>
          <el-button type="info" @click="downloadAgreement" class="tech-btn download-btn">
            <el-icon>
              <Download />
            </el-icon>
            下载模板
          </el-button>
        </div>

        <el-divider class="tech-divider" />

        <div class="agreement-item">
          <div class="agreement-info">
            <el-icon class="agreement-icon">
              <Upload />
            </el-icon>
            <div class="agreement-text">
              <h4>上传签署协议</h4>
              <p>上传已签署的协议文件（支持图片或PDF格式）</p>
            </div>
          </div>
          <el-upload class="upload-demo tech-upload" action="#" :on-change="handleAgreementUpload" :auto-upload="false"
            accept=".jpg,.jpeg,.png,.pdf">
            <el-button type="primary" class="tech-btn upload-btn">
              <el-icon>
                <Upload />
              </el-icon>
              上传协议
            </el-button>
          </el-upload>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { submitAdoptionApplication, downloadAgreementTemplate, downloadAgreementTemplateMock, recommendPets } from '@/api/adoption/application'
import { listInfo } from '@/api/pet/info'
import {
  Document,
  HomeFilled,
  Money,
  FirstAidKit,
  CircleCheckFilled,
  UserFilled,
  User,
  Phone,
  Location,
  UploadFilled,
  Check,
  RefreshRight,
  DocumentChecked,
  Download,
  Upload,
  Search
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const formRef = ref()
const form = reactive({
  releaseId: '',
  petId: 0,
  housingType: '',
  petAllowed: '',
  hasEnclosedBalcony: '',
  familyAgree: '',
  hasAllergy: '',
  workSchedule: '',
  companionTime: '',
  knowBasicCost: '',
  canAffordMedical: '',
  scientificFeeding: '',
  agreeSterilization: '',
  petExperience: '',
  futurePlans: '',
  noAbandon: '',
  acceptVisit: '',
  applicantName: '',
  contactPhone: '',
  address: '',
  files: []
})

const petList = ref([])

const recommendForm = reactive({
  preferPetType: null,
  preferBreed: '',
  preferGender: null,
  preferAge: 0,
  preferHealthStatus: null,
  preferLocation: ''
})

const recommendResults = ref([])
const recommendLoading = ref(false)
const hasSearched = ref(false)

const handleRecommend = async () => {
  recommendLoading.value = true
  hasSearched.value = true
  try {
    const params = {}
    if (recommendForm.preferPetType) params.preferPetType = recommendForm.preferPetType
    if (recommendForm.preferBreed) params.preferBreed = recommendForm.preferBreed
    if (recommendForm.preferGender !== null) params.preferGender = recommendForm.preferGender
    if (recommendForm.preferAge) params.preferAge = recommendForm.preferAge
    if (recommendForm.preferHealthStatus) params.preferHealthStatus = recommendForm.preferHealthStatus
    if (recommendForm.preferLocation) params.preferLocation = recommendForm.preferLocation

    const response = await recommendPets(params)
    recommendResults.value = response.data || []
  } catch (error) {
    ElMessage.error('获取推荐失败')
    recommendResults.value = []
  } finally {
    recommendLoading.value = false
  }
}

const getPetTypeText = (type) => {
  const typeMap = { 1: '猫', 2: '狗', 3: '兔子', 4: '仓鼠', 5: '鸟类', 6: '其他' }
  return typeMap[type] || '未知'
}

const getMatchClass = (score) => {
  if (score >= 90) return 'perfect'
  if (score >= 75) return 'high'
  if (score >= 60) return 'good'
  if (score >= 40) return 'normal'
  return 'low'
}

const handleSelectPet = (pet) => {
  const petId = pet.petId || pet.id
  if (!petId) {
    ElMessage.warning('无法获取宠物ID')
    return
  }
  form.petId = petId
  form.releaseId = petId
  ElMessage.success(`已选择宠物：${pet.petName || pet.name}`)
  window.scrollTo({ top: 600, behavior: 'smooth' })
}

const loadPetList = async () => {
  try {
    const response = await listInfo({})
    petList.value = response.rows || []
    if (route.query.petId) {
      const petId = parseInt(route.query.petId)
      const selectedPet = petList.value.find(pet => (pet.petId || pet.id) == petId)
      if (selectedPet) {
        form.releaseId = selectedPet.petId || selectedPet.id
        form.petId = petId
      }
    }
  } catch (error) {
    ElMessage.error('获取宠物列表失败')
  }
}

const handlePetSelect = (petId) => {
  form.petId = parseInt(petId)
}

onMounted(() => {
  loadPetList()
})

const rules = {
  releaseId: [{ required: true, message: '请选择要领养的宠物', trigger: 'change' }],
  petId: [{ required: true, message: '请选择要领养的宠物', trigger: 'change' }],
  housingType: [{ required: true, message: '请选择住房类型', trigger: 'change' }],
  petAllowed: [{ required: true, message: '请选择是否允许养宠', trigger: 'change' }],
  hasEnclosedBalcony: [{ required: true, message: '请选择是否有封闭阳台/纱窗', trigger: 'change' }],
  familyAgree: [{ required: true, message: '请选择家庭成员是否同意', trigger: 'change' }],
  workSchedule: [{ required: true, message: '请描述工作作息', trigger: 'blur' }],
  companionTime: [{ required: true, message: '请选择每天陪伴时间', trigger: 'change' }],
  knowBasicCost: [{ required: true, message: '请选择是否了解基础开销', trigger: 'change' }],
  canAffordMedical: [{ required: true, message: '请选择是否能承担医疗费用', trigger: 'change' }],
  scientificFeeding: [{ required: true, message: '请选择是否接受科学喂养', trigger: 'change' }],
  agreeSterilization: [{ required: true, message: '请选择是否同意绝育/牵引', trigger: 'change' }],
  noAbandon: [{ required: true, message: '请选择是否承诺不随意弃养', trigger: 'change' }],
  acceptVisit: [{ required: true, message: '请选择是否接受回访', trigger: 'change' }],
  applicantName: [{ required: true, message: '请输入申请人姓名', trigger: 'blur' }],
  contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  address: [{ required: true, message: '请输入居住地址', trigger: 'blur' }]
}

const handleFileChange = (file) => {
  form.files.push(file)
}

const handleAgreementUpload = (file) => {
  form.agreementFile = file
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 确保整数类型字段是数字
        const formData = {
          ...form,
          petAllowed: parseInt(form.petAllowed) || 0,
          hasEnclosedBalcony: parseInt(form.hasEnclosedBalcony) || 0,
          familyAgree: parseInt(form.familyAgree) || 0,
          hasAllergy: parseInt(form.hasAllergy) || 0,
          knowBasicCost: parseInt(form.knowBasicCost) || 0,
          canAffordMedical: parseInt(form.canAffordMedical) || 0,
          scientificFeeding: parseInt(form.scientificFeeding) || 0,
          agreeSterilization: parseInt(form.agreeSterilization) || 0,
          noAbandon: parseInt(form.noAbandon) || 0,
          acceptVisit: parseInt(form.acceptVisit) || 0,
          applyStatus: 0 // 默认为待审核状态
        }
        const response = await submitAdoptionApplication(formData)
        ElMessage.success('申请提交成功')
        router.push('/adoption/list')
      } catch (error) {
        ElMessage.error('申请提交失败')
      }
    }
  })
}

const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  form.files = []
  form.agreementFile = null
}

const downloadAgreement = async () => {
  try {
    const response = await downloadAgreementTemplate()
    const blob = response
    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '领养协议模板.pdf'
    document.body.appendChild(link)
    link.click()
    // 清理
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }, 100)
  } catch (error) {
    console.error('下载失败:', error)
    ElMessage.error('下载失败，请检查网络连接或登录状态')
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/tech-theme.scss';

.adoption-application {
  min-height: 100vh;
  padding: 24px;
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

.recommend-tips {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;

  p {
    margin: 0;
    color: var(--tech-text-secondary);
    font-size: 14px;
  }
}

.recommend-form {
  margin-bottom: 20px;

  .form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .form-item {
    display: flex;
    align-items: center;
    gap: 8px;

    label {
      font-size: 14px;
      color: var(--tech-text-secondary);
      white-space: nowrap;
    }
  }

  .recommend-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 20px;
    background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
    border: none;
    border-radius: 8px;
    color: #fff;
    font-weight: 500;

    &:hover {
      box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
    }

    .el-icon {
      font-size: 16px;
    }
  }
}

.recommend-results {
  margin-top: 20px;
  border: 1px solid var(--tech-border);
  border-radius: 12px;
  overflow: hidden;

  .recommend-header {
    background: var(--tech-bg-light);
    padding: 12px 16px;
    border-bottom: 1px solid var(--tech-border);
    font-size: 14px;
    color: var(--tech-text-secondary);
  }

  .recommend-list {
    max-height: 400px;
    overflow-y: auto;
  }

  .recommend-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid var(--tech-border);
    cursor: pointer;
    transition: all 0.3s ease;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: var(--tech-bg-hover);
    }

    .pet-info {
      flex: 1;

      .pet-name {
        font-size: 16px;
        font-weight: 600;
        color: var(--tech-text-primary);
        margin-bottom: 4px;
      }

      .pet-detail {
        font-size: 13px;
        color: var(--tech-text-muted);
        margin-bottom: 4px;
      }

      .pet-location {
        font-size: 12px;
        color: var(--tech-text-muted);
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }

    .match-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-left: 16px;

      .match-score {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 700;
        color: #fff;

        &.perfect {
          background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
        }

        &.high {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        &.good {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        &.normal {
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
        }

        &.low {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }
      }

      .match-tag {
        font-size: 12px;
        color: var(--tech-text-muted);
        margin-top: 4px;
      }
    }
  }
}

.no-results {
  padding: 40px 0;
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
      background: #000000;
      border-color: #000000;
    }

    :deep(.el-radio__label) {
      color: var(--tech-text-secondary);
    }
  }
}

.tech-upload {
  :deep(.el-upload-dragger) {
    background: var(--tech-bg-light);
    border: 2px dashed var(--tech-border);
    border-radius: 12px;

    &:hover {
      border-color: var(--tech-primary);
    }

    .el-icon--upload {
      font-size: 48px;
      color: var(--tech-primary);
    }

    .el-upload__text {
      color: var(--tech-text-secondary);

      em {
        color: var(--tech-primary);
      }
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

.agreement-card {
  .agreement-content {
    padding: 16px;
  }

  .agreement-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: var(--tech-bg-light);
    border-radius: 12px;
    border: 1px solid var(--tech-border);

    .agreement-info {
      display: flex;
      align-items: center;
      gap: 16px;

      .agreement-icon {
        font-size: 32px;
        color: var(--tech-primary);
      }

      .agreement-text {
        h4 {
          margin: 0 0 4px 0;
          color: var(--tech-text-primary);
          font-size: 16px;
        }

        p {
          margin: 0;
          color: var(--tech-text-muted);
          font-size: 14px;
        }
      }
    }

    .tech-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;

      &.download-btn {
        background: var(--tech-bg-hover);
        border: 1px solid var(--tech-border);
        color: var(--tech-text-secondary);

        &:hover {
          border-color: var(--tech-primary);
          color: var(--tech-primary);
        }
      }

      &.upload-btn {
        background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
        border: none;

        &:hover {
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .adoption-application {
    padding: 16px;
  }

  .tech-title .tech-gradient-text {
    font-size: 24px;
  }

  .form-section {
    padding: 0;
  }

  .agreement-item {
    flex-direction: column;
    gap: 16px;
    text-align: center;

    .agreement-info {
      flex-direction: column;
    }
  }
}
</style>