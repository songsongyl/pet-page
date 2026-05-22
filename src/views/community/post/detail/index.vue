<template>
  <div class="community-detail">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>帖子详情</span>
          <div class="header-actions">
            <el-button v-if="canEdit" type="success" @click="handleEdit" :icon="'Edit'">编辑</el-button>
            <el-button v-if="canDelete" type="danger" @click="handleDelete" :icon="'Delete'">删除</el-button>
            <el-button type="primary" @click="goBack">返回列表</el-button>
          </div>
        </div>
      </template>

      <div class="post-content">
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="post-meta">
          <span class="post-author">作者：{{ post.author }}</span>
          <span class="post-time">{{ post.createTime }}</span>
          <el-tag size="small">{{ getCategoryText(post.category) }}</el-tag>
        </div>
        <div class="post-body" v-html="post.content"></div>
        <div class="post-actions">
          <el-button type="primary" @click="handleLike" :icon="isLiked ? 'StarFilled' : 'Star'">
            {{ isLiked ? '已点赞' : '点赞' }} ({{ post.likeCount || 0 }})
          </el-button>
          <el-button type="default" @click="handleCollect" :icon="isCollected ? 'CollectionFilled' : 'Collection'">
            {{ isCollected ? '已收藏' : '收藏' }} ({{ post.collectCount || 0 }})
          </el-button>
          <el-button type="default" @click="showCommentInput = !showCommentInput" :icon="'ChatDotRound'">
            评论 ({{ post.commentCount || 0 }})
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
import { getPostDetail, likePost, commentPost, getPostComments, collectPost, addPostViewCount, deletePost } from '@/api/community/post'
import useUserStore from '@/store/modules/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const post = ref({})
const comments = ref([])
const isLiked = ref(false)
const isCollected = ref(false)
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

const getCategoryText = (category) => {
  switch (category) {
    case 'experience': return '养宠经验'
    case 'help': return '问题求助'
    case 'fun': return '宠物趣事'
    case 'other': return '其他'
    default: return category
  }
}

const loadPostDetail = async () => {
  try {
    const response = await getPostDetail(route.params.postId)
    post.value = response.data || response
    // 更新浏览次数（前端+后端同步）
    post.value.viewCount = (post.value.viewCount || 0) + 1
    addPostViewCount(route.params.postId).catch(() => {
      // 忽略错误
    })
  } catch (error) {
    ElMessage.error('获取帖子详情失败')
  }
}

const loadComments = async () => {
  try {
    if (!route.params.postId) {
      ElMessage.error('缺少帖子ID参数')
      return
    }
    const response = await getPostComments(route.params.postId, {
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
    console.error('获取评论失败:', error)
    ElMessage.error('获取评论失败')
  }
}

const handleLike = async () => {
  try {
    if (!route.params.postId) {
      ElMessage.error('缺少帖子ID参数')
      return
    }
    if (isLiked.value) {
      ElMessage.warning('您已经点赞过此帖子')
      return
    }
    await likePost(route.params.postId)
    isLiked.value = true
    post.value.likeCount = (post.value.likeCount || 0) + 1
    ElMessage.success('点赞成功')
  } catch (error) {
    console.error('点赞失败:', error)
    ElMessage.error('操作失败')
  }
}

const handleCollect = async () => {
  try {
    if (!route.params.postId) {
      ElMessage.error('缺少帖子ID参数')
      return
    }
    if (isCollected.value) {
      ElMessage.warning('您已经收藏过此帖子')
      return
    }
    await collectPost(route.params.postId)
    isCollected.value = true
    post.value.collectCount = (post.value.collectCount || 0) + 1
    ElMessage.success('收藏成功')
  } catch (error) {
    console.error('收藏失败:', error)
    ElMessage.error('操作失败')
  }
}

const submitComment = async () => {
  if (!commentFormRef.value) return
  await commentFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (!route.params.postId) {
          ElMessage.error('缺少帖子ID参数')
          return
        }
        const response = await commentPost(route.params.postId, commentForm)
        console.log('Comment response:', response)
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
        post.value.commentCount = (post.value.commentCount || 0) + 1
      } catch (error) {
        console.error('评论失败:', error)
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
  router.push('/community/post/list')
}

// 判断是否可以编辑（管理员或作者本人）
const canEdit = computed(() => {
  return userStore.roleId === 1 || post.value.authorId === userStore.id
})

// 判断是否可以删除（管理员或作者本人）
const canDelete = computed(() => {
  return userStore.roleId === 1 || post.value.authorId === userStore.id
})

// 编辑帖子
const handleEdit = () => {
  router.push({
    path: '/community/post/publish',
    query: { id: post.value.postId }
  })
}

// 删除帖子
const handleDelete = () => {
  ElMessageBox.confirm(
    `确定要删除帖子"${post.value.title}"吗？此操作不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deletePost(post.value.postId)
      ElMessage.success('删除成功')
      router.push('/community/post/list')
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

onMounted(() => {
  loadPostDetail()
  loadComments()
})

// 组件被激活时刷新数据（keep-alive缓存时使用）
onActivated(() => {
  loadPostDetail()
  loadComments()
})
</script>

<style scoped>
.community-detail {
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

.post-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.post-meta {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  color: #999;
  align-items: center;
}

.post-body {
  line-height: 1.8;
  color: #333;
  margin-bottom: 30px;
}

.post-actions {
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