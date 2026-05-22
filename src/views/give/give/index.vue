<template>
  <div class="give-page tech-page tech-grid-bg">
    <div class="tech-title">
      <span class="tech-gradient-text">救助信息管理</span>
      <span class="tech-subtitle">管理宠物救助信息、资金筹集及审核流程</span>
    </div>

    <el-card shadow="hover" class="tech-card search-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon">
              <Search />
            </el-icon>
            搜索条件
          </span>
        </div>
      </template>
      <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="80px" class="search-form">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="宠物编码" prop="petId">
              <el-input v-model="queryParams.petId" placeholder="请输入宠物编码" clearable @keyup.enter="handleQuery"
                class="tech-input">
                <template #prefix><el-icon>
                    <Key />
                  </el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="救助状态" prop="rescueStatus">
              <el-select v-model="queryParams.rescueStatus" placeholder="请选择救助状态" clearable class="tech-select">
                <el-option v-for="dict in jzxq" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="紧急程度" prop="urgentLevel">
              <el-select v-model="queryParams.urgentLevel" placeholder="请选择紧急程度" clearable class="tech-select">
                <el-option v-for="dict in jjcd" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="目标资金" prop="targetAmount">
              <el-input v-model="queryParams.targetAmount" placeholder="请输入目标资金" clearable @keyup.enter="handleQuery"
                class="tech-input">
                <template #prefix><el-icon>
                    <Coin />
                  </el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker v-model="queryParams.startTime" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择开始时间" class="tech-date-picker" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker v-model="queryParams.endTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择结束时间"
                class="tech-date-picker" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="发现地点" prop="foundPlace">
              <el-input v-model="queryParams.foundPlace" placeholder="请输入发现地点" clearable @keyup.enter="handleQuery"
                class="tech-input">
                <template #prefix><el-icon>
                    <Location />
                  </el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="审核状态" prop="verifyStatus">
              <el-select v-model="queryParams.verifyStatus" placeholder="请选择审核状态" clearable class="tech-select">
                <el-option v-for="dict in sh" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item>
              <el-button type="primary" class="tech-btn search-btn" @click="handleQuery">
                <el-icon>
                  <Search />
                </el-icon>搜索
              </el-button>
              <el-button class="reset-btn" @click="resetQuery">
                <el-icon>
                  <RefreshRight />
                </el-icon>重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="hover" class="tech-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon">
              <List />
            </el-icon>救助列表
          </span>
          <div class="header-actions">
            <el-button type="primary" class="tech-btn" @click="handleAdd" v-hasPermi="['give:give:add']">
              <el-icon>
                <Plus />
              </el-icon>新增
            </el-button>
            <el-button type="success" class="tech-btn" :disabled="single" @click="handleUpdate"
              v-hasPermi="['give:give:edit']">
              <el-icon>
                <Edit />
              </el-icon>修改
            </el-button>
            <el-button type="danger" class="tech-btn" :disabled="multiple" @click="handleDelete"
              v-hasPermi="['give:give:remove']">
              <el-icon>
                <Delete />
              </el-icon>删除
            </el-button>
            <el-button type="warning" class="tech-btn" @click="handleExport" v-hasPermi="['give:give:export']">
              <el-icon>
                <Download />
              </el-icon>导出
            </el-button>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" :data="giveList" @selection-change="handleSelectionChange" class="tech-table">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="救助ID" align="center" prop="rescueId" width="100">
          <template #default="scope">
            <span class="id-badge">{{ scope.row.rescueId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="宠物编码" align="center" prop="petCode" width="120">
          <template #default="scope">
            <span class="pet-code">{{ scope.row.petCode || scope.row.petId || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="救助状态" align="center" prop="rescueStatus" width="100">
          <template #default="scope">
            <dict-tag :options="jzxq" :value="scope.row.rescueStatus" />
          </template>
        </el-table-column>
        <el-table-column label="紧急程度" align="center" prop="urgentLevel" width="100">
          <template #default="scope">
            <dict-tag :options="jjcd" :value="scope.row.urgentLevel" />
          </template>
        </el-table-column>

        <el-table-column label="需求描述" align="center" prop="needDesc" show-overflow-tooltip min-width="150" />
        <el-table-column label="目标资金" align="center" prop="targetAmount" width="100">
          <template #default="scope">
            <span class="amount-text">{{ scope.row.targetAmount || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已筹资金" align="center" prop="raisedAmount" width="100">
          <template #default="scope">
            <span class="amount-raised">{{ scope.row.raisedAmount || 0 }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="媒体文件" align="center" prop="mediaUrl" width="100">
          <template #default="scope">
            <div v-if="scope.row.mediaUrl" class="media-preview-cell">
              <el-image v-if="isImage(scope.row.mediaUrl)" :src="getImageUrl(scope.row.mediaUrl)" fit="cover"
                class="media-thumb" :preview-src-list="[getImageUrl(scope.row.mediaUrl)]" />
              <el-icon v-else class="media-icon">
                <VideoCamera />
              </el-icon>
            </div>
            <span v-else class="empty-text">-</span>
          </template>
        </el-table-column> -->
        <el-table-column label="审核状态" align="center" prop="verifyStatus" width="100">
          <template #default="scope">
            <dict-tag :options="sh" :value="scope.row.verifyStatus" />
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180" fixed="right">
          <template #default="scope">
            <div class="action-btns">
              <el-button link type="primary" class="action-btn view-btn" @click="handleView(scope.row.rescueId)">
                <el-icon>
                  <View />
                </el-icon>查看
              </el-button>
              <el-button v-if="scope.row.verifyStatus === 0 && userStore.roleId === 1" size="small" type="primary"
                class="action-btn approve-btn" @click="handleApprove(scope.row.rescueId)">
                <el-icon>
                  <Check />
                </el-icon>审核
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" class="tech-pagination" />
    </el-card>

    <!-- 添加或修改救助信息对话框 -->
    <el-dialog :title="title" v-model="open" width="750px" append-to-body class="tech-dialog">
      <el-form ref="giveRef" :model="form" :rules="rules" label-width="100px" class="give-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="宠物名称" prop="petId">
              <el-select v-model="form.petId" placeholder="请选择宠物名称" class="tech-select">
                <el-option v-for="pet in petList" :key="pet.value" :label="pet.label" :value="pet.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="救助状态" prop="rescueStatus">
              <el-select v-model="form.rescueStatus" placeholder="请选择救助状态" class="tech-select">
                <el-option v-for="dict in jzxq" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
            <el-form-item label="紧急程度" prop="urgentLevel">
              <el-select v-model="form.urgentLevel" placeholder="请选择紧急程度" class="tech-select">
                <el-option v-for="dict in jjcd" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>

            <el-form-item label="目标资金" prop="targetAmount">
              <el-input v-model="form.targetAmount" placeholder="请输入目标资金" class="tech-input">
                <template #prefix><el-icon>
                    <Coin />
                  </el-icon></template>
                <template #suffix><span class="input-suffix">元</span></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="已筹资金" prop="raisedAmount">
              <el-input v-model="form.raisedAmount" placeholder="请输入已筹资金" class="tech-input">
                <template #prefix><el-icon>
                    <Coin />
                  </el-icon></template>
                <template #suffix><span class="input-suffix">元</span></template>
              </el-input>
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker v-model="form.startTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择开始时间"
                class="tech-date-picker" />
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker v-model="form.endTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择结束时间"
                class="tech-date-picker" />
            </el-form-item>
            <el-form-item label="发现地点" prop="foundPlace">
              <el-input v-model="form.foundPlace" placeholder="请输入发现地点" class="tech-input">
                <template #prefix><el-icon>
                    <Location />
                  </el-icon></template>
              </el-input>
            </el-form-item>
            <el-form-item label="审核状态" prop="verifyStatus">
              <el-select v-model="form.verifyStatus" placeholder="请选择审核状态" class="tech-select">
                <el-option v-for="dict in sh" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="需求类型" prop="needType">
              <el-select v-model="form.needType" placeholder="请选择需求类型" class="tech-select">
                <el-option label="物品" :value="1" />
                <el-option label="资金" :value="2" />
                <el-option label="志愿服务" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="需求描述" prop="needDesc">
              <el-input v-model="form.needDesc" type="textarea" placeholder="请输入需求描述" :rows="3" class="tech-textarea" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!-- <el-col :span="12">
            <el-form-item label="封面图片" prop="mediaUrl">
              <el-upload class="avatar-uploader" action="#" :on-change="handleMediaUpload" :auto-upload="false"
                accept="image/*" :show-file-list="false">
                <div v-if="form.mediaUrl" class="media-preview">
                  <el-image :src="form.mediaUrl" fit="cover" class="uploaded-image" />
                  <div class="media-overlay">
                    <el-icon>
                      <Refresh />
                    </el-icon>
                    <span>更换</span>
                  </div>
                </div>
                <div v-else class="upload-placeholder">
                  <el-icon class="upload-icon">
                    <Plus />
                  </el-icon>
                  <span>上传封面图片</span>
                </div>
              </el-upload>
            </el-form-item>
          </el-col> -->

        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel" class="cancel-btn">取 消</el-button>
          <el-button type="primary" @click="submitForm" class="tech-btn">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 审核对话框 -->
    <el-dialog v-model="approveDialogVisible" title="审核救助信息" width="500px" class="tech-dialog">
      <el-form :model="approveForm" :rules="{
        result: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
        comments: [{ required: true, message: '请填写审核意见', trigger: 'blur' }]
      }" ref="approveFormRef" label-width="100px">
        <el-form-item label="审核结果" prop="result">
          <el-radio-group v-model="approveForm.result">
            <el-radio label="1">通过</el-radio>
            <el-radio label="2">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见" prop="comments">
          <el-input type="textarea" v-model="approveForm.comments" :rows="4" placeholder="请填写审核意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="approveDialogVisible = false" class="cancel-btn">取 消</el-button>
          <el-button type="primary" @click="submitApprove" class="tech-btn">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Give">
import { listGive, getGive, delGive, addGive, updateGive } from "@/api/give/give"
import { listInfo } from "@/api/pet/info"
import useUserStore from "@/store/modules/user"
import { Search, RefreshRight, Plus, Edit, Delete, Download, Key, User, List, Refresh, Coin, Location, Check, Close, View } from '@element-plus/icons-vue'
import { useDict } from "@/utils/dict"
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
import { ElMessage, ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance()

const { ljsc, xuqiuteurs, sh, jzxq, jjcd } = useDict('ljsc', 'xuqiuteurs', 'sh', 'jzxq', 'jjcd')
const userStore = useUserStore()

const giveList = ref([])
const petList = ref([])  // 宠物列表，用于下拉框选择
const petCodeMap = ref({})  // petId -> petCode 映射
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const approveDialogVisible = ref(false)
const currentApproveId = ref(null)
const approveForm = ref({
  result: '',
  comments: ''
})
const approveFormRef = ref(null)

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    petId: null,
    rescueTitle: null,
    rescueStatus: null,
    urgentLevel: null,
    needDesc: null,
    targetAmount: null,
    raisedAmount: null,
    startTime: null,
    endTime: null,
    foundPlace: null,
    mediaUrl: null,
    verifyStatus: null,
    isDeleted: null
  },
  rules: {
    petId: [{ required: true, message: "宠物ID不能为空", trigger: "blur" }],
    rescueStatus: [{ required: true, message: "救助状态不能为空", trigger: "change" }],
    urgentLevel: [{ required: true, message: "紧急程度不能为空", trigger: "change" }],
    needType: [{ required: true, message: "需求类型不能为空", trigger: "change" }],
    needDesc: [{ required: true, message: "需求描述不能为空", trigger: "blur" }],
    startTime: [{ required: true, message: "开始时间不能为空", trigger: "blur" }],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询救助信息列表 */
async function getList() {
  loading.value = true
  try {
    // 并行获取救助列表和宠物列表
    const [giveResponse, petResponse] = await Promise.all([
      listGive(queryParams.value),
      listInfo({ pageNum: 1, pageSize: 100 })
    ])

    // 构建 petId -> petCode 映射
    petCodeMap.value = {}
    if (petResponse && petResponse.rows) {
      petResponse.rows.forEach(item => {
        petCodeMap.value[item.petId] = item.petCode || item.pet_code || ''
      })
    }

    // 将宠物编码添加到救助列表中
    if (giveResponse && giveResponse.rows) {
      giveList.value = giveResponse.rows.map(giveItem => ({
        ...giveItem,
        petCode: petCodeMap.value[giveItem.petId] || ''
      }))
    } else {
      giveList.value = []
    }

    total.value = giveResponse ? giveResponse.total : 0
  } catch (error) {
    console.error('获取救助列表失败:', error)
    giveList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

/** 加载宠物列表用于下拉框选择 */
async function loadPetList() {
  const response = await listInfo({ pageNum: 1, pageSize: 100 })
  petList.value = (response.rows || []).map(item => {
    const code = item.petCode || item.pet_code || ''
    return {
      value: item.petId,
      label: code ? `${item.petName || '未知宠物'} (${code})` : (item.petName || '未知宠物'),
      petCode: code
    }
  })
}

// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  form.value = {
    rescueId: null,
    petId: null,
    rescueTitle: '',
    rescueStatus: null,
    urgentLevel: null,
    needType: null,
    needDesc: null,
    targetAmount: null,
    raisedAmount: null,
    startTime: null,
    endTime: null,
    foundPlace: null,
    mediaUrl: null,
    verifyStatus: null,
    createTime: null,
    updateTime: null,
    isDeleted: null
  }
  proxy.resetForm("giveRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.rescueId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  loadPetList()  // 加载宠物列表
  open.value = true
  title.value = "添加救助信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _rescueId = row.rescueId || ids.value
  // 先加载宠物列表，再获取救助信息
  loadPetList().then(() => {
    getGive(_rescueId).then(response => {
      form.value = response.data
      // 根据 petId 获取宠物编码
      const pet = petList.value.find(item => item.value === form.value.petId)
      if (pet) {
        form.value.petCode = pet.petCode
      }
      open.value = true
      title.value = "修改救助信息"
    })
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["giveRef"].validate(valid => {
    if (valid) {
      if (!form.value.rescueTitle) {
        form.value.rescueTitle = ''
      }
      if (form.value.rescueId != null) {
        updateGive(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addGive(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _rescueIds = row.rescueId || ids.value
  proxy.$modal.confirm('是否确认删除救助信息编号为"' + _rescueIds + '"的数据项？').then(function () {
    return delGive(_rescueIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 查看按钮操作 */
function handleView(id) {
  router.push(`/give/give/detail/${id}`)
}

/** 审核按钮操作 */
function handleApprove(id) {
  currentApproveId.value = id
  approveForm.value.result = ''
  approveForm.value.comments = ''
  approveDialogVisible.value = true
}

/** 提交审核 */
function submitApprove() {
  if (!approveFormRef.value) return
  approveFormRef.value.validate(valid => {
    if (valid) {
      try {
        updateGive({
          rescueId: currentApproveId.value,
          verifyStatus: parseInt(approveForm.value.result),
          verifyUserId: userStore.id,
          comments: approveForm.value.comments
        }).then(() => {
          proxy.$modal.msgSuccess("审核成功")
          approveDialogVisible.value = false
          getList()
        }).catch(() => {
          proxy.$modal.msgError("审核失败")
        })
      } catch (error) {
        proxy.$modal.msgError("审核失败")
      }
    }
  })
}

// 处理图片URL
function getImageUrl(url) {
  if (!url) return ''
  // 检查是否是本地文件路径
  if (url.startsWith('D:') || url.startsWith('C:') || url.includes('\\')) {
    // 对于本地路径，使用默认图片
    return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pet%20rescue&image_size=square`
  }
  return url
}

// 媒体文件上传处理（使用本地预览并压缩）
function handleMediaUpload(file) {
  const rawFile = file.raw
  if (!rawFile.type.startsWith('image/')) {
    proxy.$modal.msgError('请上传图片文件')
    return
  }

  // 压缩图片
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      // 设置最大尺寸
      const maxWidth = 600
      const maxHeight = 600
      let width = img.width
      let height = img.height

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = width * ratio
        height = height * ratio
      }

      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)

      // 逐级压缩，确保图片大小在合理范围内
      let quality = 0.5
      let compressedDataUrl = canvas.toDataURL('image/jpeg', quality)

      // 如果压缩后仍然太大（超过500KB），继续降低质量
      while (compressedDataUrl.length > 500 * 1024 && quality > 0.2) {
        quality -= 0.1
        compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
      }

      form.value.mediaUrl = compressedDataUrl
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(rawFile)
}

/** 导出按钮操作 */
function handleExport() {
  const url = '/give/give/export?' + new URLSearchParams(queryParams.value).toString()
  window.open(url, '_blank')
}

getList()
</script>

<style scoped lang="scss">
.give-page {
  padding: 20px;
  min-height: calc(100vh - 84px);
  background: #ffffff;
}

.tech-title {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  .tech-gradient-text {
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .tech-subtitle {
    display: block;
    margin-top: 8px;
    font-size: 14px;
    color: #666666;
  }
}

.tech-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #007bff, #6610f2);
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
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #333333;

    .title-icon {
      font-size: 18px;
      color: #007bff;
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

.search-form {
  .el-form-item {
    margin-bottom: 16px;

    :deep(.el-form-item__label) {
      color: #666666;
    }
  }
}

.tech-input,
.tech-select,
.tech-date-picker {
  width: 100%;

  :deep(.el-input__wrapper) {
    background: #ffffff;
    border: 1px solid #ddd;
    box-shadow: none;

    &:hover,
    &:focus {
      border-color: #007bff;
    }
  }

  :deep(.el-input__inner) {
    color: #333333;
    background: transparent;

    &::placeholder {
      color: #999999;
    }
  }

  :deep(.el-input__prefix) {
    color: #007bff;
  }
}

.tech-date-picker {
  :deep(.el-input__wrapper) {
    padding-left: 11px;
  }
}

.tech-btn {
  background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
  border: none;
  color: #fff;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &.is-disabled {
    background: #1e2746;
    color: #64748b;
  }
}

.reset-btn {
  background: transparent;
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: #94a3b8;

  &:hover {
    border-color: #00d4ff;
    color: #00d4ff;
  }
}

.tech-table {
  background: transparent;

  :deep(.el-table__header) {
    th {
      background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
      color: #333333;
      font-weight: 600;
      border-bottom: 1px solid #dee2e6;
      padding: 14px 0;
    }
  }

  :deep(.el-table__body) {
    tr {
      background: #ffffff;

      &:hover {
        background: rgba(0, 123, 255, 0.05) !important;
      }

      td {
        color: #333333;
        border-bottom: 1px solid #e9ecef;
        padding: 12px 0;
      }
    }
  }

  :deep(.el-table__empty-block) {
    background: #ffffff;
  }

  :deep(.el-checkbox__inner) {
    background: #ffffff;
    border-color: #ddd;

    &:hover {
      border-color: #007bff;
    }
  }
}

.id-badge {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 4px;
  color: #00d4ff;
  font-family: monospace;
  font-size: 12px;
}

.pet-code {
  color: #007bff;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.amount-text,
.amount-raised {
  color: #f59e0b;
  font-weight: 600;
  font-size: 14px;
}

.amount-raised {
  color: #10b981;
}

.media-preview-cell {
  display: flex;
  justify-content: center;
  align-items: center;

  .media-thumb {
    width: 50px;
    height: 50px;
    border-radius: 6px;
    border: 1px solid rgba(0, 212, 255, 0.3);
  }

  .media-icon {
    font-size: 24px;
    color: #00d4ff;
  }
}

.empty-text {
  color: #64748b;
}

.action-btns {
  display: flex;
  justify-content: center;
  gap: 8px;

  .action-btn {
    padding: 4px 8px;

    &:hover {
      transform: scale(1.05);
    }
  }
}

.tech-pagination {
  margin-top: 20px;

  :deep(.el-pagination__total),
  :deep(.el-pagination__jump) {
    color: #94a3b8;
  }

  :deep(.el-pager li) {
    background: #1e2746;
    border: 1px solid rgba(0, 212, 255, 0.2);
    color: #94a3b8;

    &:hover {
      color: #00d4ff;
      border-color: #00d4ff;
    }

    &.is-active {
      background: #00d4ff;
      border-color: #00d4ff;
      color: #fff;
    }
  }

  :deep(.btn-prev),
  :deep(.btn-next) {
    background: #1e2746;
    border: 1px solid rgba(0, 212, 255, 0.2);
    color: #94a3b8;

    &:hover {
      color: #00d4ff;
    }
  }
}

.tech-dialog {
  :deep(.el-dialog) {
    background: #111936;
    border: 1px solid rgba(0, 212, 255, 0.3);
    border-radius: 12px;
  }

  :deep(.el-dialog__header) {
    background: rgba(0, 212, 255, 0.05);
    border-bottom: 1px solid rgba(0, 212, 255, 0.1);
    margin-right: 0;
    padding: 16px 20px;
  }

  :deep(.el-dialog__title) {
    color: #00d4ff;
    font-weight: 600;
  }

  :deep(.el-dialog__body) {
    padding: 20px;
  }

  :deep(.el-dialog__footer) {
    border-top: 1px solid rgba(0, 212, 255, 0.1);
    padding: 16px 20px;
  }
}

.give-form {
  .el-form-item__label {
    color: #94a3b8;
  }

  .input-suffix {
    color: #64748b;
    font-size: 12px;
  }
}

.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed rgba(0, 212, 255, 0.3);
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;

    &:hover {
      border-color: #00d4ff;
      background: rgba(0, 212, 255, 0.05);
    }
  }
}

.media-preview {
  width: 120px;
  height: 120px;
  position: relative;

  .uploaded-image {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
  }

  .uploaded-video-icon {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    color: #00d4ff;
    background: rgba(0, 212, 255, 0.1);
    border-radius: 8px;
  }

  .media-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    opacity: 0;
    transition: opacity 0.3s;
    border-radius: 8px;

    &:hover {
      opacity: 1;
    }

    .el-icon {
      font-size: 24px;
      margin-bottom: 4px;
    }
  }
}

.upload-placeholder {
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;

  .upload-icon {
    font-size: 28px;
    margin-bottom: 8px;
    color: #00d4ff;
  }

  span {
    font-size: 12px;
  }
}

.tech-textarea {
  :deep(.el-textarea__inner) {
    background: #ffffff;
    border: 1px solid rgba(0, 212, 255, 0.2);
    color: #000000;

    &:focus {
      border-color: #00d4ff;
    }

    &::placeholder {
      color: #999999;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  .cancel-btn {
    background: transparent;
    border: 1px solid rgba(0, 212, 255, 0.3);
    color: #94a3b8;

    &:hover {
      border-color: #00d4ff;
      color: #00d4ff;
    }
  }
}

:deep(.el-form-item__label) {
  color: #94a3b8;
}

:deep(.el-select-dropdown) {
  background: #1e2746;
  border: 1px solid rgba(0, 212, 255, 0.2);

  .el-select-dropdown__item {
    color: #94a3b8;

    &:hover,
    &.selected {
      background: rgba(0, 212, 255, 0.1);
      color: #00d4ff;
    }
  }
}
</style>
