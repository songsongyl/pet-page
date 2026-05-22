# 后端API需求文档

## 1. 项目概述

本项目是一个宠物领养和捐赠平台，包含用户申请功能和管理员审批功能。根据需求，需要对现有的申请页面进行改造：
1. 现有申请页面作为用户申请页面，移除编辑状态的按钮
2. 新建管理者审批页面，用于处理用户申请

## 2. 现有API接口

### 2.1 领养申请相关接口

#### 2.1.1 提交领养申请
- **路径**: `/adoption/application/submit`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "housingType": "owned", // 住房类型: owned(自有房), rented(租房), dormitory(宿舍)
    "petAllowed": "是", // 是否允许养宠: 是/否
    "hasEnclosedBalcony": "是", // 是否有封闭阳台/纱窗: 是/否
    "familyAgree": "是", // 家庭成员是否同意: 是/否
    "hasAllergy": "无", // 有无过敏情况: 有/无
    "workSchedule": "朝九晚五", // 工作作息
    "companionTime": "3-6小时", // 每天陪伴时间: less1(1小时以下), 1-3, 3-6, more6(6小时以上)
    "knowBasicCost": "是", // 是否了解基础开销: 是/否
    "canAffordMedical": "是", // 是否能承担医疗费用: 是/否
    "scientificFeeding": "是", // 是否接受科学喂养: 是/否
    "agreeSterilization": "是", // 是否同意绝育/牵引: 是/否
    "petExperience": "有5年养猫经验", // 养宠经验
    "futurePlans": "计划长期饲养", // 未来计划
    "noAbandon": "是", // 是否承诺不随意弃养: 是/否
    "acceptVisit": "是", // 是否接受回访: 是/否
    "applicantName": "李秀梅", // 申请人姓名
    "contactPhone": "13800138000", // 联系电话
    "address": "北京市朝阳区", // 居住地址
    "files": [] // 证明材料文件
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "msg": "申请提交成功",
    "data": {
      "applicationId": 1
    }
  }
  ```

#### 2.1.2 下载领养协议模板
- **路径**: `/adoption/agreement/download`
- **方法**: `GET`
- **响应**: 协议模板文件 (blob)

#### 2.1.3 获取领养申请列表
- **路径**: `/adoption/application/list`
- **方法**: `GET`
- **请求参数**:
  - `pageNum`: 页码
  - `pageSize`: 每页数量
  - `status`: 状态（可选）
- **响应**:
  ```json
  {
    "code": 200,
    "msg": "查询成功",
    "data": {
      "total": 10,
      "rows": [
        {
          "id": 1,
          "applicantName": "李秀梅",
          "contactPhone": "13800138000",
          "status": "pending", // pending(待审批), approved(已批准), rejected(已拒绝)
          "createTime": "2026-04-12 10:00:00"
        }
      ]
    }
  }
  ```

#### 2.1.4 获取领养申请详情
- **路径**: `/adoption/application/{id}`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "code": 200,
    "msg": "查询成功",
    "data": {
      "id": 1,
      "housingType": "owned",
      "petAllowed": "是",
      "hasEnclosedBalcony": "是",
      "familyAgree": "是",
      "hasAllergy": "无",
      "workSchedule": "朝九晚五",
      "companionTime": "3-6小时",
      "knowBasicCost": "是",
      "canAffordMedical": "是",
      "scientificFeeding": "是",
      "agreeSterilization": "是",
      "petExperience": "有5年养猫经验",
      "futurePlans": "计划长期饲养",
      "noAbandon": "是",
      "acceptVisit": "是",
      "applicantName": "李秀梅",
      "contactPhone": "13800138000",
      "address": "北京市朝阳区",
      "status": "pending",
      "createTime": "2026-04-12 10:00:00",
      "updateTime": "2026-04-12 10:00:00"
    }
  }
  ```

#### 2.1.5 审批领养申请
- **路径**: `/adoption/application/{id}/approve`
- **方法**: `PUT`
- **请求体**:
  ```json
  {
    "status": "approved", // approved(批准), rejected(拒绝)
    "remark": "批准领养申请"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "msg": "审批成功"
  }
  ```

#### 2.1.6 上传签署后的协议
- **路径**: `/adoption/application/{id}/agreement`
- **方法**: `POST`
- **请求体**: `multipart/form-data`
  - `file`: 协议文件
- **响应**:
  ```json
  {
    "code": 200,
    "msg": "上传成功"
  }
  ```

### 2.2 捐赠申请相关接口

