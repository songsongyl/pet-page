<template>
  <div class="story-detail">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>故事详情</span>
          <div class="header-actions">
            <el-button v-if="canEdit" type="success" @click="handleEdit" :icon="'Edit'">编辑</el-button>
            <el-button v-if="canDelete" type="danger" @click="handleDelete" :icon="'Delete'">删除</el-button>
            <el-button type="primary" @click="goBack">返回列表</el-button>
          </div>
        </div>
      </template>

      <div class="story-content">
        <h1 class="story-title">{{ story.title }}</h1>
        <div class="story-meta">
          <span class="story-author">作者：{{ story.author }}</span>
          <span class="story-time">{{ story.createTime }}</span>
        </div>
        <el-image v-if="story.coverImage" :src="story.coverImage" fit="contain" class="story-cover"
          preview-src-list="[story.coverImage]" :preview-teleported="true" />
        <div class="story-body" v-html="story.content"></div>
        <div class="story-actions">
          <el-button type="primary" @click="handleLike" :icon="isLiked ? 'StarFilled' : 'Star'">
            {{ isLiked ? '已点赞' : '点赞' }} ({{ story.likeCount || 0 }})
          </el-button>
          <el-button type="default" @click="showCommentInput = !showCommentInput" :icon="'ChatDotRound'">
            评论 ({{ story.commentCount || 0 }})
          </el-button>
        </div>
      </div>

      <!-- 评论输入 -->
      <div v-if="showCommentInput" class="comment-input">
        <el-form :model="commentForm" :rules="commentRules" ref="commentFormRef">
          <el-form-item prop="content">
            <el-input type="textarea" v-model="commentForm.content" placeholder="请输入评论内容" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitComment">提交评论</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 评论列表 -->
      <el-divider content-position="left">评论</el-divider>
      <div class="comment-list">
        <div v-if="comments.length === 0" class="no-comments">暂无评论</div>
        <el-card v-for="comment in comments" :key="comment.id" shadow="hover" class="comment-item">
          <div class="comment-header">
            <span class="comment-author">{{ comment.author }}</span>
            <span class="comment-time">{{ comment.createTime }}</span>
          </div>
          <div class="comment-content">{{ comment.content }}</div>
        </el-card>
      </div>

      <el-pagination v-if="comments.length > 0" v-model:current-page="commentPagination.current"
        v-model:page-size="commentPagination.size" :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper" :total="commentPagination.total"
        @size-change="handleCommentSizeChange" @current-change="handleCommentCurrentChange" style="margin-top: 20px" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onActivated, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { getStoryDetail, likeStory, commentStory, getStoryComments, addStoryViewCount, deleteStory } from '@/api/story/story'
import useUserStore from '@/store/modules/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const story = ref({})
const comments = ref([])
const isLiked = ref(false)
const showCommentInput = ref(false)
const commentForm = reactive({ content: '' })
const commentFormRef = ref()
const commentPagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const commentRules = {
  content: [{ required: true, message: '请输入评论内容', trigger: 'blur' }]
}

const loadStoryDetail = async () => {
  try {
    console.log('Route params:', route.params)
    console.log('Story ID:', route.params.storyId)
    if (!route.params.storyId) {
      ElMessage.error('缺少故事ID参数')
      return
    }
    const response = await getStoryDetail(route.params.storyId)
    console.log('API response:', response)
    story.value = response.data || response
    // 更新浏览次数（前端+后端同步）
    story.value.viewCount = (story.value.viewCount || 0) + 1
    addStoryViewCount(route.params.storyId).catch(() => {
      // 忽略错误
    })
  } catch (error) {
    ElMessage.error('获取故事详情失败')
  }
}

const loadComments = async () => {
  try {
    if (!route.params.storyId) {
      ElMessage.error('缺少故事ID参数')
      return
    }
    const response = await getStoryComments(route.params.storyId, {
      pageNum: commentPagination.current,
      pageSize: commentPagination.size
    })
    console.log('Comments response:', response)
    // 处理后端返回的数据结构
    if (Array.isArray(response.data)) {
      // 后端直接返回评论列表
      comments.value = response.data
      commentPagination.total = response.data.length
    } else if (response.data && response.data.rows) {
      // 后端返回分页数据
      comments.value = response.data.rows
      commentPagination.total = response.data.total || 0
    } else {
      comments.value = []
      commentPagination.total = 0
    }
  } catch (error) {
    ElMessage.error('获取评论失败')
  }
}

const handleLike = async () => {
  try {
    if (!route.params.storyId) {
      ElMessage.error('缺少故事ID参数')
      return
    }
    if (isLiked.value) {
      ElMessage.warning('您已经点赞过此故事')
      return
    }
    await likeStory(route.params.storyId)
    isLiked.value = true
    story.value.likeCount = (story.value.likeCount || 0) + 1
    ElMessage.success('点赞成功')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const submitComment = async () => {
  if (!commentFormRef.value) return
  await commentFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (!route.params.storyId) {
          ElMessage.error('缺少故事ID参数')
          return
        }
        await commentStory(route.params.storyId, commentForm)
        ElMessage.success('评论成功')

        // 添加新评论到列表开头
        const newComment = {
          id: Date.now(),
          content: commentForm.content,
          author: '我',
          createTime: new Date().toLocaleString()
        }
        comments.value.unshift(newComment)
        commentPagination.total++

        showCommentInput.value = false
        commentForm.content = ''
        story.value.commentCount = (story.value.commentCount || 0) + 1
      } catch (error) {
        ElMessage.error('评论失败')
      }
    }
  })
}

const handleCommentSizeChange = (size) => {
  commentPagination.size = size
  loadComments()
}

const handleCommentCurrentChange = (current) => {
  commentPagination.current = current
  loadComments()
}

const goBack = () => {
  router.push('/story/list')
}

// 判断是否可以编辑（管理员或作者本人）
const canEdit = computed(() => {
  return userStore.roleId === 1 || story.value.authorId === userStore.id
})

// 判断是否可以删除（管理员或作者本人）
const canDelete = computed(() => {
  return userStore.roleId === 1 || story.value.authorId === userStore.id
})

// 编辑故事
const handleEdit = () => {
  router.push({
    path: '/story/publish',
    query: { id: story.value.storyId }
  })
}

// 删除故事
const handleDelete = () => {
  ElMessageBox.confirm(
    `确定要删除故事"${story.value.title}"吗？此操作不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteStory(story.value.storyId)
      ElMessage.success('删除成功')
      router.push('/story/list')
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

onMounted(() => {
  loadStoryDetail()
  loadComments()
})

// 组件被激活时刷新数据（keep-alive缓存时使用）
onActivated(() => {
  loadStoryDetail()
  loadComments()
})
</script>

<style scoped>
.story-detail {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.story-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.story-meta {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  color: #999;
}

.story-cover {
  width: 100%;
  height: auto;
  max-width: 100%;
  object-fit: contain;
  margin-bottom: 20px;
  background-color: #f5f5f5;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.story-body {
  line-height: 1.8;
  color: #333;
  margin-bottom: 30px;
}

.story-actions {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.comment-input {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.comment-item {
  margin-bottom: 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.comment-author {
  font-weight: bold;
}

.comment-time {
  color: #999;
  font-size: 14px;
}

.no-comments {
  text-align: center;
  color: #999;
  padding: 40px;
}
</style>