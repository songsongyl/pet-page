<template>
  <div class="app-container home">
    <!-- 轮播图 -->
    <el-carousel :interval="5000" type="card" height="400px" class="home-carousel">
      <el-carousel-item v-for="item in carouselItems" :key="item.id">
        <div class="carousel-item">
          <img :src="item.image" alt="{{ item.title }}" class="carousel-image" />
          <div class="carousel-content">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <!-- 平台简介 -->
    <div class="home-section">
      <h2 class="section-title">关于我们</h2>
      <div class="about-content">
        <p>毛孩子的家是一个致力于流浪宠物救助、领养和公益活动的平台。我们的使命是为每一个毛孩子找到温暖的家，同时通过公益活动传递爱心，让更多人关注流浪宠物的生存状况。</p>
        <p>我们提供宠物领养、救助需求发布、公益捐赠、知识课堂等服务，希望通过我们的努力，让更多的毛孩子得到关爱和帮助。</p>
      </div>
    </div>

    <!-- 热门待领养宠物 -->
    <div class="home-section pet-section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="title-icon">🐾</span>
          热门待领养宠物
        </h2>
        <p class="section-subtitle">每一个毛孩子都值得被爱，快来找到你的专属小伙伴吧~</p>
      </div>
      <div class="pet-cards">
        <div v-for="pet in hotPets" :key="pet.id" class="pet-card-wrapper">
          <el-card class="pet-card" shadow="hover">
            <div class="pet-image-container">
              <el-image :src="pet.image" fit="cover" class="pet-image" />
              <div class="pet-status-badge">
                <span class="status-dot"></span>
                待领养
              </div>
              <div class="pet-gender-badge" :class="pet.gender === '公' ? 'male' : 'female'">
                {{ pet.gender === '公' ? '♂' : '♀' }}
              </div>
            </div>
            <div class="pet-info">
              <div class="pet-name-row">
                <h3 class="pet-name">{{ pet.name }}</h3>
                <div class="pet-tags">
                  <span class="pet-tag">{{ pet.breed }}</span>
                  <span class="pet-tag age-tag">{{ pet.age }}岁</span>
                </div>
              </div>
              <div class="pet-description">
                <p>{{ pet.description }}</p>
              </div>
              <div class="pet-details">
                <div class="detail-item">
                  <span class="detail-icon">❤️</span>
                  <span>{{ pet.temperament }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">🏥</span>
                  <span>{{ pet.healthStatus }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">📍</span>
                  <span>{{ pet.location }}</span>
                </div>
              </div>
              <div class="pet-stats">
                <div class="stat-item">
                  <span class="stat-value">{{ pet.likes }}</span>
                  <span class="stat-label">喜欢</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <span class="stat-value">{{ pet.views }}</span>
                  <span class="stat-label">浏览</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <span class="stat-value">{{ pet.applicants }}</span>
                  <span class="stat-label">申请</span>
                </div>
              </div>
              <el-button type="primary" size="small" class="adopt-btn" @click="handleAdopt(pet.id)">
                <span class="btn-icon">🏠</span>
                申请领养
              </el-button>
            </div>
          </el-card>
        </div>
      </div>
    </div>

    <!-- 最新救助需求 -->
    <div class="home-section">
      <h2 class="section-title">最新救助需求</h2>
      <div class="rescue-cards">
        <el-card v-for="rescue in latestRescues" :key="rescue.id" shadow="hover" class="rescue-card">
          <h3>{{ rescue.title }}</h3>
          <p class="rescue-desc">{{ rescue.description }}</p>
          <div class="rescue-progress">
            <el-progress :percentage="rescue.progress" />
            <p class="progress-text">{{ rescue.raisedAmount }} / {{ rescue.targetAmount }} 元</p>
          </div>
          <el-button type="primary" size="small" class="donate-btn" @click="handleDonate(rescue.id)">立即捐赠</el-button>
        </el-card>
      </div>
    </div>

    <!-- 知识课堂精选 -->
    <div class="home-section">
      <h2 class="section-title">知识课堂精选</h2>
      <div class="course-cards">
        <el-card v-for="course in courses" :key="course.id" shadow="hover" class="course-card">
          <div class="course-image">
            <el-image :src="course.image" fit="cover" />
          </div>
          <div class="course-info">
            <h3>{{ course.title }}</h3>
            <p class="course-teacher">{{ course.teacher }}</p>
            <p class="course-views">{{ course.views }} 次查看</p>
            <el-button type="primary" size="small" class="course-btn"
              @click="handleViewCourse(course.id)">查看课程</el-button>
          </div>
        </el-card>
      </div>
    </div>


  </div>
</template>

<script setup name="Index">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listInfo } from '@/api/pet/info'
import { listGive } from '@/api/give/give'
import { listCourse } from '@/api/course/course'
import { getOrganizationList } from '@/api/admin/organization'

const router = useRouter()

// 轮播图数据
const carouselItems = ref([
  {
    id: 1,
    title: "欢迎来到毛孩子的家",
    description: "为每一个毛孩子找到温暖的家",
    image: "/image/1.png"
  },
  {
    id: 2,
    title: "救助流浪宠物",
    description: "让我们一起帮助流浪的毛孩子",
    image: "/image/2.png"
  },
  {
    id: 3,
    title: "知识课堂",
    description: "学习如何更好地照顾你的宠物",
    image: "/image/3.png"
  }
])

// 热门宠物数据
const hotPets = ref([])

// 最新救助需求
const latestRescues = ref([])

// 知识课堂课程
const courses = ref([])

// 合作机构
const organizations = ref([])

// 默认宠物描述模板（当数据库无数据时使用）
const petDescriptions = [
  '性格温顺，喜欢撒娇，是个粘人的小宝贝~',
  '活泼好动，好奇心强，喜欢和人互动玩耍！',
  '安静乖巧，适合陪伴，是治愈系小天使！',
  '聪明伶俐，学东西很快，期待与你相遇！',
  '亲人友善，喜欢被抱抱，快来带走我吧~',
  '调皮可爱，给你带来无限欢乐！'
]

const temperaments = ['温顺粘人', '活泼好动', '安静乖巧', '聪明伶俐', '亲人友善', '调皮可爱']
const healthStatuses = ['已驱虫', '已疫苗', '已绝育', '健康良好']
const locations = ['北京市', '上海市', '广州市', '成都市', '杭州市', '深圳市']

// 宠物类型映射（从数据库获取的petType数字转换为中文）
const petTypeMap = {
  1: '猫',
  2: '狗',
  3: '兔子',
  4: '仓鼠',
  5: '鸟类',
  6: '其他'
}

// 性别映射
const genderMap = {
  0: '母',
  1: '公',
  'female': '母',
  'male': '公',
  '女': '母',
  '男': '公'
}

// 加载热门宠物数据（只显示待领养的宠物）
const loadHotPets = async () => {
  try {
    const response = await listInfo({ pageNum: 1, pageSize: 20, petStatus: 3 })
    const pets = response.rows || []

    if (pets.length === 0) {
      // 如果数据库没有待领养宠物，使用模拟数据
      hotPets.value = generateMockPets()
      return
    }

    // 使用数据库真实数据，字段不存在时使用默认值
    hotPets.value = pets.slice(0, 6).map((item, index) => {
      // 获取性别
      const petGender = item.petGender || item.gender
      const gender = genderMap[petGender] || (Math.random() > 0.5 ? '公' : '母')

      // 获取年龄
      const petAge = item.petAge || item.age
      const age = petAge > 0 ? petAge : Math.floor(Math.random() * 5) + 1

      // 获取图片
      const imageUrl = getImageUrl(item.mediaUrl || item.petImage || item.image)
      const image = imageUrl || `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20pet%20portrait%20adorable&image_size=square`

      // 获取品种
      const petType = item.petType
      const breed = item.petBreed || item.breed || petTypeMap[petType] || '待确认'

      // 获取描述
      const description = item.petDesc || item.description || item.intro || petDescriptions[index % petDescriptions.length]

      // 获取位置（从关联表获取）
      const location = item.address || item.city || locations[index % locations.length]

      return {
        id: item.petId || item.id,
        name: item.petName || item.name || '待领养宠物',
        breed: breed,
        age: age,
        gender: gender,
        image: image,
        description: description,
        temperament: item.temperament || temperaments[index % temperaments.length],
        healthStatus: item.healthStatus || item.health || healthStatuses[index % healthStatuses.length],
        location: location,
        likes: item.likeCount || item.likes || Math.floor(Math.random() * 200) + 50,
        views: item.viewCount || item.views || Math.floor(Math.random() * 500) + 100,
        applicants: item.applyCount || item.applicants || Math.floor(Math.random() * 10) + 1
      }
    })
  } catch (error) {
    console.error('加载宠物数据失败:', error)
    // 如果加载失败，使用模拟数据
    hotPets.value = generateMockPets()
  }
}

// 生成模拟宠物数据（备用）
const generateMockPets = () => {
  const breeds = ['橘猫', '英短', '金毛', '泰迪', '布偶猫', '哈士奇']
  return breeds.map((breed, index) => ({
    id: index + 1,
    name: ['橘子', '球球', '旺财', '豆豆', '布丁', '哈哈'][index],
    breed: breed,
    age: Math.floor(Math.random() * 5) + 1,
    gender: index % 2 === 0 ? '公' : '母',
    image: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20${breed}%20pet%20portrait%20adorable&image_size=square`,
    description: petDescriptions[index % petDescriptions.length],
    temperament: temperaments[index % temperaments.length],
    healthStatus: healthStatuses[index % healthStatuses.length],
    location: locations[index % locations.length],
    likes: Math.floor(Math.random() * 200) + 50,
    views: Math.floor(Math.random() * 500) + 100,
    applicants: Math.floor(Math.random() * 10) + 1
  }))
}

// 加载最新救助需求
const loadLatestRescues = async () => {
  try {
    const response = await listGive({ pageNum: 1, pageSize: 6 })
    latestRescues.value = (response.rows || []).slice(0, 3).map(item => {
      const raisedAmount = item.raisedAmount || 0
      const targetAmount = item.targetAmount || 0
      console.log("救助需求:", item)

      const progress = item.progress || (targetAmount > 0 ? Math.min(Math.round((raisedAmount / targetAmount) * 100), 100) : 0)
      return {
        id: item.rescueId || item.id,
        title: item.rescueTitle || item.title || '救助需求',
        description: item.needDesc || item.description || '暂无描述',
        targetAmount: targetAmount,
        raisedAmount: raisedAmount,
        progress: progress
      }
    })
  } catch (error) {
    console.error('加载救助数据失败:', error)
  }
}

// 处理图片URL
const getImageUrl = (url) => {
  if (!url) return ''
  // 检查是否是本地文件路径
  if (url.startsWith('D:') || url.startsWith('C:') || url.includes('\\')) {
    // 对于本地路径，使用默认图片
    return 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pet%20training%20course&image_size=square'
  }
  return url
}

// 加载知识课堂课程
const loadCourses = async () => {
  try {
    const response = await listCourse({ pageNum: 1, pageSize: 6 })
    courses.value = (response.rows || []).slice(0, 3).map(item => ({
      id: item.courseId || item.id,
      title: item.courseTitle || item.title || '宠物护理课程',
      teacher: item.teacherName || item.teacher || '专业讲师',
      views: item.viewCount || item.views || 0,
      image: getImageUrl(item.courseCover || item.image) || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pet%20training%20course&image_size=square'
    }))
  } catch (error) {
    console.error('加载课程数据失败:', error)
  }
}

// 加载合作机构
const loadOrganizations = async () => {
  try {
    const response = await getOrganizationList({ pageNum: 1, pageSize: 10 })
    organizations.value = (response.rows || []).slice(0, 3).map(item => ({
      id: item.organizationId || item.id,
      logo: item.logo || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pet%20organization%20logo&image_size=square'
    }))
  } catch (error) {
    console.error('加载机构数据失败:', error)
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadHotPets()
  loadLatestRescues()
  loadCourses()
  loadOrganizations()
})

// 申请领养
const handleAdopt = (petId) => {
  router.push({ path: '/adoption/application', query: { petId: petId } })
}

// 立即捐赠
const handleDonate = (rescueId) => {
  router.push('/donation/application')
}

// 查看课程
const handleViewCourse = (courseId) => {
  router.push(`/course/detail/${courseId}`)
}
</script>

<style scoped lang="scss">
.home {
  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #333;
  overflow-x: hidden;

  .home-carousel {
    margin-bottom: 40px;

    .carousel-item {
      position: relative;
      height: 100%;

      .carousel-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .carousel-content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 20px;
        background: rgba(0, 0, 0, 0.6);
        color: white;

        h3 {
          margin: 0 0 10px 0;
          font-size: 24px;
        }

        p {
          margin: 0;
          font-size: 16px;
        }
      }
    }
  }

  .home-section {
    margin-bottom: 40px;
    padding: 0 20px;

    .section-title {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 30px;
      color: #333;
    }
  }

  .about-content {
    text-align: center;
    line-height: 1.8;
    max-width: 800px;
    margin: 0 auto;
  }

  .pet-section {
    background: linear-gradient(135deg, #fef7f0 0%, #f5f0ff 100%);
    padding: 40px 20px;
    margin: 20px -20px;
    border-radius: 20px;

    .section-header {
      text-align: center;
      margin-bottom: 35px;

      .section-title {
        font-size: 28px;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 10px;

        .title-icon {
          margin-right: 10px;
          font-size: 24px;
        }
      }

      .section-subtitle {
        font-size: 15px;
        color: #7f8c8d;
        margin: 0;
      }
    }
  }

  .pet-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
    max-width: 1200px;
    margin: 0 auto;

    .pet-card-wrapper {
      animation: fadeInUp 0.6s ease-out forwards;

      @for $i from 1 through 6 {
        &:nth-child(#{$i}) {
          animation-delay: #{$i * 0.1}s;
          opacity: 0;
        }
      }
    }

    .pet-card {
      overflow: hidden;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      border: none;

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
      }

      .pet-image-container {
        position: relative;
        height: 220px;
        overflow: hidden;

        .pet-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        &:hover .pet-image {
          transform: scale(1.08);
        }

        .pet-status-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(255, 255, 255, 0.95);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          color: #27ae60;
          display: flex;
          align-items: center;
          gap: 6px;
          backdrop-filter: blur(4px);

          .status-dot {
            width: 8px;
            height: 8px;
            background: #27ae60;
            border-radius: 50%;
            animation: pulse 2s infinite;
          }
        }

        .pet-gender-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: bold;

          &.male {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
          }

          &.female {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
          }
        }
      }

      .pet-info {
        padding: 20px;
        background: white;

        .pet-name-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;

          .pet-name {
            font-size: 20px;
            font-weight: 600;
            color: #2c3e50;
            margin: 0;
          }

          .pet-tags {
            display: flex;
            gap: 6px;

            .pet-tag {
              padding: 4px 10px;
              background: linear-gradient(135deg, #f8f9fa, #e9ecef);
              border-radius: 12px;
              font-size: 12px;
              color: #495057;

              &.age-tag {
                background: linear-gradient(135deg, #fff3cd, #ffeeba);
                color: #856404;
              }
            }
          }
        }

        .pet-description {
          margin-bottom: 15px;

          p {
            font-size: 14px;
            color: #6c757d;
            line-height: 1.6;
            margin: 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }

        .pet-details {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          flex-wrap: wrap;

          .detail-item {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 13px;
            color: #6c757d;

            .detail-icon {
              font-size: 14px;
            }
          }
        }

        .pet-stats {
          display: flex;
          justify-content: space-around;
          padding: 12px 0;
          border-top: 1px solid #f0f0f0;
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 15px;

          .stat-item {
            text-align: center;

            .stat-value {
              display: block;
              font-size: 18px;
              font-weight: 600;
              color: #2c3e50;
            }

            .stat-label {
              font-size: 12px;
              color: #adb5bd;
            }
          }

          .stat-divider {
            width: 1px;
            background: #e9ecef;
          }
        }

        .adopt-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #00b4db, #0083b0);
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 500;
          color: white;
          transition: all 0.3s ease;

          &:hover {
            background: linear-gradient(135deg, #00a3c9, #007399);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 131, 176, 0.3);
          }

          .btn-icon {
            margin-right: 6px;
          }
        }
      }
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {

    0%,
    100% {
      opacity: 1;
    }

    50% {
      opacity: 0.5;
    }
  }

  .rescue-cards,
  .course-cards {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;

    .rescue-card,
    .course-card {
      width: 300px;
      margin-bottom: 20px;

      .rescue-image,
      .course-image {
        height: 200px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .course-info {
        padding: 15px;

        h3 {
          margin: 0 0 10px 0;
          font-size: 18px;
        }

        p {
          margin: 0 0 10px 0;
          color: #666;
        }

        .course-teacher {
          font-size: 14px;
          color: #666;
        }

        .course-views {
          font-size: 14px;
          color: #999;
        }

        .donate-btn,
        .course-btn {
          margin-top: 10px;
        }
      }

      .rescue-desc {
        margin-bottom: 15px;
        line-height: 1.5;
      }

      .rescue-progress {
        margin-bottom: 15px;

        .progress-text {
          text-align: right;
          font-size: 14px;
          color: #666;
          margin-top: 5px;
        }
      }
    }
  }

  .org-logos {
    display: flex;
    gap: 40px;
    flex-wrap: wrap;
    justify-content: center;

    .org-logo {
      width: 150px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      border-radius: 8px;

      img {
        max-width: 120px;
        max-height: 80px;
      }
    }
  }
}
</style>