#### 2.2.1 提交物资捐赠申请
- **路径**: `/donation/application/submit`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "donorName": "王建国", // 捐赠人姓名
    "contactPhone": "13900139000", // 联系电话
    "donationType": "food", // 捐赠类型: food(食品), supplies(用品), medicine(药品), other(其他)
    "items": [
      {
        "name": "猫粮", // 物品名称
        "quantity": 10, // 数量
        "unit": "袋", // 单位
        "description": "成年猫粮"
      }
    ],
    "donationMethod": "现场捐赠", // 捐赠方式: 现场捐赠, 快递捐赠
    "donationAddress": "北京市朝阳区", // 捐赠地址（现场捐赠）
    "shippingAddress": "北京市朝阳区", // 快递地址（快递捐赠）
    "donationTime": "2026-04-15 14:00:00", // 捐赠时间
    "remarks": "无"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "msg": "捐赠提交成功",
    "data": {
      "applicationId": 1
    }
  }
  ```

#### 2.2.2 获取物资捐赠列表
- **路径**: `/donation/application/list`
- **方法**: `GET`
- **请求参数**:
  - `pageNum`: 页码
  - `pageSize`: 每页数量
  - `status`: 状态（可选）
- **响应**:
  ```json
  {
    "code": 200,
    "msg": "查询成功",
    "data": {
      "total": 5,
      "rows": [
        {
          "id": 1,
          "donorName": "王建国",
          "contactPhone": "13900139000",
          "donationType": "food",
          "status": "pending", // pending(待确认), confirmed(已确认), cancelled(已取消)
          "createTime": "2026-04-12 11:00:00"
        }
      ]
    }
  }
  ```

#### 2.2.3 获取物资捐赠详情
- **路径**: `/donation/application/{id}`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "code": 200,
    "msg": "查询成功",
    "data": {
      "id": 1,
      "donorName": "王建国",
      "contactPhone": "13900139000",
      "donationType": "food",
      "items": [
        {
          "name": "猫粮",
          "quantity": 10,
          "unit": "袋",
          "description": "成年猫粮"
        }
      ],
      "donationMethod": "现场捐赠",
      "donationAddress": "北京市朝阳区",
      "donationTime": "2026-04-15 14:00:00",
      "remarks": "无",
      "status": "pending",
      "createTime": "2026-04-12 11:00:00",
      "updateTime": "2026-04-12 11:00:00"
    }
  }
  ```

#### 2.2.4 确认收到捐赠
- **路径**: `/donation/application/{id}/confirm`
- **方法**: `PUT`
- **响应**:
  ```json
  {
    "code": 200,
    "msg": "确认成功"
  }
  ```

#### 2.2.5 取消捐赠
- **路径**: `/donation/application/{id}/cancel`
- **方法**: `PUT`
- **响应**:
  ```json
  {
    "code": 200,
    "msg": "取消成功"
  }
  ```

## 3. 新增API接口

### 3.1 领养申请管理接口

#### 3.1.1 获取待审批领养申请列表
- **路径**: `/adoption/application/admin/list`
- **方法**: `GET`
- **请求参数**:
  - `pageNum`: 页码
  - `pageSize`: 每页数量
  - `status`: 状态（可选）
- **响应**:
  ```json
  {
    "code": 200,
    "msg": "查询成功",
    "data": {
      "total": 8,
      "rows": [
        {
          "id": 1,
          "applicantName": "李秀梅",
          "contactPhone": "13800138000",
          "status": "pending",
          "createTime": "2026-04-12 10:00:00"
        }
      ]
    }
  }
  ```

#### 3.1.2 批量审批领养申请
- **路径**: `/adoption/application/admin/batch-approve`
- **方法**: `PUT`
- **请求体**:
  ```json
  {
    "ids": [1, 2, 3],
    "status": "approved",
    "remark": "批量审批"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "msg": "批量审批成功"
  }
  ```

### 3.2 捐赠申请管理接口

#### 3.2.1 获取待确认捐赠申请列表
- **路径**: `/donation/application/admin/list`
- **方法**: `GET`
- **请求参数**:
  - `pageNum`: 页码
  - `pageSize`: 每页数量
  - `status`: 状态（可选）
- **响应**:
  ```json
  {
    "code": 200,
    "msg": "查询成功",
    "data": {
      "total": 5,
      "rows": [
        {
          "id": 1,
          "donorName": "王建国",
          "contactPhone": "13900139000",
          "donationType": "food",
          "status": "pending",
          "createTime": "2026-04-12 11:00:00"
        }
      ]
    }
  }
  ```

#### 3.2.2 批量确认捐赠
- **路径**: `/donation/application/admin/batch-confirm`
- **方法**: `PUT`
- **请求体**:
  ```json
  {
    "ids": [1, 2, 3]
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "msg": "批量确认成功"
  }
  ```

