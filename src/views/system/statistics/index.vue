<template>
  <div class="app-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">系统统计</h2>
      <p class="page-subtitle">数据可视化展示</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <div class="stat-card pet-count">
          <div class="stat-icon">
            <el-icon><Cat /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.petCount }}</div>
            <div class="stat-label">宠物总数</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card adoption-count">
          <div class="stat-icon">
            <el-icon><Heart /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.adoptionCount }}</div>
            <div class="stat-label">领养成功</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card rescue-count">
          <div class="stat-icon">
            <el-icon><Ambulance /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.rescueCount }}</div>
            <div class="stat-label">救助中</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card course-count">
          <div class="stat-icon">
            <el-icon><BookOpen /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.courseCount }}</div>
            <div class="stat-label">课程总数</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-row">
      <!-- 宠物类型分布饼图 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <el-icon><PieChart /></el-icon>
            <span>宠物类型分布</span>
          </template>
          <div ref="petTypeChart" class="chart-container"></div>
        </el-card>
      </el-col>

      <!-- 领养进度环形图 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <el-icon><CircleCheck /></el-icon>
            <span>救助领养进度</span>
          </template>
          <div ref="adoptionProgressChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <!-- 热门课程柱状图 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <el-icon><BarChart /></el-icon>
            <span>热门课程排行</span>
          </template>
          <div ref="courseChart" class="chart-container"></div>
        </el-card>
      </el-col>

      <!-- 月度领养趋势图 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <el-icon><TrendingUp /></el-icon>
            <span>月度领养趋势</span>
          </template>
          <div ref="trendChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <!-- 宠物状态分布 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <el-icon><UserCheck /></el-icon>
            <span>宠物状态分布</span>
          </template>
          <div ref="petStatusChart" class="chart-container"></div>
        </el-card>
      </el-col>

      <!-- 投诉处理统计 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <el-icon><Warning /></el-icon>
            <span>投诉处理统计</span>
          </template>
          <div ref="complaintChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Statistics">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Cat, Heart, Ambulance, BookOpen, PieChart, CircleCheck, BarChart, TrendingUp, UserCheck, Warning } from '@element-plus/icons-vue'

// 统计数据
const stats = ref({
  petCount: 156,
  adoptionCount: 89,
  rescueCount: 34,
  courseCount: 52
})

// 图表引用
const petTypeChart = ref(null)
const adoptionProgressChart = ref(null)
const courseChart = ref(null)
const trendChart = ref(null)
const petStatusChart = ref(null)
const complaintChart = ref(null)

// 图表实例
let charts = []

// 宠物类型分布数据
const petTypeData = [
  { name: '猫', value: 68 },
  { name: '狗', value: 52 },
  { name: '兔子', value: 18 },
  { name: '仓鼠', value: 10 },
  { name: '其他', value: 8 }
]

// 领养进度数据
const adoptionProgressData = [
  { name: '已领养', value: 89 },
  { name: '待领养', value: 45 },
  { name: '领养中', value: 22 }
]

// 热门课程数据
const courseData = [
  { name: '宠物健康护理', value: 1256 },
  { name: '猫咪行为训练', value: 985 },
  { name: '狗狗训练指南', value: 876 },
  { name: '宠物营养食谱', value: 765 },
  { name: '宠物美容技巧', value: 654 },
  { name: '宠物疾病预防', value: 543 },
  { name: '宠物心理学', value: 432 },
  { name: '宠物摄影教程', value: 321 }
]

// 月度领养趋势数据
const trendData = {
  months: ['1月', '2月', '3月', '4月', '5月', '6月'],
  adoption: [12, 15, 18, 22, 19, 25],
  rescue: [8, 10, 12, 9, 11, 14]
}

// 宠物状态数据
const petStatusData = [
  { name: '健康', value: 95 },
  { name: '治疗中', value: 32 },
  { name: '康复中', value: 18 },
  { name: '需紧急救助', value: 11 }
]

// 投诉处理数据
const complaintData = [
  { name: '待处理', value: 15 },
  { name: '处理中', value: 8 },
  { name: '已完成', value: 22 },
  { name: '已驳回', value: 5 }
]

