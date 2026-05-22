<template>
  <div class="story-list tech-page tech-grid-bg">
    <div class="tech-title">
      <span class="tech-gradient-text">故事会</span>
      <span class="tech-subtitle">分享温暖，传递爱心</span>
    </div>

    <el-card shadow="hover" class="tech-card search-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon">
              <Search />
            </el-icon>
            搜索故事
          </span>
          <el-button type="primary" class="tech-btn publish-btn" @click="handlePublish">
            <el-icon>
              <EditPen />
            </el-icon>
            发布故事
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="标题">
          <el-input v-model="searchForm.title" placeholder="请输入故事标题" class="tech-input">
            <template #prefix>
              <el-icon>
                <Document />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="searchForm.author" placeholder="请输入作者" class="tech-input">
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="tech-btn search-btn" @click="handleSearch">
            <el-icon>
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button class="reset-btn" @click="resetSearch">
            <el-icon>
              <RefreshRight />
            </el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 故事卡片列表 -->
    <div class="story-cards">
      <el-card v-for="story in tableData" :key="story.storyId" shadow="hover" class="tech-card story-card"
        @click="handleView(story.storyId)">
        <div class="story-image-wrapper">
          <el-image v-if="story.coverImage" :src="story.coverImage" fit="cover" class="story-cover">
            <template #error>
              <div class="image-placeholder">
                <el-icon>
                  <Picture />
                </el-icon>
              </div>
            </template>
          </el-image>
          <div v-else class="image-placeholder">
            <el-icon>
              <Picture />
            </el-icon>
          </div>
          <div class="story-overlay">
            <div class="overlay-buttons">
              <el-button type="primary" class="view-btn" @click.stop="handleView(story.storyId)">
                <el-icon>
                  <View />
                </el-icon>
                阅读全文
              </el-button>
              <el-button type="success" class="edit-btn" @click.stop="handleEdit(story)" v-if="canEdit(story)">
                <el-icon>
                  <Edit />
                </el-icon>
                编辑
              </el-button>
              <el-button type="danger" class="delete-btn" @click.stop="handleDelete(story)" v-if="canDelete(story)">
                <el-icon>
                  <Delete />
                </el-icon>
                删除
              </el-button>
            </div>
          </div>
        </div>

        <div class="story-content">
          <h3 class="story-title">{{ story.title }}</h3>
          <p class="story-excerpt">{{ removeHtmlTags(story.content).substring(0, 80) }}...</p>

          <div class="story-meta">
            <div class="author-info">
              <el-avatar :size="32" class="author-avatar">
                <el-icon>
                  <UserFilled />
                </el-icon>
              </el-avatar>
              <span class="author-name">{{ story.author }}</span>
            </div>
            <span class="story-time">
              <el-icon>
                <Clock />
              </el-icon>
              {{ formatTime(story.createTime) }}
            </span>
          </div>

          <div class="story-stats">
            <span class="story-stat">
              <el-icon>
                <ChatDotRound />
              </el-icon>
              {{ story.commentCount || 0 }}
            </span>
            <span class="story-stat">
              <el-icon>
                <Star />
              </el-icon>
              {{ story.likeCount || 0 }}
            </span>
            <span class="story-stat">
              <el-icon>
                <View />
              </el-icon>
              {{ story.viewCount || 0 }}
            </span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 空状态 -->
    <div v-if="tableData.length === 0" class="empty-state">
      <el-icon class="empty-icon">
        <DocumentDelete />
      </el-icon>
      <p>暂无故事，快来发布第一个故事吧！</p>
      <el-button type="primary" class="tech-btn" @click="handlePublish">
        <el-icon>
          <EditPen />
        </el-icon>
        发布故事
      </el-button>
    </div>

    <!-- 分页 -->
    <el-pagination v-if="pagination.total > 0" v-model:current-page="pagination.current"
      v-model:page-size="pagination.size" :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" class="tech-pagination" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onActivated } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { getStoryList, deleteStory, getStoryDetail } from '@/api/story/story'
import useUserStore from '@/store/modules/user'
import {
  ChatDotRound,
  Star,
  Search,
  EditPen,
  Document,
  User,
  RefreshRight,
  Picture,
  View,
  UserFilled,
  Clock,
  DocumentDelete,
  Edit,
  Delete
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const tableData = ref([])
const searchForm = reactive({
  title: '',
  author: ''
})
const pagination = reactive({
  current: 1,
  size: 9,
  total: 0
})

const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const removeHtmlTags = (html) => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}

