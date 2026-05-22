<template>
  <div class="pet-info-page tech-page tech-grid-bg">
    <div class="tech-title">
      <span class="tech-gradient-text">宠物信息管理</span>
      <span class="tech-subtitle">管理宠物档案、健康状态及领养信息</span>
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
            <el-form-item label="宠物名称" prop="petName">
              <el-input v-model="queryParams.petName" placeholder="请输入宠物名称" clearable @keyup.enter="handleQuery"
                class="tech-input">
                <template #prefix><el-icon>
                    <User />
                  </el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="宠物类型" prop="petType">
              <el-select v-model="queryParams.petType" placeholder="请选择宠物类型" clearable class="tech-select">
                <el-option v-for="dict in kv" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="品种" prop="breed">
              <el-input v-model="queryParams.breed" placeholder="请输入品种" clearable @keyup.enter="handleQuery"
                class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="年龄" prop="age">
              <el-input v-model="queryParams.age" placeholder="请输入年龄" clearable @keyup.enter="handleQuery"
                class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="queryParams.gender" placeholder="请选择性别" clearable class="tech-select">
                <el-option v-for="dict in int" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="健康状态" prop="healthStatus">
              <el-select v-model="queryParams.healthStatus" placeholder="请选择健康状态" clearable class="tech-select">
                <el-option v-for="dict in kv1" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="是否绝育" prop="sterilization">
              <el-select v-model="queryParams.sterilization" placeholder="请选择是否绝育" clearable class="tech-select">
                <el-option v-for="dict in kv2" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="疫苗状态" prop="vaccineStatus">
              <el-select v-model="queryParams.vaccineStatus" placeholder="请选择疫苗状态" clearable class="tech-select">
                <el-option v-for="dict in yimiao" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="宠物状态" prop="petStatus">
              <el-select v-model="queryParams.petStatus" placeholder="请选择宠物状态" clearable class="tech-select">
                <el-option v-for="dict in cwzt" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="发布者ID" prop="publisherId">
              <el-input v-model="queryParams.publisherId" placeholder="请输入发布者ID" clearable @keyup.enter="handleQuery"
                class="tech-input" />
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
            </el-icon>宠物列表
          </span>
          <div class="header-actions">
            <el-button type="primary" class="tech-btn" @click="handleAdd" v-hasPermi="['pet:info:add']">
              <el-icon>
                <Plus />
              </el-icon>新增
            </el-button>
            <el-button type="success" class="tech-btn" :disabled="single" @click="handleUpdate"
              v-hasPermi="['pet:info:edit']">
              <el-icon>
                <Edit />
              </el-icon>修改
            </el-button>
            <el-button type="danger" class="tech-btn" :disabled="multiple" @click="handleDelete"
              v-hasPermi="['pet:info:remove']">
              <el-icon>
                <Delete />
              </el-icon>删除
            </el-button>
            <el-button type="warning" class="tech-btn" @click="handleExport" v-hasPermi="['pet:info:export']">
              <el-icon>
                <Download />
              </el-icon>导出
            </el-button>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange" row-key="petId"
        class="tech-table">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="宠物编码" width="140" align="center" prop="petId">
          <template #default="scope">
            <span class="id-badge">{{ scope.row.petId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="宠物名称" align="center" prop="petName" width="120">
          <template #default="scope">
            <div class="pet-name-cell">
              <el-avatar :size="28" class="pet-avatar"><el-icon>
                  <UserFilled />
                </el-icon></el-avatar>
              <span class="pet-name-text">{{ scope.row.petName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="宠物类型" align="center" prop="petType" width="100">
          <template #default="scope">
            <dict-tag :options="kv" :value="scope.row.petType" />
          </template>
        </el-table-column>
        <el-table-column label="封面图片" align="center" prop="mediaUrl" width="100">
          <template #default="scope">
            <div v-if="scope.row.mediaUrl" class="media-preview-cell">
              <el-image :src="scope.row.mediaUrl" fit="cover" class="media-thumb"
                :preview-src-list="[scope.row.mediaUrl]" />
            </div>
            <span v-else class="empty-text">-</span>
          </template>
        </el-table-column>
        <el-table-column label="品种" align="center" prop="breed" width="100" />
        <el-table-column label="年龄" align="center" prop="age" width="70" />
        <el-table-column label="性别" align="center" prop="gender" width="70">
          <template #default="scope">
            <dict-tag :options="int" :value="scope.row.gender" />
          </template>
        </el-table-column>
        <el-table-column label="健康状态" align="center" prop="healthStatus" width="100">
          <template #default="scope">
            <dict-tag :options="kv1" :value="scope.row.healthStatus" />
          </template>
        </el-table-column>
        <el-table-column label="是否绝育" align="center" prop="sterilization" width="90">
          <template #default="scope">
            <dict-tag :options="kv2" :value="scope.row.sterilization" />
          </template>
        </el-table-column>
        <el-table-column label="疫苗状态" align="center" prop="vaccineStatus" width="100">
          <template #default="scope">
            <dict-tag :options="yimiao" :value="scope.row.vaccineStatus" />
          </template>
        </el-table-column>
        <el-table-column label="发现地点" align="center" prop="foundPlace" min-width="120" />
        <el-table-column label="宠物描述" align="center" prop="petDesc" min-width="120" />
        <el-table-column label="宠物状态" align="center" prop="petStatus" width="90" fixed="right">
          <template #default="scope">
            <dict-tag :options="cwzt" :value="scope.row.petStatus" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150" fixed="right">
          <template #default="scope">
            <div class="action-btns">
              <el-button link type="primary" class="action-btn view-btn" @click="handleView(scope.row)">
                <el-icon>
                  <View />
                </el-icon>查看
              </el-button>
              <el-button link type="primary" class="action-btn edit-btn" @click="handleUpdate(scope.row)"
                v-hasPermi="['pet:info:edit']">
                <el-icon>
                  <Edit />
                </el-icon>修改
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" class="tech-pagination" />
    </el-card>

    <!-- 添加或修改宠物信息对话框 -->
    <el-dialog :title="title" v-model="open" width="850px" append-to-body class="tech-dialog">
      <el-form ref="infoRef" :model="form" :rules="rules" label-width="100px" class="pet-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="宠物编码" prop="petId">
              <el-input v-model="form.petId" readonly placeholder="系统自动生成" class="tech-input">
                <template #prefix><el-icon>
                    <Key />
                  </el-icon></template>
              </el-input>
            </el-form-item>
            <el-form-item label="宠物名称" prop="petName">
              <el-input v-model="form.petName" placeholder="请输入宠物名称" class="tech-input">
                <template #prefix><el-icon>
                    <User />
                  </el-icon></template>
              </el-input>
            </el-form-item>
            <el-form-item label="宠物类型" prop="petType">
              <el-select v-model="form.petType" placeholder="请选择宠物类型" class="tech-select">
                <el-option v-for="dict in kv" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
            <el-form-item label="品种" prop="breed">
              <el-input v-model="form.breed" placeholder="请输入品种" class="tech-input" />
            </el-form-item>
            <el-form-item label="年龄" prop="age">
              <el-input v-model="form.age" placeholder="请输入年龄" class="tech-input">
                <template #suffix><span class="input-suffix">岁</span></template>
              </el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-select v-model="form.gender" placeholder="请选择性别" class="tech-select">
                <el-option v-for="dict in int" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="健康状态" prop="healthStatus">
              <el-select v-model="form.healthStatus" placeholder="请选择健康状态" class="tech-select">
                <el-option v-for="dict in kv1" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否绝育" prop="sterilization">
              <el-select v-model="form.sterilization" placeholder="请选择是否绝育" class="tech-select">
                <el-option v-for="dict in kv2" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
            <el-form-item label="疫苗状态" prop="vaccineStatus">
              <el-select v-model="form.vaccineStatus" placeholder="请选择疫苗状态" class="tech-select">
                <el-option v-for="dict in yimiao" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
            <el-form-item label="宠物状态" prop="petStatus">
              <el-select v-model="form.petStatus" placeholder="请选择宠物状态" class="tech-select">
                <el-option v-for="dict in cwzt" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
            <el-form-item label="发现地点" prop="foundPlace">
              <template #label>
                <span class="required-label">发现地点</span>
              </template>
              <el-input v-model="form.foundPlace" placeholder="请输入发现地点" class="tech-input" />
            </el-form-item>
            <el-form-item label="发现时间" prop="foundTime">
              <el-date-picker v-model="form.foundTime" type="date" placeholder="请选择发现时间" class="tech-input" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 10px;">
          <el-col :span="24">
            <el-form-item label="宠物描述" prop="petDesc">
              <el-input v-model="form.petDesc" type="textarea" placeholder="请输入宠物描述" :rows="3" class="tech-textarea" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发布者ID" prop="publisherId">
              <el-input v-model="form.publisherId" readonly placeholder="系统自动填充" class="tech-input" />
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="封面图片" prop="mediaUrl">
              <el-upload class="avatar-uploader" action="#" :on-change="handleCoverUpload" :auto-upload="false"
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
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel" class="cancel-btn">取 消</el-button>
          <el-button type="primary" @click="submitForm" class="tech-btn">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Info">
import { listInfo, getInfo, delInfo, addInfo, updateInfo } from "@/api/pet/info"
import useUserStore from "@/store/modules/user"
import { Search, RefreshRight, Plus, Edit, Delete, Download, Key, User, List, UserFilled, Refresh, View } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance()
const { kv2, ljsc, fbz, kv, int, cwzt, yimiao, kv1 } = proxy.useDict('kv2', 'ljsc', 'fbz', 'kv', 'int', 'cwzt', 'yimiao', 'kv1')
const userStore = useUserStore()

const infoList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    petId: null,
    petName: null,
    petType: null,
    breed: null,
    age: null,
    gender: null,
    healthStatus: null,
    sterilization: null,
    vaccineStatus: null,
    foundPlace: null,
    foundTime: null,
    petDesc: null,
    petStatus: null,
    publisherId: null,
    orgId: null,
    isDeleted: null
  },
  rules: {
    petName: [{ required: true, message: "宠物名称不能为空", trigger: "blur" }],
    petType: [{ required: true, message: "宠物类型不能为空", trigger: "change" }],
    breed: [{ required: true, message: "品种不能为空", trigger: "blur" }],
    healthStatus: [{ required: true, message: "健康状态不能为空", trigger: "change" }],
    petStatus: [{ required: true, message: "宠物状态不能为空", trigger: "change" }],
    foundPlace: [{ required: true, message: "发现地点不能为空", trigger: "blur" }],
    publisherId: [{ required: true, message: "发布者ID不能为空", trigger: "blur" }],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询宠物信息列表 */
function getList() {
  loading.value = true
  listInfo(queryParams.value).then(response => {
    infoList.value = response.rows.map(item => {
      if (item.mediaUrl && !item.mediaUrl.startsWith('http') && !item.mediaUrl.startsWith('data:')) {
        item.mediaUrl = 'http://localhost:8080/profile/' + item.mediaUrl
      }
      return item
    })
    total.value = response.total
    loading.value = false
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
    petId: null,
    petName: null,
    petType: null,
    breed: null,
    age: null,
    gender: null,
    healthStatus: null,
    sterilization: null,
    vaccineStatus: null,
    chipNo: null,
    foundPlace: null,
    foundTime: null,
    petDesc: null,
    mediaUrl: null,
    petStatus: null,
    publisherId: null,
    orgId: null,
    createTime: null,
    updateTime: null,
    isDeleted: null
  }
  proxy.resetForm("infoRef")
}

// 封面图片上传处理（使用本地预览并压缩）
function handleCoverUpload(file) {
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

      // 设置最大尺寸（进一步减小）
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
      let quality = 0.5  // 从50%质量开始
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
  ids.value = selection.map(item => item.petId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  form.value.publisherId = userStore.id
  form.value.publisherType = 3
  open.value = true
  title.value = "添加宠物信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _petId = row.petId || ids.value
  getInfo(_petId).then(response => {
    form.value = response.data
    if (form.value.mediaUrl && !form.value.mediaUrl.startsWith('http') && !form.value.mediaUrl.startsWith('data:')) {
      form.value.mediaUrl = 'http://localhost:8080/profile/' + form.value.mediaUrl
    }
    open.value = true
    title.value = "修改宠物信息"
  })
}

/** 查看按钮操作 */
function handleView(row) {
  reset()
  const _petId = row.petId || ids.value
  getInfo(_petId).then(response => {
    form.value = response.data
    if (form.value.mediaUrl && !form.value.mediaUrl.startsWith('http') && !form.value.mediaUrl.startsWith('data:')) {
      form.value.mediaUrl = 'http://localhost:8080/profile/' + form.value.mediaUrl
    }
    open.value = true
    title.value = "查看宠物信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["infoRef"].validate(valid => {
    if (valid) {
      if (form.value.petId != null) {
        // 修改操作，传递petId
        updateInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        // 新增操作，不传递petId，让后端自动生成
        const submitData = { ...form.value }
        delete submitData.petId
        // 移除null和undefined，但保留空字符串（如mediaUrl字段）
        Object.keys(submitData).forEach(key => {
          if (submitData[key] === null || submitData[key] === undefined) {
            delete submitData[key]
          }
        })
        addInfo(submitData).then(response => {
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
  const _petIds = row.petId || ids.value
  proxy.$modal.confirm('是否确认删除宠物信息编号为"' + _petIds + '"的数据项？').then(function () {
    return delInfo(_petIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('pet/info/export', {
    ...queryParams.value
  }, `info_${new Date().getTime()}.xlsx`)
}

getList()
</script>

<style scoped lang="scss">
.pet-info-page {
  padding: 24px;
  min-height: calc(100vh - 84px);
  background: #ffffff;
}

.tech-title {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  .tech-gradient-text {
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: block;
    margin-bottom: 8px;
  }

  .tech-subtitle {
    display: block;
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
}

.search-card {
  :deep(.el-card__body) {
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
    gap: 10px;
    font-size: 16px;
    font-weight: 600;
    color: #333333;

    .title-icon {
      font-size: 20px;
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
    margin-bottom: 18px;

    :deep(.el-form-item__label) {
      color: #666666;
      font-weight: 500;
    }
  }
}

.tech-input,
.tech-select {
  :deep(.el-input__wrapper) {
    background: #ffffff;
    border: 1px solid #dcdfe6;
    box-shadow: none;
    transition: all 0.3s ease;

    &:hover {
      border-color: #c0c4cc;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    }

    &.is-focus {
      border-color: #409eff;
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }
  }

  :deep(.el-input__inner) {
    color: #303133;
    background: transparent;
    font-weight: 500;

    &::placeholder {
      color: #c0c4cc;
    }
  }

  :deep(.el-input__prefix) {
    color: #409eff;
  }

  :deep(.el-input__suffix) {
    color: #909399;
  }
}

.tech-btn {
  background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
  border: none;
  color: #fff;
  font-weight: 500;
  padding: 9px 20px;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #0069d9 0%, #5510e0 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &.is-disabled {
    background: #e9ecef;
    color: #6c757d;
    opacity: 0.7;
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
    box-shadow: 0 0 12px rgba(0, 123, 255, 0.2);
  }
}

.tech-table {
  background: transparent;

  :deep(.el-table__header) {
    th {
      background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
      color: #333333;
      font-weight: 600;
      font-size: 13px;
      border-bottom: 1px solid #dee2e6;
      padding: 14px 0;
    }
  }

  :deep(.el-table__body) {
    tr {
      background: #ffffff;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(0, 123, 255, 0.05) !important;
      }

      td {
        color: #333333;
        border-bottom: 1px solid #e9ecef;
        padding: 12px 0;
        font-size: 13px;
      }
    }
  }

  :deep(.el-table__empty-block) {
    background: #ffffff;
  }

  :deep(.el-checkbox__inner) {
    background: #ffffff;
    border-color: #ddd;
    border-radius: 4px;
    transition: all 0.3s ease;

    &:hover {
      border-color: #007bff;
      box-shadow: 0 0 6px rgba(0, 123, 255, 0.3);
    }
  }

  :deep(.el-checkbox__input.is-checked) {
    .el-checkbox__inner {
      background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
      border-color: #007bff;
      box-shadow: 0 0 8px rgba(0, 123, 255, 0.4);

      &::after {
        border-color: #ffffff;
      }
    }
  }

  :deep(.el-table__row) {
    cursor: pointer;

    &.hover-row {
      background: rgba(0, 123, 255, 0.03) !important;

      td {
        background: rgba(0, 123, 255, 0.03) !important;
      }
    }
  }

  :deep(.el-table__row:hover) {
    background: rgba(0, 123, 255, 0.05) !important;

    td {
      background: rgba(0, 123, 255, 0.05) !important;
    }
  }
}

.id-badge {
  display: inline-block;
  padding: 4px 10px;
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.15) 0%, rgba(102, 16, 242, 0.1) 100%);
  border: 1px solid rgba(0, 123, 255, 0.35);
  border-radius: 6px;
  color: #007bff;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.pet-name-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .pet-avatar {
    background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
    color: #fff;
    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
  }

  .pet-name-text {
    color: #333333;
    font-weight: 500;
  }
}

.media-preview-cell {
  display: flex;
  justify-content: center;
  align-items: center;

  .media-thumb {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
    }
  }

  .media-icon {
    font-size: 24px;
    color: #007bff;
    filter: drop-shadow(0 0 4px rgba(0, 123, 255, 0.3));
  }
}

.empty-text {
  color: #999999;
  font-style: italic;
}

.action-btns {
  display: flex;
  justify-content: center;
  gap: 8px;
  position: relative;
  z-index: 10;

  .action-btn {
    padding: 6px 12px;
    font-weight: 500;
    transition: all 0.3s ease;
    overflow: hidden;
    position: relative;

    &:hover {
      transform: scale(1.05);
      z-index: 20;
    }

    &.view-btn {
      color: #00d4ff;
      background: #ffffff;
      border: 1px solid rgba(0, 212, 255, 0.5);
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .el-icon {
        color: #00d4ff;
      }

      &:hover {
        background: rgba(0, 212, 255, 0.1);
        border-color: #00d4ff;
        box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
      }
    }

    &.edit-btn {
      color: #67c23a;
      background: #ffffff;
      border: 1px solid rgba(103, 194, 58, 0.5);
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .el-icon {
        color: #67c23a;
      }

      &:hover {
        background: rgba(103, 194, 58, 0.1);
        border-color: #67c23a;
        box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
      }
    }
  }
}

.tech-pagination {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;

  :deep(.el-pagination__total),
  :deep(.el-pagination__jump) {
    color: #666666;
  }

  :deep(.el-pagination__sizes .el-input__inner) {
    background: #ffffff;
    border-color: #ddd;
    color: #333333;
  }

  :deep(.el-pager li) {
    background: #ffffff;
    border: 1px solid #ddd;
    color: #666666;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      color: #007bff;
      border-color: #007bff;
      background: rgba(0, 123, 255, 0.05);
    }

    &.is-active {
      background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
      border-color: transparent;
      color: #fff;
      box-shadow: 0 2px 8px rgba(0, 212, 255, 0.4);
    }
  }

  :deep(.btn-prev),
  :deep(.btn-next) {
    background: rgba(30, 39, 70, 0.8);
    border: 1px solid rgba(0, 212, 255, 0.25);
    color: #94a3b8;

    &:hover {
      color: #00d4ff;
      border-color: #00d4ff;
    }

    &:disabled {
      background: rgba(30, 39, 70, 0.4);
      color: #475569;
    }
  }
}

.tech-dialog {
  :deep(.el-dialog) {
    background: linear-gradient(180deg, #111936 0%, #0f1629 100%);
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

.pet-form {
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
    border: 1px solid #dcdfe6;
    color: #303133;

    &:focus {
      border-color: #409eff;
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }

    &::placeholder {
      color: #c0c4cc;
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

.required-label::before {
  content: '*';
  color: #ff4d4f;
  margin-right: 4px;
}
</style>