// 初始化宠物类型分布饼图
function initPetTypeChart() {
  if (!petTypeChart.value) return
  const chart = echarts.init(petTypeChart.value)
  charts.push(chart)
  chart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '宠物类型',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: petTypeData,
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
      }
    ]
  })
}

// 初始化领养进度环形图
function initAdoptionProgressChart() {
  if (!adoptionProgressChart.value) return
  const chart = echarts.init(adoptionProgressChart.value)
  charts.push(chart)
  chart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} 只 ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: '5%'
    },
    series: [
      {
        name: '领养状态',
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['50%', '40%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%'
        },
        data: adoptionProgressData,
        color: ['#52c41a', '#1890ff', '#faad14']
      }
    ]
  })
}

// 初始化热门课程柱状图
function initCourseChart() {
  if (!courseChart.value) return
  const chart = echarts.init(courseChart.value)
  charts.push(chart)
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: courseData.map(item => item.name),
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '学习人数',
        type: 'bar',
        data: courseData.map(item => item.value),
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' }
          ])
        }
      }
    ]
  })
}

// 初始化月度领养趋势图
function initTrendChart() {
  if (!trendChart.value) return
  const chart = echarts.init(trendChart.value)
  charts.push(chart)
  chart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['领养数', '救助数']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: trendData.months
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '领养数',
        type: 'line',
        smooth: true,
        data: trendData.adoption,
        lineStyle: {
          width: 3,
          color: '#52c41a'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
            { offset: 1, color: 'rgba(82, 196, 26, 0.05)' }
          ])
        }
      },
      {
        name: '救助数',
        type: 'line',
        smooth: true,
        data: trendData.rescue,
        lineStyle: {
          width: 3,
          color: '#1890ff'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.05)' }
          ])
        }
      }
    ]
  })
}

// 初始化宠物状态分布饼图
function initPetStatusChart() {
  if (!petStatusChart.value) return
  const chart = echarts.init(petStatusChart.value)
  charts.push(chart)
  chart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} 只 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '宠物状态',
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        data: petStatusData,
        itemStyle: {
          borderRadius: 6
        },
        color: ['#52c41a', '#1890ff', '#faad14', '#ff4d4f']
      }
    ]
  })
}

// 初始化投诉处理统计柱状图
function initComplaintChart() {
  if (!complaintChart.value) return
  const chart = echarts.init(complaintChart.value)
  charts.push(chart)
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: complaintData.map(item => item.name)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '投诉数量',
        type: 'bar',
        data: complaintData.map(item => item.value),
        itemStyle: {
          borderRadius: 6,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#ff6b6b' },
            { offset: 1, color: '#ee5a24' }
          ])
        }
      }
    ]
  })
}

// 初始化所有图表
function initCharts() {
  initPetTypeChart()
  initAdoptionProgressChart()
  initCourseChart()
  initTrendChart()
  initPetStatusChart()
  initComplaintChart()
}

// 监听窗口大小变化
function handleResize() {
  charts.forEach(chart => chart.resize())
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  charts.forEach(chart => chart.dispose())
})
</script>

<style scoped>
.app-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.page-subtitle {
  font-size: 14px;
  color: #909399;
  margin: 8px 0 0;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  }
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 16px;
}

.pet-count .stat-icon {
  background: linear-gradient(135deg, #FF6B6B, #FFEAA7);
  color: #fff;
}

.adoption-count .stat-icon {
  background: linear-gradient(135deg, #4ECDC4, #45B7D1);
  color: #fff;
}

.rescue-count .stat-icon {
  background: linear-gradient(135deg, #96CEB4, #88D8B0);
  color: #fff;
}

.course-count .stat-icon {
  background: linear-gradient(135deg, #667EEA, #764BA2);
  color: #fff;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.charts-row {
  margin-bottom: 20px;
}

.chart-card {
  height: 400px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.chart-container {
  height: calc(100% - 60px);
  width: 100%;
}

:deep(.el-card__header) {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #303133;
}

:deep(.el-card__body) {
  padding: 16px;
}
</style>