// 故事标题列表
const storyTitles = [
  '流浪猫小橘的温暖故事',
  '从救助站到新家的旅程',
  '我的狗狗教会我的人生道理',
  '收养流浪动物后的生活变化',
  '猫咪陪伴我度过的艰难时光',
  '救助受伤小鸟的感人经历',
  '宠物与主人之间的深厚情谊',
  '领养代替购买，给它们一个家',
  '救助流浪狗的难忘经历',
  '猫咪治愈了我的抑郁症',
  '小动物们的奇妙冒险',
  '从流浪到被爱的蜕变',
  '宠物医院里的温暖故事',
  '陪伴是最长情的告白',
  '与流浪猫的不解之缘',
  '狗狗的忠诚与守护',
  '救助受伤小动物的点点滴滴',
  '宠物带给我的幸福时光',
  '流浪动物救助站的一天',
  '当宠物成为家人',
  '猫咪的神秘世界',
  '狗狗教会我的爱与责任',
  '收养流浪猫后的惊喜',
  '宠物的治愈力量',
  '人与动物之间的美好故事'
]

// 故事内容模板
const storyContents = [
  '这是一个关于流浪猫小橘的故事。那天我在下班回家的路上，发现了一只瑟瑟发抖的小橘猫...',
  '从救助站领养它的那一刻起，我的生活就发生了改变。它从一开始的害怕，到后来的信任...',
  '我的狗狗教会了我什么是真正的忠诚和无条件的爱。无论我开心还是难过，它总是陪伴在我身边...',
  '自从收养了这只流浪猫，我的生活变得更加充实和有意义。每天回家都有一个小生命在等着我...',
  '在我最艰难的那段日子里，是我的猫咪陪伴着我，给我温暖和安慰...',
  '那天在公园里发现了一只受伤的小鸟，我小心翼翼地把它带回家，精心照顾...',
  '宠物和主人之间的情谊是无法用言语来形容的，它们是我们最忠诚的朋友...',
  '领养代替购买，给流浪动物一个温暖的家，这不仅是对它们的拯救，也是对自己的救赎...',
  '记得第一次见到它时，它浑身是伤，但眼神里却充满了希望。经过一段时间的治疗和照顾...',
  '在我患上抑郁症的那段日子里，是我的猫咪一直陪伴着我，用它的方式治愈着我...',
  '小动物们有着它们自己的奇妙世界，每一个眼神、每一个动作都充满了故事...',
  '从流浪街头到被爱包围，这个小生命经历了太多，但最终找到了属于自己的幸福...',
  '宠物医院里每天都上演着各种感人的故事，医生和护士们用爱心守护着每一个小生命...',
  '陪伴是最长情的告白，这句话在宠物身上体现得淋漓尽致。它们用一生陪伴着我们...',
  '那一天，我在小区门口遇到了这只流浪猫，从此我们的命运就紧紧联系在了一起...',
  '狗狗的忠诚是出了名的，它们会用一生守护着自己的主人，不离不弃...',
  '救助受伤小动物的过程虽然辛苦，但看到它们康复后的笑容，一切都值得...',
  '宠物带给我们的不仅仅是快乐，更是一种无法替代的幸福和满足...',
  '在流浪动物救助站工作的每一天都充满了感动，这里的每一个小动物都有着自己的故事...',
  '当宠物真正成为家人的那一刻，你会发现生活变得更加美好和有意义...',
  '猫咪的世界充满了神秘和未知，它们总是用自己的方式探索着这个世界...',
  '狗狗不仅仅是宠物，它们教会我们什么是爱与责任，让我们成为更好的人...',
  '收养这只流浪猫后，它给了我太多的惊喜和感动，让我的生活变得多姿多彩...',
  '宠物有着神奇的治愈力量，它们能治愈我们心灵的创伤，带给我们温暖和希望...',
  '人与动物之间的故事总是那么美好，它们用单纯和真诚打动着我们每一个人...'
]

// 作者列表
const authors = ['爱心人士', '动物保护者', '宠物爱好者', '救助志愿者', '铲屎官', '猫奴', '狗迷', '小动物之友']

// 生成模拟故事数据
function generateMockStories(count = 50) {
  const stories = []
  const now = new Date()

  for (let i = 1; i <= count; i++) {
    const createTime = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000) // 最近30天内
    const idx = (i - 1) % storyTitles.length
    stories.push({
      storyId: i,
      title: storyTitles[idx],
      content: storyContents[idx],
      author: authors[Math.floor(Math.random() * authors.length)],
      authorId: Math.floor(Math.random() * 100) + 1,
      coverImage: `https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cute%20pet%20cat%20dog%20warm%20story%20illustration&image_size=landscape_4_3`,
      createTime: createTime.toISOString().replace('T', ' ').substring(0, 19),
      commentCount: Math.floor(Math.random() * 50),
      likeCount: Math.floor(Math.random() * 200),
      viewCount: Math.floor(Math.random() * 500)
    })
  }

  return stories
}

