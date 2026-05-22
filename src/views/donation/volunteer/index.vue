<template>
  <div class="volunteer-service tech-page tech-grid-bg">
    <div class="tech-title">
      <span class="tech-gradient-text">志愿服务</span>
      <span class="tech-subtitle">用行动传递爱心，让温暖无处不在</span>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <el-card class="tech-card stat-card">
        <div class="stat-content">
          <div class="stat-icon primary">
            <el-icon>
              <UserFilled />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ animatedVolunteerCount }}</div>
            <div class="stat-label">注册志愿者</div>
          </div>
        </div>
      </el-card>

      <el-card class="tech-card stat-card">
        <div class="stat-content">
          <div class="stat-icon success">
            <el-icon>
              <CircleCheck />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ animatedCompletedTasks }}</div>
            <div class="stat-label">已完成任务</div>
          </div>
        </div>
      </el-card>

      <el-card class="tech-card stat-card">
        <div class="stat-content">
          <div class="stat-icon warning">
            <el-icon>
              <Clock />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ animatedTotalHours }}</div>
            <div class="stat-label">累计服务时长(小时)</div>
          </div>
        </div>
      </el-card>

      <el-card class="tech-card stat-card">
        <div class="stat-content">
          <div class="stat-icon danger">
            <el-icon>
              <List />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ pendingTasks }}</div>
            <div class="stat-label">待认领任务</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 志愿风采卡片 -->
    <el-card shadow="hover" class="tech-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon">
              <Star />
            </el-icon>
            志愿风采
          </span>
          <span class="section-subtitle">记录每一次温暖的瞬间</span>
        </div>
      </template>

      <div class="gallery-grid">
        <el-card v-for="item in volunteerGallery" :key="item.id" class="gallery-card" shadow="hover">
          <div class="gallery-image">
            <el-image :src="item.image" fit="cover" :preview-src-list="[item.image]" :initial-index="0">
              <template #error>
                <div class="image-placeholder">
                  <el-icon>
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
          </div>
          <div class="gallery-content">
            <h4 class="gallery-title">{{ item.activityName }}</h4>
            <div class="gallery-info">
              <span class="gallery-volunteer">
                <el-icon>
                  <User />
                </el-icon>
                {{ item.volunteerName }}
              </span>
              <span class="gallery-date">
                <el-icon>
                  <Calendar />
                </el-icon>
                {{ item.activityDate }}
              </span>
            </div>
            <p class="gallery-desc">{{ item.description }}</p>
          </div>
        </el-card>
      </div>
    </el-card>

    <!-- 任务列表 -->
    <el-card shadow="hover" class="tech-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon">
              <List />
            </el-icon>
            待认领任务
          </span>
          <el-select v-model="taskFilter" placeholder="筛选任务类型" class="filter-select">
            <el-option label="全部" value="all" />
            <el-option label="紧急任务" value="urgent" />
            <el-option label="常规任务" value="normal" />
          </el-select>
        </div>
      </template>

      <div class="task-list">
        <el-card v-for="task in filteredTasks" :key="task.id" class="task-card"
          :class="{ 'urgent': task.priority === 'high' }">
          <div class="task-header">
            <div class="task-title">
              <el-tag :type="task.priority === 'high' ? 'danger' : 'warning'" size="small">
                {{ task.priority === 'high' ? '紧急' : '常规' }}
              </el-tag>
              <span>{{ task.title }}</span>
            </div>
            <span class="task-date">{{ task.deadline }}</span>
          </div>

          <div class="task-info">
            <p class="task-description">{{ task.description }}</p>

            <div class="task-meta">
              <span class="meta-item">
                <el-icon>
                  <MapLocation />
                </el-icon>
                {{ task.location }}
              </span>
              <span class="meta-item">
                <el-icon>
                  <Clock />
                </el-icon>
                {{ task.duration }}小时
              </span>
              <span class="meta-item">
                <el-icon>
                  <UserFilled />
                </el-icon>
                需要{{ task.volunteersNeeded }}人
              </span>
            </div>

            <div class="task-skills">
              <el-tag v-for="skill in task.requiredSkills" :key="skill" size="small" class="skill-tag">
                {{ getSkillLabel(skill) }}
              </el-tag>
            </div>
          </div>

          <div class="task-footer">
            <span class="task-status">{{ task.status }}</span>
            <el-button type="primary" size="small" @click="handleClaimTask(task)" :disabled="task.status === '进行中'">
              <el-icon>
                <User />
              </el-icon>
              {{ task.status === '进行中' ? '已认领' : '立即认领' }}
            </el-button>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  UserFilled,
  CircleCheck,
  Clock,
  List,
  Star,
  User,
  Phone,
  Calendar,
  RefreshRight,
  Check,
  MapLocation,
  Picture
} from '@element-plus/icons-vue'
import { getVolunteerList } from '@/api/donation/application'

