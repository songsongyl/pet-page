<template>
  <div class="story-publish">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>{{ isEditMode ? '编辑故事' : '发布故事' }}</span>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="故事标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入故事标题" />
        </el-form-item>

        <el-form-item label="封面图片" prop="coverImage">
          <el-upload class="upload-demo" action="#" :on-change="handleCoverUpload" :auto-upload="false"
            accept="image/*">
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">
                请上传故事封面图片
              </div>
            </template>
          </el-upload>
          <el-image v-if="form.coverImage" :src="form.coverImage" fit="cover"
            style="width: 200px; height: 150px; margin-top: 10px;" />
        </el-form-item>

        <el-form-item label="故事内容" prop="content">
          <Editor v-model="form.content" style="min-height: 300px" />
        </el-form-item>

        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" placeholder="请输入作者姓名" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">{{ isEditMode ? '更新故事' : '发布故事' }}</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { publishStory, updateStory, getStoryDetail } from '@/api/story/story'
import Editor from '@/components/Editor/index.vue'

const router = useRouter()
const route = useRoute()
const formRef = ref()
const isEditMode = computed(() => !!route.query.id)

const form = reactive({
  storyId: null,
  title: '',
  coverImage: '',
  content: '',
  author: ''
})

const rules = {
  title: [{ required: true, message: '请输入故事标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入故事内容', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者姓名', trigger: 'blur' }]
}

const handleCoverUpload = (file) => {
  // 这里应该实现图片上传逻辑，暂时使用本地预览
  const reader = new FileReader()
  reader.onload = (e) => {
    form.coverImage = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const submitData = {
          storyId: form.storyId,
          title: form.title,
          coverImage: form.coverImage,
          content: form.content,
          author: form.author
        }

        if (isEditMode.value) {
          // 编辑模式
          await updateStory(submitData)
          ElMessage.success('故事更新成功')
        } else {
          // 新增模式
          await publishStory(submitData)
          ElMessage.success('故事发布成功')
        }
        router.push('/story/list')
      } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error(isEditMode.value ? '故事更新失败' : '故事发布失败')
      }
    }
  })
}

const resetForm = () => {
  formRef.value?.resetFields()
  form.title = ''
  form.coverImage = ''
  form.content = ''
  form.author = ''
}

const goBack = () => {
  router.push('/story/list')
}

// 加载故事详情（编辑模式）
const loadStoryDetail = async () => {
  if (isEditMode.value && route.query.id) {
    try {
      const response = await getStoryDetail(route.query.id)
      const storyData = response.data || response
      form.storyId = storyData.storyId
      form.title = storyData.title
      form.coverImage = storyData.coverImage
      form.content = storyData.content
      form.author = storyData.author
    } catch (error) {
      ElMessage.error('加载故事详情失败')
      router.push('/story/list')
    }
  }
}

onMounted(() => {
  loadStoryDetail()
})
</script>

<style scoped>
.story-publish {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload-demo {
  margin-bottom: 10px;
}

:deep(.el-form-item__content) {
  width: 100%;
}

:deep(.el-input) {
  width: 100%;
}
</style>