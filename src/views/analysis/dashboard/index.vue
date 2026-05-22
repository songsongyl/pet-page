<template>
  <div class="dashboard-container tech-page" v-loading="loading" element-loading-text="加载中...">
    <!-- 页面头部 -->
    <div class="tech-title">
      <span class="tech-gradient-text">数据可视化分析</span>
      <span class="tech-subtitle">实时监控平台运营数据</span>
    </div>

    <!-- 统计概览卡片 -->
    <div class="stats-grid">
      <el-card class="tech-card stat-card">
        <div class="stat-content">
          <div class="stat-icon primary">
            <el-icon>
              <User />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ animatedValues.totalUsers }}</div>
            <div class="stat-label">总用户数</div>
          </div>
        </div>
      </el-card>

      <el-card class="tech-card stat-card">
        <div class="stat-content">
          <div class="stat-icon success">
            <el-icon>
              <Star />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ animatedValues.totalPets }}</div>
            <div class="stat-label">宠物总数</div>
          </div>
        </div>
      </el-card>

      <el-card class="tech-card stat-card">
        <div class="stat-content">
          <div class="stat-icon warning">
            <el-icon>
              <Star />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ animatedValues.totalRescues }}</div>
            <div class="stat-label">救助记录</div>
          </div>
        </div>
      </el-card>

      <el-card class="tech-card stat-card">
        <div class="stat-content">
          <div class="stat-icon danger">
            <el-icon>
              <Star />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ animatedValues.totalAdoptions }}</div>
            <div class="stat-label">领养申请</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <div class="chart-row">
        <!-- 领养趋势图 -->
        <div class="chart-card large">
          <div class="chart-header">
            <div class="chart-title">
              <el-icon>
                <ArrowUp />
              </el-icon>
              <span>领养/救助趋势分析</span>
            </div>
            <div class="chart-tabs">
              <el-tabs v-model="trendTab" type="card" class="small-tabs">
                <el-tab-pane label="月度" name="month"></el-tab-pane>
                <el-tab-pane label="季度" name="quarter"></el-tab-pane>
                <el-tab-pane label="年度" name="year"></el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <div ref="trendChart" class="chart-content"></div>
        </div>

        <!-- 宠物类型分布 -->
        <div v-if="petTypeData && petTypeData.length > 0" class="chart-card">
          <div class="chart-header">
            <div class="chart-title">
              <el-icon>
                <PieChart />
              </el-icon>
              <span>宠物类型分布</span>
            </div>
          </div>
          <div ref="petTypeChart" class="chart-content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="Dashboard">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { listInfo } from '@/api/pet/info'
import { listGive } from '@/api/give/give'
import { listUser } from '@/api/system/user'
import { getAdoptionList } from '@/api/adoption/application'
import { User, Star, ArrowUp, PieChart } from '@element-plus/icons-vue'

const loading = ref(true)
const trendTab = ref('month')

const stats = reactive({
  totalUsers: 0,
  totalPets: 0,
  totalRescues: 0,
  totalAdoptions: 0
})

const animatedValues = reactive({
  totalUsers: 0,
  totalPets: 0,
  totalRescues: 0,
  totalAdoptions: 0
})

const trendChart = ref(null)
const petTypeChart = ref(null)

let charts = []

const trendData = reactive({
  months: [],
  adoption: [],
  rescue: []
})

const rawMonthlyData = reactive({
  adoption: {},
  rescue: {}
})

const petTypeData = ref([])

// 生成模拟数据（上千条）
function generateMockData() {
  // 模拟统计数据（上千条规模）
  stats.totalUsers = 3586  // 总用户数
  stats.totalPets = 1245   // 宠物总数
  stats.totalRescues = 892 // 救助记录
  stats.totalAdoptions = 654 // 领养申请

  animateNumbers()

  // 模拟宠物类型分布
  petTypeData.value = [
    { name: '猫', value: 456 },
    { name: '狗', value: 523 },
    { name: '兔子', value: 128 },
    { name: '仓鼠', value: 89 },
    { name: '鸟类', value: 32 },
    { name: '其他', value: 17 }
  ]

  // 生成最近6个月的模拟数据
  const now = new Date()
  const months = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  // 模拟领养申请月度数据（每个月100-200条）
  const adoptionMonthlyData = {}
  months.forEach(month => {
    adoptionMonthlyData[month] = Math.floor(Math.random() * 100) + 100
  })

  // 模拟救助申请月度数据（每个月80-150条）
  const rescueMonthlyData = {}
  months.forEach(month => {
    rescueMonthlyData[month] = Math.floor(Math.random() * 70) + 80
  })

  rawMonthlyData.adoption = adoptionMonthlyData
  rawMonthlyData.rescue = rescueMonthlyData

  updateTrendData()
}