// 志愿风采数据
const volunteerGallery = ref([
  {
    id: 1,
    activityName: '流浪动物救助行动',
    volunteerName: '张明',
    activityDate: '2024-01-15',
    image: 'https://picsum.photos/seed/rescue1/400/300',
    description: '参与救助站日常照料工作，为流浪动物提供温暖的照顾。'
  },
  {
    id: 2,
    activityName: '宠物义诊活动',
    volunteerName: '李华',
    activityDate: '2024-01-12',
    image: 'https://picsum.photos/seed/clinic1/400/300',
    description: '协助宠物医院进行义诊活动，帮助流浪动物进行健康检查。'
  },
  {
    id: 3,
    activityName: '领养日活动',
    volunteerName: '王芳',
    activityDate: '2024-01-10',
    image: 'https://picsum.photos/seed/adopt1/400/300',
    description: '在领养日活动中担任志愿者，帮助流浪动物找到新家。'
  },
  {
    id: 4,
    activityName: '冬季物资发放',
    volunteerName: '陈伟',
    activityDate: '2024-01-08',
    image: 'https://picsum.photos/seed/supplies1/400/300',
    description: '搬运和整理冬季保暖物资，为流浪动物提供温暖保障。'
  },
  {
    id: 5,
    activityName: '宠物清洁护理',
    volunteerName: '刘洋',
    activityDate: '2024-01-05',
    image: 'https://picsum.photos/seed/grooming1/400/300',
    description: '为救助站的宠物进行日常清洁和护理工作。'
  },
  {
    id: 6,
    activityName: '社区宣传活动',
    volunteerName: '赵敏',
    activityDate: '2024-01-03',
    image: 'https://picsum.photos/seed/community1/400/300',
    description: '在社区进行文明养宠宣传，普及宠物救助知识。'
  }
])

// 统计数据（只有注册志愿者总数从数据库获取，其他使用模拟数据）
const volunteerCount = ref(90)
const completedTasks = ref(523)
const totalHours = ref(1890)
const pendingTasks = ref(12)

const animatedVolunteerCount = ref(0)
const animatedCompletedTasks = ref(0)
const animatedTotalHours = ref(0)

// 任务数据
const taskFilter = ref('all')
const tasks = ref([
  {
    id: 1,
    title: '流浪动物救助站日常照料',
    description: '协助救助站工作人员进行宠物喂食、清洁、遛狗等日常工作',
    location: '朝阳区救助站',
    duration: 4,
    volunteersNeeded: 3,
    requiredSkills: ['petCare'],
    priority: 'normal',
    deadline: '2024-01-20',
    status: '待认领'
  },
  {
    id: 2,
    title: '紧急医疗护送',
    description: '协助将受伤流浪动物送往宠物医院进行治疗',
    location: '海淀区宠物医院',
    duration: 2,
    volunteersNeeded: 2,
    requiredSkills: ['driving', 'medical'],
    priority: 'high',
    deadline: '2024-01-16',
    status: '待认领'
  },
  {
    id: 3,
    title: '领养活动志愿者',
    description: '协助举办线下领养活动，负责引导、登记、摄影等工作',
    location: '朝阳公园',
    duration: 6,
    volunteersNeeded: 8,
    requiredSkills: ['planning', 'photography'],
    priority: 'normal',
    deadline: '2024-01-25',
    status: '待认领'
  },
  {
    id: 4,
    title: '宠物寄养回访',
    description: '回访寄养家庭，了解寄养宠物的生活状况，记录相关信息',
    location: '全市范围',
    duration: 3,
    volunteersNeeded: 4,
    requiredSkills: ['petCare', 'writing'],
    priority: 'normal',
    deadline: '2024-01-18',
    status: '进行中'
  },
  {
    id: 5,
    title: '冬季保暖物资搬运',
    description: '协助搬运和整理冬季保暖物资到各个救助点',
    location: '仓库',
    duration: 3,
    volunteersNeeded: 5,
    requiredSkills: [],
    priority: 'high',
    deadline: '2024-01-17',
    status: '待认领'
  }
])

const filteredTasks = computed(() => {
  if (taskFilter.value === 'all') return tasks.value
  return tasks.value.filter(task =>
    taskFilter.value === 'urgent' ? task.priority === 'high' : task.priority === 'normal'
  )
})

const skillLabels = {
  petCare: '宠物护理',
  medical: '医疗护理',
  driving: '运输驾驶',
  writing: '文案写作',
  photography: '摄影摄像',
  planning: '活动策划',
  finance: '财务会计',
  other: '其他'
}

const getSkillLabel = (skill) => skillLabels[skill] || skill

const animateNumbers = () => {
  const duration = 1500
  const startTime = Date.now()

  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOut = 1 - Math.pow(1 - progress, 3)

    animatedVolunteerCount.value = Math.floor(volunteerCount.value * easeOut)
    animatedCompletedTasks.value = Math.floor(completedTasks.value * easeOut)
    animatedTotalHours.value = Math.floor(totalHours.value * easeOut)

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  animate()
}

