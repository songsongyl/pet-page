<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true">
         <el-form-item label="登录地址" prop="ipaddr">
            <el-input
               v-model="queryParams.ipaddr"
               placeholder="请输入登录地址"
               clearable
               style="width: 200px"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item label="用户名称" prop="userName">
            <el-input
               v-model="queryParams.userName"
               placeholder="请输入用户名称"
               clearable
               style="width: 200px"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>
      <el-table
         v-loading="loading"
         :data="onlineList.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
         style="width: 100%;"
      >
         <el-table-column label="序号" width="50" type="index" align="center">
            <template #default="scope">
               <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
            </template>
         </el-table-column>
         <el-table-column label="会话编号" align="center" prop="tokenId" :show-overflow-tooltip="true" />
         <el-table-column label="登录名称" align="center" prop="userName" :show-overflow-tooltip="true" />
         <el-table-column label="所属部门" align="center" prop="deptName" :show-overflow-tooltip="true" />
         <el-table-column label="主机" align="center" prop="ipaddr" :show-overflow-tooltip="true" />
         <el-table-column label="登录地点" align="center" prop="loginLocation" :show-overflow-tooltip="true" />
         <el-table-column label="操作系统" align="center" prop="os" :show-overflow-tooltip="true" />
         <el-table-column label="浏览器" align="center" prop="browser" :show-overflow-tooltip="true" />
         <el-table-column label="登录时间" align="center" prop="loginTime" width="180">
            <template #default="scope">
               <span>{{ parseTime(scope.row.loginTime) }}</span>
            </template>
         </el-table-column>
         <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button link type="primary" icon="Delete" @click="handleForceLogout(scope.row)" v-hasPermi="['monitor:online:forceLogout']">强退</el-button>
            </template>
         </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="pageNum" v-model:limit="pageSize" />
   </div>
</template>

<script setup name="Online">
import { ref, getCurrentInstance } from "vue";
import { forceLogout } from "@/api/monitor/online";

const { proxy } = getCurrentInstance();

const onlineList = ref([]);
const loading = ref(true);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(20);

const queryParams = ref({
  ipaddr: undefined,
  userName: undefined
});

// 生成随机IP地址
function generateRandomIP() {
  return `${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

// 生成随机会话ID
function generateTokenId() {
  return 'SESSION_' + Math.random().toString(36).substring(2, 15);
}

// 部门列表
const deptNames = ['市场部门', '技术部门', '运营部门', '客服部门', '财务部门', '人力资源', '行政部门', '研发中心'];

// 登录地点列表
const locations = ['北京市', '上海市', '广州市', '深圳市', '杭州市', '南京市', '成都市', '武汉市', '西安市', '重庆市', '苏州市', '天津市', '郑州市', '长沙市', '东莞市'];

// 操作系统列表
const osList = ['Windows 10', 'Windows 11', 'Mac OS X', 'Linux', 'Android', 'iOS'];

// 浏览器列表
const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];

// 生成模拟在线用户数据
function generateMockOnlineUsers(count = 500) {
  const users = [];
  const now = new Date();
  
  for (let i = 1; i <= count; i++) {
    const loginTime = new Date(now.getTime() - Math.random() * 86400000); // 最近24小时内登录
    users.push({
      tokenId: generateTokenId(),
      userName: `user${String(i).padStart(4, '0')}`,
      deptName: deptNames[Math.floor(Math.random() * deptNames.length)],
      ipaddr: generateRandomIP(),
      loginLocation: locations[Math.floor(Math.random() * locations.length)],
      os: osList[Math.floor(Math.random() * osList.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      loginTime: loginTime.toISOString().replace('T', ' ').substring(0, 19)
    });
  }
  
  return users;
}

/** 查询登录日志列表 */
function getList() {
  loading.value = true;
  
  // 使用模拟数据
  const mockData = generateMockOnlineUsers(500);
  let filteredData = mockData;
  
  // 过滤条件
  if (queryParams.value.ipaddr) {
    filteredData = filteredData.filter(item => 
      item.ipaddr.includes(queryParams.value.ipaddr)
    );
  }
  if (queryParams.value.userName) {
    filteredData = filteredData.filter(item => 
      item.userName.includes(queryParams.value.userName)
    );
  }
  
  onlineList.value = filteredData;
  total.value = filteredData.length;
  loading.value = false;
}

/** 搜索按钮操作 */
function handleQuery() {
  pageNum.value = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 强退按钮操作 */
function handleForceLogout(row) {
    proxy.$modal.confirm('是否确认强退名称为"' + row.userName + '"的用户?').then(function () {
  return forceLogout(row.tokenId);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

getList();
</script>
