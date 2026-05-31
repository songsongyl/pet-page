<template>
  <div class="blacklist-page tech-page tech-grid-bg">
    <div class="tech-title">
      <span class="tech-gradient-text">黑名单管理</span>
      <span class="tech-subtitle">管理被拉黑的用户，支持永久或临时封禁</span>
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
      <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="100px" class="search-form">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="queryParams.userName" placeholder="请输入用户名" clearable @keyup.enter="handleQuery"
                class="tech-input">
                <template #prefix><el-icon>
                    <User />
                  </el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="用户昵称" prop="userNickName">
              <el-input v-model="queryParams.userNickName" placeholder="请输入用户昵称" clearable @keyup.enter="handleQuery"
                class="tech-input">
                <template #prefix><el-icon>
                    <UserFilled />
                  </el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="黑名单类型" prop="blacklistType">
              <el-select v-model="queryParams.blacklistType" placeholder="请选择类型" clearable class="tech-select">
                <el-option label="投诉拉黑" :value="1" />
                <el-option label="主动拉黑" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="tech-select">
                <el-option label="拉黑中" value="0" />
                <el-option label="已解封" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="16" :lg="12">
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery"
                class="tech-btn tech-btn-primary">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery" class="tech-btn">重置</el-button>
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
              <Warning />
            </el-icon>
            黑名单列表
          </span>
          <div class="header-actions">
            <el-button type="primary" plain icon="Plus" @click="handleAdd"
              v-hasPermi="['ComplaintReport:blacklist:add']" class="tech-btn tech-btn-primary">新增</el-button>
            <el-button type="success" plain icon="Unlock" :disabled="single" @click="handleUnblock"
              v-hasPermi="['ComplaintReport:blacklist:unblock']" class="tech-btn tech-btn-success">解封</el-button>
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
              v-hasPermi="['ComplaintReport:blacklist:remove']" class="tech-btn tech-btn-danger">删除</el-button>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" :data="blacklistList" @selection-change="handleSelectionChange" class="tech-table"
        stripe row-key="blacklistId">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="blacklistId" width="80" />
        <el-table-column label="用户ID" align="center" prop="userId" width="100" />
        <el-table-column label="用户名" align="center" prop="userName" width="120" show-overflow-tooltip />
        <el-table-column label="用户昵称" align="center" prop="userNickName" width="120" show-overflow-tooltip />
        <el-table-column label="类型" align="center" prop="blacklistType" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.blacklistType === 1 ? 'danger' : 'warning'" effect="dark" size="small">
              {{ scope.row.blacklistType === 1 ? '投诉拉黑' : '主动拉黑' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="拉黑原因" align="center" prop="reason" min-width="200" show-overflow-tooltip />
        <el-table-column label="关联投诉" align="center" prop="relatedComplaintId" width="100">
          <template #default="scope">
            <span v-if="scope.row.relatedComplaintId">{{ scope.row.relatedComplaintId }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" align="center" prop="operatorName" width="100" />
        <el-table-column label="状态" align="center" prop="status" width="90">
          <template #default="scope">
            <el-tag :type="scope.row.status === '0' ? 'danger' : 'success'" effect="dark" size="small">
              {{ scope.row.status === '0' ? '拉黑中' : '已解封' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="解封时间" align="center" prop="unblockTime" width="160">
          <template #default="scope">
            <span v-if="scope.row.unblockTime">{{ parseTime(scope.row.unblockTime) }}</span>
            <span v-else class="permanent-text">永久</span>
          </template>
        </el-table-column>
        <el-table-column label="拉黑时间" align="center" prop="createTime" width="160">
          <template #default="scope">
            <span class="time-text">{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" min-width="120" show-overflow-tooltip />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150" fixed="right">
          <template #default="scope">
            <el-button link type="primary" icon="View" @click="handleView(scope.row)">查看</el-button>
            <el-button link type="success" icon="Unlock" @click="handleUnblockSingle(scope.row)"
              v-if="scope.row.status === '0'" v-hasPermi="['ComplaintReport:blacklist:unblock']">
              解封
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <el-dialog :title="title" v-model="open" width="500px" append-to-body class="tech-dialog">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" class="dialog-form">
        <el-form-item label="用户ID" prop="userId">
          <el-input-number v-model="form.userId" :min="1" placeholder="请输入用户ID" class="tech-input"
            style="width: 100%" />
        </el-form-item>
        <el-form-item label="解封时间" prop="unblockTime">
          <el-date-picker v-model="form.unblockTime" type="datetime" placeholder="不填则永久拉黑"
            value-format="YYYY-MM-DD HH:mm:ss" class="tech-date-picker" style="width: 100%" />
        </el-form-item>
        <el-form-item label="拉黑原因" prop="reason">
          <el-input v-model="form.reason" type="textarea" :rows="4" placeholder="请输入拉黑原因" class="tech-textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm" class="tech-btn tech-btn-primary">确 定</el-button>
          <el-button @click="cancel" class="tech-btn cancel-btn">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="黑名单详情" v-model="viewOpen" width="600px" append-to-body class="tech-dialog">
      <div class="view-container">
        <el-descriptions :column="2" border class="view-descriptions">
          <el-descriptions-item label="用户ID">{{ viewData.userId }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{ viewData.userName }}</el-descriptions-item>
          <el-descriptions-item label="用户昵称">{{ viewData.userNickName }}</el-descriptions-item>
          <el-descriptions-item label="黑名单类型">
            <el-tag :type="viewData.blacklistType === 1 ? 'danger' : 'warning'" effect="dark">
              {{ viewData.blacklistType === 1 ? '投诉拉黑' : '主动拉黑' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="关联投诉ID">{{ viewData.relatedComplaintId || '-' }}</el-descriptions-item>
          <el-descriptions-item label="操作人">{{ viewData.operatorName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="viewData.status === '0' ? 'danger' : 'success'" effect="dark">
              {{ viewData.status === '0' ? '拉黑中' : '已解封' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="解封时间">
            {{ viewData.unblockTime ? parseTime(viewData.unblockTime) : '永久' }}
          </el-descriptions-item>
          <el-descriptions-item label="拉黑原因" :span="2">{{ viewData.reason || '-' }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ viewData.remark || '-' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ parseTime(viewData.createTime) }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ parseTime(viewData.updateTime) }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="Blacklist">
import { listBlacklist, getBlacklist, addBlacklist, updateBlacklist, delBlacklist, unblockBlacklist, getUserInfo } from '@/api/ComplaintReport/blacklist'
import useUserStore from '@/store/modules/user'

const { proxy } = getCurrentInstance()
const loading = ref(true)
const showSearch = ref(true)
const blacklistList = ref([])
const total = ref(0)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const title = ref('')
const open = ref(false)
const viewOpen = ref(false)
const viewData = ref({})

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  userName: null,
  userNickName: null,
  blacklistType: null,
  status: null
})

const form = ref({})
const rules = {
  userId: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
  reason: [{ required: true, message: '请输入拉黑原因', trigger: 'blur' }]
}

const userStore = useUserStore()

function getList() {
  loading.value = true
  listBlacklist(queryParams).then(response => {
    blacklistList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

function resetQuery() {
  proxy.resetForm('queryRef')
  handleQuery()
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.blacklistId)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

function handleAdd() {
  reset()
  open.value = true
  title.value = '添加黑名单'
}

function handleView(row) {
  viewData.value = row
  viewOpen.value = true
}

function reset() {
  form.value = {
    blacklistId: null,
    userId: null,
    unblockTime: null,
    reason: null
  }
  proxy.resetForm('formRef')
}

function cancel() {
  open.value = false
  reset()
}

function submitForm() {
  proxy.$refs.formRef.validate(valid => {
    if (valid) {
      getUserInfo(form.value.userId).then(userRes => {
        const userData = userRes.data
        const submitData = {
          ...form.value,
          userName: userData.userName || ('用户' + form.value.userId),
          userNickName: userData.nickName || '',
          blacklistType: 2,
          relatedComplaintId: null,
          operatorId: userStore.userId,
          operatorName: userStore.name || '',
          status: '0',
          remark: '手动添加'
        }

        if (form.value.blacklistId) {
          updateBlacklist(submitData).then(response => {
            proxy.$modal.msgSuccess('修改成功')
            open.value = false
            getList()
          })
        } else {
          addBlacklist(submitData).then(response => {
            proxy.$modal.msgSuccess('新增成功')
            open.value = false
            getList()
          })
        }
      }).catch(() => {
        const submitData = {
          ...form.value,
          userName: '用户' + form.value.userId,
          userNickName: '',
          blacklistType: 2,
          relatedComplaintId: null,
          operatorId: userStore.userId,
          operatorName: userStore.name || '',
          status: '0',
          remark: '手动添加'
        }

        if (form.value.blacklistId) {
          updateBlacklist(submitData).then(response => {
            proxy.$modal.msgSuccess('修改成功')
            open.value = false
            getList()
          })
        } else {
          addBlacklist(submitData).then(response => {
            proxy.$modal.msgSuccess('新增成功')
            open.value = false
            getList()
          })
        }
      })
    }
  })
}

function handleDelete(row) {
  const blacklistIds = row.blacklistId || ids.value
  proxy.$modal.confirm('是否确认删除黑名单编号为"' + blacklistIds + '"的数据项？').then(() => {
    return delBlacklist(blacklistIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess('删除成功')
  }).catch(() => { })
}

function handleUnblock() {
  const blacklistIds = ids.value
  proxy.$modal.confirm('是否确认解封选中的' + blacklistIds.length + '个用户？').then(() => {
    return unblockBlacklist(blacklistIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess('解封成功')
  }).catch(() => { })
}

function handleUnblockSingle(row) {
  proxy.$modal.confirm('是否确认解封用户"' + row.userName + '"？').then(() => {
    return unblockBlacklist([row.blacklistId])
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess('解封成功')
  }).catch(() => { })
}

getList()
</script>

<style scoped lang="scss">
@import '@/assets/styles/tech-theme.scss';

.blacklist-page {
  min-height: 100vh;
  padding: 24px;
  box-sizing: border-box;
}

.tech-title {
  margin-bottom: 24px;

  .tech-gradient-text {
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .tech-subtitle {
    display: block;
    margin-top: 8px;
    font-size: 14px;
    color: var(--tech-text-secondary);
  }
}

.search-card {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 600;
    color: var(--tech-text-primary);

    .title-icon {
      color: var(--tech-primary);
      font-size: 20px;
    }
  }

  .header-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
}

.permanent-text {
  color: #f97316;
  font-weight: 600;
}

.view-container {
  padding: 10px;
}

.view-descriptions {
  :deep(.el-descriptions__label) {
    background: var(--tech-bg-light);
    color: var(--tech-text-primary);
    font-weight: 600;
  }

  :deep(.el-descriptions__content) {
    color: var(--tech-text-secondary);
  }
}

.tech-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;

  &.tech-btn-primary {
    background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
    border: none;
    color: #fff;

    &:hover {
      box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
    }
  }

  &.tech-btn-success {
    background: linear-gradient(135deg, #67c23a 0%, #95d475 100%);
    border: none;
    color: #fff;

    &:hover {
      box-shadow: 0 0 20px rgba(103, 194, 58, 0.4);
    }
  }

  &.tech-btn-danger {
    background: linear-gradient(135deg, #f56c6c 0%, #fab6b6 100%);
    border: none;
    color: #fff;

    &:hover {
      box-shadow: 0 0 20px rgba(245, 108, 108, 0.4);
    }
  }
}

.tech-input,
.tech-select,
.tech-textarea,
.tech-date-picker {
  width: 100%;
}

.time-text {
  color: var(--tech-text-secondary);
  font-size: 13px;
}
</style>