#### 3.2.3 批量取消捐赠
- **路径**: `/donation/application/admin/batch-cancel`
- **方法**: `PUT`
- **请求体**:
  ```json
  {
    "ids": [1, 2, 3],
    "remark": "批量取消"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "msg": "批量取消成功"
  }
  ```

## 4. 数据模型

### 4.1 领养申请表 (adoption_application)

| 字段名 | 数据类型 | 描述 |
|-------|---------|------|
| id | bigint | 申请ID |
| applicant_name | varchar(50) | 申请人姓名 |
| contact_phone | varchar(20) | 联系电话 |
| address | varchar(255) | 居住地址 |
| housing_type | varchar(20) | 住房类型 |
| pet_allowed | varchar(10) | 是否允许养宠 |
| has_enclosed_balcony | varchar(10) | 是否有封闭阳台/纱窗 |
| family_agree | varchar(10) | 家庭成员是否同意 |
| has_allergy | varchar(10) | 有无过敏情况 |
| work_schedule | text | 工作作息 |
| companion_time | varchar(20) | 每天陪伴时间 |
| know_basic_cost | varchar(10) | 是否了解基础开销 |
| can_afford_medical | varchar(10) | 是否能承担医疗费用 |
| scientific_feeding | varchar(10) | 是否接受科学喂养 |
| agree_sterilization | varchar(10) | 是否同意绝育/牵引 |
| pet_experience | text | 养宠经验 |
| future_plans | text | 未来计划 |
| no_abandon | varchar(10) | 是否承诺不随意弃养 |
| accept_visit | varchar(10) | 是否接受回访 |
| status | varchar(20) | 状态(pending/approved/rejected) |
| remark | text | 审批备注 |
| agreement_url | varchar(255) | 协议文件路径 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

### 4.2 捐赠申请表 (donation_application)

| 字段名 | 数据类型 | 描述 |
|-------|---------|------|
| id | bigint | 申请ID |
| donor_name | varchar(50) | 捐赠人姓名 |
| contact_phone | varchar(20) | 联系电话 |
| donation_type | varchar(20) | 捐赠类型 |
| donation_method | varchar(20) | 捐赠方式 |
| donation_address | varchar(255) | 捐赠地址 |
| shipping_address | varchar(255) | 快递地址 |
| donation_time | datetime | 捐赠时间 |
| remarks | text | 备注 |
| status | varchar(20) | 状态(pending/confirmed/cancelled) |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

### 4.3 捐赠物品表 (donation_item)

| 字段名 | 数据类型 | 描述 |
|-------|---------|------|
| id | bigint | 物品ID |
| application_id | bigint | 申请ID |
| name | varchar(100) | 物品名称 |
| quantity | int | 数量 |
| unit | varchar(20) | 单位 |
| description | text | 描述 |

## 5. 权限控制

| 接口路径 | 所需权限 |
|---------|----------|
| /adoption/application/submit | 普通用户 |
| /adoption/agreement/download | 普通用户 |
| /adoption/application/list | 普通用户 |
| /adoption/application/{id} | 普通用户(仅查看自己的申请) |
| /adoption/application/{id}/agreement | 普通用户(仅上传自己的协议) |
| /adoption/application/{id}/approve | admin |
| /adoption/application/admin/list | admin |
| /adoption/application/admin/batch-approve | admin |
| /donation/application/submit | 普通用户 |
| /donation/application/list | 普通用户 |
| /donation/application/{id} | 普通用户(仅查看自己的申请) |
| /donation/application/{id}/confirm | admin |
| /donation/application/{id}/cancel | admin |
| /donation/application/admin/list | admin |
| /donation/application/admin/batch-confirm | admin |
| /donation/application/admin/batch-cancel | admin |

## 6. 前端改造要求

1. **用户申请页面**:
   - 移除所有编辑状态的按钮
   - 仅保留查看和提交功能
   - 显示申请状态，但不允许修改

2. **管理者审批页面**:
   - 新增页面，用于查看和处理所有申请
   - 支持批量操作（批量审批、批量确认）
   - 显示详细的申请信息
   - 提供审批/确认操作按钮

## 7. 注意事项

1. 所有接口都需要进行身份验证，使用JWT令牌
2. 批量操作接口需要考虑性能问题，建议设置合理的批量操作数量限制
3. 上传文件接口需要设置文件大小限制和类型限制
4. 所有状态变更操作需要记录操作日志
5. 接口返回格式必须统一，包含code、msg和data字段