const loadStatistics = async () => {
  try {
    const res = await getVolunteerList({ donationType: 'volunteer' })
    console.log('志愿者API返回数据:', res)
    console.log('res.rows:', res?.rows)
    console.log('res.data:', res?.data)
    console.log('res.data.rows:', res?.data?.rows)

    // 尝试多种可能的数据结构
    let dataList = []
    if (res && res.rows) {
      dataList = res.rows
    } else if (res && res.data && res.data.rows) {
      dataList = res.data.rows
    } else if (Array.isArray(res)) {
      dataList = res
    } else if (res && res.data && Array.isArray(res.data)) {
      dataList = res.data
    }

    console.log('最终数据列表:', dataList)
    console.log('数据列表长度:', dataList.length)

    if (dataList.length > 0) {
      volunteerCount.value = dataList.length
    }
  } catch (error) {
    console.error('加载统计数据失败', error)
    console.error('错误详情:', error.response?.data || error.message)
    // 使用默认值
    volunteerCount.value = 256
  }
}

onMounted(() => {
  loadStatistics()
  setTimeout(() => {
    animateNumbers()
  }, 300)
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/tech-theme.scss';

.volunteer-service {
  min-height: 100vh;
  padding: 24px;
}

.tech-title {
  margin-bottom: 24px;

  .tech-gradient-text {
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: block;
    margin-bottom: 8px;
  }

  .tech-subtitle {
    font-size: 14px;
    color: var(--tech-text-muted);
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  .stat-content {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;

    &.primary {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    &.success {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    &.warning {
      background: rgba(245, 158, 11, 0.1);
      color: #f59e0b;
    }

    &.danger {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }

    .el-icon {
      font-size: 28px;
    }
  }

  .stat-info {
    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--tech-text-primary);
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 14px;
      color: var(--tech-text-muted);
    }
  }
}

.tech-card {
  margin-bottom: 24px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 600;
      color: var(--tech-text-primary);

      .title-icon {
        color: #10b981;
        font-size: 20px;
      }
    }

    .section-subtitle {
      font-size: 13px;
      color: var(--tech-text-muted);
      margin-left: 8px;
    }

    .filter-select {
      width: 160px;
    }
  }
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.gallery-card {
  border: 1px solid var(--tech-border);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(16, 185, 129, 0.15);
    transform: translateY(-4px);
  }

  .gallery-image {
    width: 100%;
    height: 180px;
    overflow: hidden;
    background: var(--tech-bg-light);

    :deep(.el-image) {
      width: 100%;
      height: 100%;
    }

    .image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--tech-bg-light);
      color: var(--tech-text-muted);

      .el-icon {
        font-size: 48px;
      }
    }
  }

  .gallery-content {
    padding: 16px;

    .gallery-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--tech-text-primary);
      margin: 0 0 12px 0;
    }

    .gallery-info {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 12px;

      .gallery-volunteer,
      .gallery-date {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: var(--tech-text-muted);

        .el-icon {
          color: #10b981;
        }
      }
    }

    .gallery-desc {
      font-size: 14px;
      color: var(--tech-text-secondary);
      line-height: 1.5;
      margin: 0;
    }
  }
}

.form-section {
  padding: 0 16px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
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
        border-color: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
      }
    }

    :deep(.el-input__prefix) {
      color: #10b981;
    }
  }
}

.form-actions {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--tech-border);

  .submit-btn {
    background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
    border: none;
    padding: 12px 32px;
    font-size: 16px;
    font-weight: 600;

    &:hover {
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
    }
  }

  .reset-btn {
    background: transparent;
    border: 1px solid var(--tech-border);
    color: var(--tech-text-secondary);
    padding: 12px 24px;

    &:hover {
      border-color: #10b981;
      color: #10b981;
    }
  }
}

.task-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.task-card {
  border: 1px solid var(--tech-border);
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &.urgent {
    border-color: rgba(239, 68, 68, 0.3);
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.02) 0%, transparent 100%);
  }

  .task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .task-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: var(--tech-text-primary);
    }

    .task-date {
      font-size: 13px;
      color: var(--tech-text-muted);
    }
  }

  .task-info {
    .task-description {
      color: var(--tech-text-secondary);
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 12px;
    }

    .task-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 12px;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: var(--tech-text-muted);
      }
    }

    .task-skills {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;

      .skill-tag {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
        border: none;
      }
    }
  }

  .task-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--tech-border);

    .task-status {
      font-size: 13px;
      color: #10b981;
      font-weight: 500;
    }

    .el-button {
      background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
      border: none;

      &:disabled {
        background: var(--tech-bg-light);
        color: var(--tech-text-muted);
      }
    }
  }
}

@media (max-width: 768px) {
  .volunteer-service {
    padding: 16px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .task-list {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