async function fetchData() {
  loading.value = true
  try {
    // 使用模拟数据而非数据库数据
    generateMockData()
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

function updateTrendData() {
  const now = new Date()
  let labels = []
  let periodType = 'month'

  if (trendTab.value === 'quarter') {
    periodType = 'quarter'
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i * 3, 1)
      labels.push(`${d.getFullYear()}年Q${Math.ceil((d.getMonth() + 1) / 3)}`)
    }
  } else if (trendTab.value === 'year') {
    periodType = 'year'
    for (let i = 5; i >= 0; i--) {
      labels.push(`${now.getFullYear() - i}年`)
    }
  } else {
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      labels.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
    }
  }

  trendData.months = labels

  if (periodType === 'month') {
    trendData.adoption = labels.map(m => rawMonthlyData.adoption[m] || 0)
    trendData.rescue = labels.map(m => rawMonthlyData.rescue[m] || 0)
  } else if (periodType === 'quarter') {
    trendData.adoption = labels.map(label => {
      const year = parseInt(label.substring(0, 4))
      const quarter = parseInt(label.charAt(6))
      let total = 0
      for (let m = (quarter - 1) * 3; m < quarter * 3; m++) {
        const month = `${year}-${String(m + 1).padStart(2, '0')}`
        total += rawMonthlyData.adoption[month] || 0
      }
      return total
    })
    trendData.rescue = labels.map(label => {
      const year = parseInt(label.substring(0, 4))
      const quarter = parseInt(label.charAt(6))
      let total = 0
      for (let m = (quarter - 1) * 3; m < quarter * 3; m++) {
        const month = `${year}-${String(m + 1).padStart(2, '0')}`
        total += rawMonthlyData.rescue[month] || 0
      }
      return total
    })
  } else {
    trendData.adoption = labels.map(label => {
      const year = parseInt(label.substring(0, 4))
      let total = 0
      for (let m = 0; m < 12; m++) {
        const month = `${year}-${String(m + 1).padStart(2, '0')}`
        total += rawMonthlyData.adoption[month] || 0
      }
      return total
    })
    trendData.rescue = labels.map(label => {
      const year = parseInt(label.substring(0, 4))
      let total = 0
      for (let m = 0; m < 12; m++) {
        const month = `${year}-${String(m + 1).padStart(2, '0')}`
        total += rawMonthlyData.rescue[month] || 0
      }
      return total
    })
  }
}

function animateNumbers() {
  const duration = 1500
  const startTime = Date.now()
  const startValues = { ...animatedValues }

  function update() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOut = 1 - Math.pow(1 - progress, 3)

    animatedValues.totalUsers = Math.floor(startValues.totalUsers + (stats.totalUsers - startValues.totalUsers) * easeOut)
    animatedValues.totalPets = Math.floor(startValues.totalPets + (stats.totalPets - startValues.totalPets) * easeOut)
    animatedValues.totalRescues = Math.floor(startValues.totalRescues + (stats.totalRescues - startValues.totalRescues) * easeOut)
    animatedValues.totalAdoptions = Math.floor(startValues.totalAdoptions + (stats.totalAdoptions - startValues.totalAdoptions) * easeOut)

    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }
  update()
}

function initCharts() {
  initTrendChart()
  initPetTypeChart()
}

