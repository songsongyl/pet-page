<template>
  <div class="give-add-page">
    <div class="tech-title">
      <span class="tech-gradient-text">添加救助信息</span>
      <span class="tech-subtitle">添加新的流浪宝贝救助信息</span>
    </div>
    <el-card shadow="hover" class="tech-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="宠物名称" prop="petName">
          <el-input v-model="form.petName" placeholder="请输入宠物名称" />
        </el-form-item>
        <el-form-item label="宠物类型" prop="petType">
          <el-select v-model="form.petType" placeholder="请选择宠物类型">
            <el-option label="狗" value="dog" />
            <el-option label="猫" value="cat" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="救助地点" prop="rescueLocation">
          <el-input v-model="form.rescueLocation" placeholder="请输入救助地点" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const formRef = ref()
const form = reactive({
  petName: '',
  petType: '',
  rescueLocation: ''
})

const rules = {
  petName: [{ required: true, message: '请输入宠物名称', trigger: 'blur' }],
  petType: [{ required: true, message: '请选择宠物类型', trigger: 'change' }],
  rescueLocation: [{ required: true, message: '请输入救助地点', trigger: 'blur' }]
}

function submitForm() {
  formRef.value.validate(valid => {
    if (valid) {
      alert('提交成功')
    }
  })
}

function cancel() {
  window.history.back()
}
</script>

<style scoped>
.give-add-page {
  padding: 24px;
  min-height: calc(100vh - 84px);
  background: #ffffff;
}

.tech-title {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
  
  .tech-gradient-text {
    font-size: 32px;
    font-weight: 700;
    color: #333333;
    display: block;
    margin-bottom: 8px;
  }
  
  .tech-subtitle {
    font-size: 14px;
    color: #666666;
    font-weight: 400;
  }
}

.tech-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
</style>