const loadData = async () => {
  try {
    // 从后端API获取真实数据
    const response = await getStoryList({
      title: searchForm.title,
      author: searchForm.author,
      pageNum: pagination.current,
      pageSize: pagination.size
    })

    // 处理后端返回的数据结构
    // 响应拦截器已经提取了 res.data，所以 response 就是 TableDataInfo 对象
    if (response && response.rows) {
      // 后端返回分页数据
      tableData.value = response.rows
      pagination.total = response.total || 0
    } else if (Array.isArray(response)) {
      // 后端直接返回列表
      tableData.value = response
      pagination.total = response.length
    } else {
      tableData.value = []
      pagination.total = 0
    }
  } catch (error) {
    ElMessage.error('获取数据失败')
  }
}

const handleSearch = () => {
  pagination.current = 1
  loadData()
}

const resetSearch = () => {
  searchForm.title = ''
  searchForm.author = ''
  pagination.current = 1
  loadData()
}

const handleSizeChange = (size) => {
  pagination.size = size
  loadData()
}

const handleCurrentChange = (current) => {
  pagination.current = current
  loadData()
}

const handlePublish = () => {
  router.push('/story/publish')
}

const handleView = (id) => {
  router.push(`/story/detail/${id}`)
}

// 判断是否可以编辑（管理员或作者本人）
const canEdit = (story) => {
  return userStore.roleId === 1 || story.authorId === userStore.id
}

// 判断是否可以删除（管理员或作者本人）
const canDelete = (story) => {
  return userStore.roleId === 1 || story.authorId === userStore.id
}

// 编辑故事
const handleEdit = (story) => {
  router.push({
    path: '/story/publish',
    query: { id: story.storyId }
  })
}