function initTrendChart() {
  if (!trendChart.value) return

  const existingChart = echarts.getInstanceByDom(trendChart.value)
  if (existingChart) {
    existingChart.dispose()
    charts = charts.filter(c => c !== existingChart)
  }

  const chart = echarts.init(trendChart.value)
  charts.push(chart)

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e8eaed',
      borderWidth: 1,
      borderRadius: 12,
      padding: [12, 16],
      textStyle: {
        color: '#333',
        fontSize: 13
      },
      axisPointer: {
        type: 'cross',
        lineStyle: {
          color: '#d9d9d9',
          type: 'dashed'
        },
        crossStyle: {
          color: '#999'
        }
      },
      formatter: function (params) {
        let result = `<div style="font-weight: 600; margin-bottom: 8px; color: #1a1a2e;">${params[0].axisValue}</div>`
        params.forEach(item => {
          result += `<div style="display: flex; align-items: center; margin: 4px 0;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${item.color}; margin-right: 8px;"></span>
            <span style="color: #666;">${item.seriesName}:</span>
            <span style="font-weight: 600; margin-left: 8px; color: #1a1a2e;">${item.value} 次</span>
          </div>`
        })
        return result
      }
    },
    legend: {
      data: ['领养申请', '救助申请'],
      top: 0,
      right: 0,
      itemWidth: 16,
      itemHeight: 10,
      itemGap: 20,
      textStyle: {
        color: '#666',
        fontSize: 13
      },
      icon: 'roundRect'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: trendData.months,
      axisLine: {
        lineStyle: {
          color: '#e8eaed',
          width: 1
        }
      },
      axisLabel: {
        color: '#8c8c8c',
        fontSize: 12,
        margin: 12
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          color: '#f5f5f5',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#8c8c8c',
        fontSize: 12,
        formatter: '{value}'
      }
    },
    series: [
      {
        name: '领养申请',
        type: 'line',
        data: trendData.adoption,
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
        symbolOffset: [0, 0],
        itemStyle: {
          color: '#667eea',
          borderWidth: 3,
          borderColor: '#fff',
          shadowBlur: 6,
          shadowColor: 'rgba(102, 126, 234, 0.4)'
        },
        lineStyle: {
          width: 3,
          color: '#667eea',
          shadowColor: 'rgba(102, 126, 234, 0.3)',
          shadowBlur: 10,
          shadowOffsetY: 5
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(102, 126, 234, 0.4)' },
            { offset: 0.5, color: 'rgba(102, 126, 234, 0.15)' },
            { offset: 1, color: 'rgba(102, 126, 234, 0.02)' }
          ])
        },
        emphasis: {
          scale: true,
          itemStyle: {
            color: '#667eea',
            borderWidth: 4,
            shadowBlur: 15,
            shadowColor: 'rgba(102, 126, 234, 0.6)'
          }
        },
        animationDuration: 2000,
        animationEasing: 'cubicInOut'
      },
      {
        name: '救助申请',
        type: 'line',
        data: trendData.rescue,
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
        symbolOffset: [0, 0],
        itemStyle: {
          color: '#4ECDC4',
          borderWidth: 3,
          borderColor: '#fff',
          shadowBlur: 6,
          shadowColor: 'rgba(78, 205, 196, 0.4)'
        },
        lineStyle: {
          width: 3,
          color: '#4ECDC4',
          shadowColor: 'rgba(78, 205, 196, 0.3)',
          shadowBlur: 10,
          shadowOffsetY: 5
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(78, 205, 196, 0.4)' },
            { offset: 0.5, color: 'rgba(78, 205, 196, 0.15)' },
            { offset: 1, color: 'rgba(78, 205, 196, 0.02)' }
          ])
        },
        emphasis: {
          scale: true,
          itemStyle: {
            color: '#4ECDC4',
            borderWidth: 4,
            shadowBlur: 15,
            shadowColor: 'rgba(78, 205, 196, 0.6)'
          }
        },
        animationDuration: 2000,
        animationDelay: 400,
        animationEasing: 'cubicInOut'
      }
    ]
  }

  chart.setOption(option)
}

