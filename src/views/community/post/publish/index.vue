<template>
  <div class="community-publish">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>{{ isEditMode ? '编辑帖子' : '发布帖子' }}</span>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="帖子标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入帖子标题" />
        </el-form-item>

        <el-form-item label="帖子分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择帖子分类">
            <el-option label="养宠经验" value="experience" />
            <el-option label="问题求助" value="help" />
            <el-option label="宠物趣事" value="fun" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>

        <el-form-item label="帖子内容" prop="content">
          <Editor v-model="form.content" style="min-height: 300px" />
        </el-form-item>

        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" placeholder="请输入作者姓名" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">{{ isEditMode ? '更新帖子' : '发布帖子' }}</el-button>
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
import { publishPost, updatePost, getPostDetail } from '@/api/community/post'
import Editor from '@/components/Editor/index.vue'

const router = useRouter()
const route = useRoute()
const formRef = ref()
const isEditMode = computed(() => !!route.query.id)

const form = reactive({
  postId: null,
  title: '',
  category: '',
  content: '',
  author: ''
})

const rules = {
  title: [{ required: true, message: '请输入帖子标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择帖子分类', trigger: 'change' }],
  content: [{ required: true, message: '请输入帖子内容', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者姓名', trigger: 'blur' }]
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const submitData = {
          postId: form.postId,
          title: form.title,
          category: form.category,
          content: form.content,
          author: form.author
        }

        if (isEditMode.value) {
          // 编辑模式
          await updatePost(submitData)
          ElMessage.success('帖子更新成功')
        } else {
          // 新增模式
          await publishPost(submitData)
          ElMessage.success('帖子发布成功')
        }
        router.push('/community/post/list')
      } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error(isEditMode.value ? '帖子更新失败' : '帖子发布失败')
      }
    }
  })
}

const resetForm = () => {
  formRef.value?.resetFields()
  form.title = ''
  form.category = ''
  form.content = ''
  form.author = ''
}

const goBack = () => {
  router.push('/community/post/list')
}

// 加载帖子详情（编辑模式）
const loadPostDetail = async () => {
  if (isEditMode.value && route.query.id) {
    try {
      const response = await getPostDetail(route.query.id)
      const postData = response.data || response
      form.postId = postData.postId
      form.title = postData.title
      form.category = postData.category
      form.content = postData.content
      form.author = postData.author
    } catch (error) {
      ElMessage.error('加载帖子详情失败')
      router.push('/community/post/list')
    }
  }
}

onMounted(() => {
  loadPostDetail()
})
</script>

<style scoped>
.community-publish {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>