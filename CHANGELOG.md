# BOSS直聘集成 - 变更日志

## v2.0 - 工作经验参数新增与薪资配置优化

### 📅 更新日期
2024年12月

### ✨ 新增功能

#### 1. 工作经验筛选
- 新增 `experience` 参数，支持多选
- 9个工作经验等级选项：
  - 在校生 (108)
  - 应届生 (102)
  - 经验不限 (101)
  - 1年以内 (103)
  - 1-3年 (104)
  - **3-5年 (105)** ← 默认推荐
  - **5-10年 (106)** ← 默认推荐
  - 10年以上 (107)
  - 不限 (0)

#### 2. 薪资参数优化
- 移除 `minSalary` 和 `maxSalary` 字段
- 保留 `salary` 多选参数
- 通过选择具体薪资代码段精确控制：
  - 3K以下 (402)
  - 3-5K (403)
  - 5-10K (404)
  - 10-20K (405)
  - 20-50K (406)
  - 50K以上 (407)

### 🔄 API参数变更

#### 请求参数对比

**v1.0版本**
```typescript
{
  page: '1',
  city: '101010100',
  expectId: '100101',
  salary: '406',
  minSalary: 15,        // ❌ 已移除
  maxSalary: 50         // ❌ 已移除
}
```

**v2.0版本**
```typescript
{
  page: '1',
  city: '101010100',
  expectId: '100101',
  salary: '405,406',              // ✅ 多选
  experience: '105,106'           // ✅ 新增
}
```

### 📝 文件变更清单

#### 类型定义
- **src/types/index.ts**
  ```typescript
  - minSalary: number
  - maxSalary: number
  + experience?: string[]
  ```

#### API服务
- **src/services/api.ts**
  ```typescript
  + export const EXPERIENCE_OPTIONS: Record<string, string>
  ```

#### 组件UI
- **src/components/FilterPanel/FilterPanel.tsx**
  ```typescript
  + import EXPERIENCE_OPTIONS
  + experienceOptions 计算逻辑
  + 工作经验多选选择器UI
  - 薪资范围滑块
  + 薪资改为dropdown多选
  ```

#### 参数处理
- **src/popup.tsx**
  ```typescript
  - minSalary: 15
  - maxSalary: 25
  + experience: []
  
  + if (config.experience) {
  +   params.experience = config.experience.join(',')
  + }
  ```

#### 存储初始化
- **public/service-worker.js**
  ```typescript
  - minSalary: 15
  - maxSalary: 25
  + experience: []
  ```

### 🎯 使用示例

#### 校园招聘场景
```typescript
{
  experience: ['108', '102'],  // 在校生 + 应届生
  salary: ['403', '404'],      // 3-10K
}
```

#### 中高级工程师招聘
```typescript
{
  experience: ['105', '106'],  // 3-5年 + 5-10年
  salary: ['406', '407'],      // 20K+
}
```

#### 经验不限招聘
```typescript
{
  experience: ['101'],         // 经验不限
  salary: ['404', '405'],      // 5-20K
}
```

### 💾 配置迁移指南

#### 从v1.0升级到v2.0

**旧配置**
```typescript
const oldConfig = {
  minSalary: 20,
  maxSalary: 50,
  // ... 其他配置
}
```

**新配置**
```typescript
const newConfig = {
  // ✅ 使用salary多选代替min/maxSalary
  salary: ['406', '407'],        // 20-50K以上
  // ✅ 新增experience参数
  experience: ['105', '106'],    // 3-5年, 5-10年
  // ... 其他配置保持不变
}
```

### 📊 向后兼容性

**破坏性变更**
- ❌ `minSalary` 字段移除 - 使用 `salary` 多选替代
- ❌ `maxSalary` 字段移除 - 使用 `salary` 多选替代

**影响范围**
- 所有使用 `minSalary`/`maxSalary` 的代码需要更新
- 建议使用 BOSS_EXAMPLES.ts 中的示例作为参考

### ✅ 测试检查清单

- [ ] 工作经验选择器正常显示9个选项
- [ ] 工作经验多选功能正常工作
- [ ] 薪资多选显示7个选项
- [ ] 薪资多选功能正常工作
- [ ] API请求参数正确包含 `experience` 字段
- [ ] API请求参数正确包含 `salary` 多选值
- [ ] minSalary/maxSalary 不再出现在请求中
- [ ] 年龄范围滑块仍正常显示（非BOSS直聘时）
- [ ] 存储初始化包含新字段

### 🔍 调试参考

#### 查看配置结构
```typescript
console.log(config)
// 应显示:
// {
//   experience: ['105', '106'],
//   salary: ['406'],
//   // ... 其他字段
// }
```

#### 查看API请求
```typescript
// 在handleRefresh中打印params
console.log('params:', params)
// 应包含: experience=105,106 salary=406
```

#### 验证存储
```typescript
chrome.storage.local.get(['filterConfig'], (result) => {
  console.log(result.filterConfig)
  // 应包含 experience 字段，不包含 minSalary/maxSalary
})
```

### 🚀 后续计划

- [ ] 版本号更新至 v1.1.0
- [ ] 发布Release Notes
- [ ] 更新用户文档
- [ ] 收集用户反馈
- [ ] 考虑其他API参数的优化

### 相关文档

- 📖 BOSS_INTEGRATION.md - 完整实现文档
- 📋 BOSS_EXAMPLES.ts - 配置示例代码
- 🔗 README.md - 项目总览