function initPetTypeChart() {
  if (!petTypeChart.value) return

  const existingChart = echarts.getInstanceByDom(petTypeChart.value)
  if (existingChart) {
    existingChart.dispose()
    charts = charts.filter(c => c !== existingChart)
  }

  const chart = echarts.init(petTypeChart.value)
  charts.push(chart)

  const data = petTypeData.value.length > 0 ? petTypeData.value : [{ name: '暂无数据', value: 1 }]

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e8eaed',
      borderWidth: 1,
      borderRadius: 12,
      padding: [12, 16],
      textStyle: {
        color: '#333',
        fontSize: 13
      },
      formatter: '{b}: {c} 只 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center',
      itemWidth: 14,
      itemHeight: 14,
      itemGap: 16,
      textStyle: {
        color: '#666',
        fontSize: 12
      },
      icon: 'circle'
    },
    series: [
      {
        name: '宠物类型',
        type: 'pie',
        radius: ['50%', '75%'],
        center: ['58%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 14,
          borderColor: '#fff',
          borderWidth: 4,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.1)'
        },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333'
          },
          scale: true,
          scaleSize: 10,
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        },
        labelLine: { show: false },
        data: data,
        color: [
          '#667eea',
          '#4ECDC4',
          '#FF6B6B',
          '#FFE66D',
          '#95E1D3',
          '#A8E6CF'
        ],
        animationDuration: 1500,
        animationEasing: 'cubicOut'
      }
    ]
  }

  chart.setOption(option)
}

function handleResize() {
  charts.forEach(chart => chart.resize())
}

watch(trendTab, () => {
  updateTrendData()
  if (trendChart.value) {
    initTrendChart()
  }
})

onMounted(() => {
  fetchData().then(() => {
    initCharts()
  })

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  charts.forEach(chart => chart.dispose())
})
</script>

<style scoped lang="scss">
.dashboard-container {
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
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  :deep(.el-card__header) {
    background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
    border-bottom: 1px solid #e0e0e0;
    padding: 16px 20px;
  }

  :deep(.el-card__body) {
    padding: 20px;
  }

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.15);
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  margin-bottom: 0;

  :deep(.el-card__body) {
    padding: 24px;
  }
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 16px;
    opacity: 0.3;
    filter: blur(8px);
  }

  &.primary {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(102, 126, 234, 0.25) 100%);
    color: #667eea;

    &::before {
      background: #667eea;
    }
  }

  &.success {
    background: linear-gradient(135deg, rgba(78, 205, 196, 0.15) 0%, rgba(78, 205, 196, 0.25) 100%);
    color: #4ECDC4;

    &::before {
      background: #4ECDC4;
    }
  }

  &.warning {
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(255, 107, 107, 0.25) 100%);
    color: #FF6B6B;

    &::before {
      background: #FF6B6B;
    }
  }

  &.danger {
    background: linear-gradient(135deg, rgba(255, 230, 109, 0.15) 0%, rgba(255, 230, 109, 0.25) 100%);
    color: #FFE66D;

    &::before {
      background: #FFE66D;
    }
  }
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.2;
  letter-spacing: -1px;
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
  margin-top: 6px;
  font-weight: 500;
}

.charts-section {
  margin-bottom: 24px;
}

.chart-row {
  display: grid;
  gap: 20px;
  margin-bottom: 20px;

  &:first-child {
    grid-template-columns: 1fr 380px;
  }
}

.chart-card {
  background: #ffffff;
  border: 1px solid #e8eaed;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  min-height: 340px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #4ECDC4 100%);
  }

  &:hover {
    border-color: #667eea;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
    transition: all 0.3s ease;
  }

  &.large {
    min-height: 340px;
  }
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.chart-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #1a1a2e;
  font-size: 16px;

  svg {
    margin-right: 10px;
    color: #667eea;
    font-size: 20px;
  }
}

.small-tabs {
  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__nav) {
    gap: 4px;
  }

  :deep(.el-tab) {
    padding: 4px 14px;
    font-size: 12px;
    border-radius: 20px;
    color: #8c8c8c;

    &.is-active {
      color: #fff;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
  }

  :deep(.el-tabs__active-bar) {
    display: none;
  }

  :deep(.el-tabs__content) {
    display: none;
  }
}

.chart-content {
  height: calc(100% - 60px);
  width: 100%;
}

@media screen and (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-row:first-child {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-value {
    font-size: 28px;
  }
}
</style>