// 删除故事
const handleDelete = (story) => {
  ElMessageBox.confirm(
    `确定要删除故事"${story.title}"吗？此操作不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteStory(story.storyId)
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

onMounted(() => {
  loadData()
})

// 组件被激活时刷新列表数据（keep-alive缓存时使用）
onActivated(() => {
  loadData()
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/tech-theme.scss';

.story-list {
  min-height: 100vh;
  padding: 24px;
  background: #ffffff;
}

.tech-title {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;

  .tech-gradient-text {
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .tech-subtitle {
    font-size: 16px;
    color: #666666;
    font-weight: 400;
  }
}

.tech-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  margin-bottom: 24px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #007bff, #6610f2);
    opacity: 0.9;
  }

  :deep(.el-card__header) {
    background: linear-gradient(90deg, rgba(0, 123, 255, 0.05) 0%, rgba(102, 16, 242, 0.05) 100%);
    border-bottom: 1px solid #e0e0e0;
    padding: 16px 20px;
  }

  :deep(.el-card__body) {
    padding: 20px;
    background: #ffffff;
  }

  &:hover {
    border-color: #007bff;
    box-shadow: 0 4px 16px rgba(0, 123, 255, 0.15);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 18px;
      font-weight: 600;
      color: #333333;

      .title-icon {
        color: #007bff;
        font-size: 22px;
      }
    }

    .publish-btn {
      background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
      border: none;
      padding: 10px 20px;
      font-weight: 500;

      &:hover {
        background: linear-gradient(135deg, #0069d9 0%, #5510e0 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
      }
    }
  }
}

.search-form {
  .el-form-item {
    :deep(.el-form-item__label) {
      color: #666666;
      font-weight: 500;
    }
  }

  .tech-input {
    :deep(.el-input__wrapper) {
      background: #ffffff;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: none;
      transition: all 0.3s ease;

      &:hover {
        border-color: #007bff;
        box-shadow: 0 0 8px rgba(0, 123, 255, 0.1);
      }

      &.is-focus {
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15), 0 0 12px rgba(0, 123, 255, 0.2);
      }

      .el-input__inner {
        color: #333333;
        font-weight: 500;
      }

      .el-input__prefix {
        color: #007bff;
      }
    }
  }

  .search-btn {
    background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
    border: none;
    font-weight: 500;

    &:hover {
      background: linear-gradient(135deg, #0069d9 0%, #5510e0 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
    }
  }

  .reset-btn {
    background: #ffffff;
    border: 1px solid #ddd;
    color: #666666;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      border-color: #007bff;
      color: #007bff;
      background: rgba(0, 123, 255, 0.05);
    }
  }
}

.story-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.story-card {
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  &:hover {
    transform: translateY(-8px);
    border-color: #007bff;
    box-shadow: 0 12px 30px rgba(0, 123, 255, 0.15);

    .story-overlay {
      opacity: 1;
    }

    .story-cover {
      transform: scale(1.05);
    }
  }

  :deep(.el-card__body) {
    padding: 0;
    background: #ffffff;
  }

  .story-image-wrapper {
    position: relative;
    height: 200px;
    overflow: hidden;

    .story-cover {
      width: 100%;
      height: 100%;
      transition: transform 0.3s ease;
    }

    .image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      color: #999999;
      font-size: 48px;
    }

    .story-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;

      .overlay-buttons {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 80%;
      }

      .view-btn,
      .edit-btn,
      .delete-btn {
        background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
        border: none;
        padding: 10px 20px;
        font-weight: 500;
        width: 100%;

        &:hover {
          background: linear-gradient(135deg, #00c4e8 0%, #6d34d1 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 212, 255, 0.4);
        }
      }

      .edit-btn {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);

        &:hover {
          background: linear-gradient(135deg, #0ea571 0%, #048554 100%);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }
      }

      .delete-btn {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);

        &:hover {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }
      }
    }
  }

  .story-content {
    padding: 20px;

    .story-title {
      font-size: 18px;
      font-weight: 600;
      color: #001529;
      margin: 0 0 12px 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .story-excerpt {
      font-size: 14px;
      color: #94a3b8;
      line-height: 1.6;
      margin: 0 0 16px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .story-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .author-info {
        display: flex;
        align-items: center;
        gap: 8px;

        .author-avatar {
          background: rgba(30, 39, 70, 0.8);
          border: 1px solid rgba(0, 212, 255, 0.3);
          color: #00d4ff;
        }

        .author-name {
          font-size: 14px;
          color: #94a3b8;
          font-weight: 500;
        }
      }

      .story-time {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: #64748b;
        font-family: 'Courier New', monospace;

        .el-icon {
          font-size: 14px;
          color: #00d4ff;
        }
      }
    }

    .story-stats {
      display: flex;
      gap: 16px;
      padding-top: 12px;
      border-top: 1px solid rgba(0, 212, 255, 0.15);

      .story-stat {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: #64748b;
        font-weight: 500;

        .el-icon {
          font-size: 16px;
          color: #00d4ff;
          filter: drop-shadow(0 0 4px rgba(0, 212, 255, 0.3));
        }
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: rgba(17, 25, 54, 0.6);
  border: 1px dashed rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  margin: 40px 0;

  .empty-icon {
    font-size: 80px;
    color: #64748b;
    margin-bottom: 20px;
    filter: drop-shadow(0 0 10px rgba(0, 212, 255, 0.2));
  }

  p {
    font-size: 16px;
    color: #94a3b8;
    margin-bottom: 24px;
  }

  .tech-btn {
    background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
    border: none;
    padding: 12px 32px;
    font-weight: 500;

    &:hover {
      background: linear-gradient(135deg, #00c4e8 0%, #6d34d1 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 212, 255, 0.4);
    }
  }
}

.tech-pagination {
  justify-content: center;
  margin-top: 32px;
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;

  :deep(.el-pagination__total),
  :deep(.el-pagination__jump) {
    color: #666666;
  }

  :deep(.el-pager li) {
    background: #ffffff;
    border: 1px solid #ddd;
    color: #666666;
    border-radius: 6px;

    &:hover {
      background: rgba(0, 123, 255, 0.1);
      border-color: #007bff;
      color: #007bff;
    }

    &.is-active {
      background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
      border-color: transparent;
      color: white;
      box-shadow: 0 0 12px rgba(0, 123, 255, 0.3);
    }
  }

  :deep(.btn-prev),
  :deep(.btn-next) {
    background: #ffffff;
    border: 1px solid #ddd;
    color: #666666;
    border-radius: 6px;

    &:hover {
      background: rgba(0, 123, 255, 0.1);
      border-color: #007bff;
      color: #007bff;
    }
  }

  :deep(.el-input__wrapper) {
    background: #ffffff;
    border: 1px solid #ddd;
    box-shadow: none;

    &:hover {
      border-color: #007bff;
    }

    &.is-focus {
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
    }

    .el-input__inner {
      color: #333333;
      font-weight: 500;
    }
  }
}

@media (max-width: 768px) {
  .story-list {
    padding: 16px;
  }

  .tech-title .tech-gradient-text {
    font-size: 24px;
  }

  .story-cards {
    grid-template-columns: 1fr;
  }

  .search-form {
    .el-form-item {
      width: 100%;
      margin-right: 0;

      .tech-input {
        width: 100%;
      }
    }
  }
}
</style>
