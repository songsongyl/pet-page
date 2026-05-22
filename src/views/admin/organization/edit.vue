<template>
  <div class="admin-organization-edit tech-page tech-grid-bg">
    <div class="tech-title">
      <!-- <span class="tech-gradient-text">编辑合作机构</span> -->
      <!-- <span class="tech-subtitle">修改合作机构信息</span> -->
    </div>

    <el-card shadow="hover" class="tech-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon">
              <Edit />
            </el-icon>
            合作机构信息
          </span>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="机构ID" prop="id" class="hidden">
          <el-input v-model="form.id" readonly class="tech-input" />
        </el-form-item>
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入机构名称" class="tech-input">
            <template #prefix>
              <el-icon>
                <OfficeBuilding />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="营业执照号" prop="licenseNo">
          <template #label>
            <span class="required-label">营业执照号</span>
          </template>
          <el-input v-model="form.licenseNo" placeholder="请输入营业执照号" class="tech-input" />
        </el-form-item>

        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="form.contactPerson" placeholder="请输入联系人" class="tech-input">
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

        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" class="tech-input">
            <template #prefix>
              <el-icon>
                <Location />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" class="tech-select">
            <el-option label="待审核" :value="0" />
            <el-option label="已通过" :value="1" />
            <el-option label="已拒绝" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input type="textarea" v-model="form.remarks" placeholder="请输入备注信息" :rows="4" class="tech-textarea" />
        </el-form-item>

        <el-form-item>
          <div class="form-actions">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { getOrganizationById, updateOrganization } from '@/api/admin/organization'
import { OfficeBuilding, User, Phone, Location, Edit } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const formRef = ref()
const form = reactive({
  id: '',
  name: '',
  licenseNo: '',
  contactPerson: '',
  contactPhone: '',
  address: '',
  status: 0,
  remarks: ''
})

const rules = {
  name: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
  licenseNo: [{ required: true, message: '请输入营业执照号', trigger: 'blur' }],
  contactPerson: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }]
}

const loadData = async () => {
  try {
    const id = route.params.id
    if (!id) {
      ElMessage.error('缺少机构ID参数')
      router.push('/admin/organization')
      return
    }
    // 先设置 form.id 为路由参数 id
    form.id = id
    const response = await getOrganizationById(id)
    // 然后用返回的数据覆盖其他字段，但保留 id
    const { id: responseId, ...restData } = response.data || {}
    Object.assign(form, restData)
  } catch (error) {
    ElMessage.error('获取数据失败')
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  // 检查 ID 是否存在
  if (!form.id) {
    ElMessage.error('缺少机构ID参数')
    return
  }
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await updateOrganization(form)
        ElMessage.success('修改成功')
        router.push('/admin/organization')
      } catch (error) {
        ElMessage.error('修改失败')
      }
    }
  })
}

const handleCancel = () => {
  router.push('/admin/organization')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-organization-edit {
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.required-label::before {
  content: '*';
  color: #ff4d4f;
  margin-right: 4px;
}

.hidden {
  display: none;
}
</style>