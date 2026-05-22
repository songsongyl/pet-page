<template>
  <div class="admin-volunteer-add tech-page tech-grid-bg">
    <div class="tech-title">
      <!-- <span class="tech-gradient-text">添加志愿者</span> -->
      <!-- <span class="tech-subtitle">填写志愿者信息</span> -->
    </div>

    <el-card shadow="hover" class="tech-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon">
              <User />
            </el-icon>
            志愿者信息
          </span>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="志愿者ID" prop="volunteerId">
          <el-input v-model="form.volunteerId" placeholder="请输入志愿者ID" class="tech-input">
            <template #prefix>
              <el-icon>
                <Key />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" class="tech-input">
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" class="tech-input">
            <template #prefix>
              <el-icon>
                <Phone />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" class="tech-input">
            <template #prefix>
              <el-icon>
                <Message />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="技能特长" prop="skills">
          <el-input v-model="form.skills" placeholder="请输入技能特长" class="tech-input">
            <template #prefix>
              <el-icon>
                <Star />
              </el-icon>
            </template>
          </el-input>
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
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { addVolunteer } from '@/api/admin/volunteer'
import { User, Phone, Message, Star, Key } from '@element-plus/icons-vue'

const router = useRouter()
const formRef = ref()
const form = reactive({
  volunteerId: '',
  name: '',
  phone: '',
  email: '',
  skills: '',
  status: 0,
  remarks: ''
})

const rules = {
  volunteerId: [{ required: true, message: '请输入志愿者ID', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await addVolunteer(form)
        ElMessage.success('添加成功')
        router.push('/admin/volunteer')
      } catch (error) {
        ElMessage.error('添加失败')
      }
    }
  })
}

const handleCancel = () => {
  router.push('/admin/volunteer')
}
</script>

<style scoped>
.admin-volunteer-add {
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
</style>