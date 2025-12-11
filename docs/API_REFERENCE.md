# API参考文档

## BOSS直聘 API

### 采集职位列表

**端点**: `GET https://www.zhipin.com/wapi/zpgeek/pc/recommend/job/list.json`

**请求头**:
```
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
Accept: application/json
Referer: https://www.zhipin.com/
X-Requested-With: XMLHttpRequest
```

**查询参数**:

| 参数 | 类型 | 说明 | 示例 |
|------|------|------|------|
| page | number | 分页页码 | 1 |
| pageSize | number | 每页条数 | 15 |
| city | string | 城市代码 | 101010100 |
| encryptExpectId | string | 期望职位ID（可空） | "" |
| mixExpectType | string | 期望类型（可空） | "" |
| expectInfo | string | 期望信息（可空） | "" |
| jobType | string | 职位类型 | 1901 |
| salary | string | 薪资范围（可空） | "" |
| experience | string | 工作经验（可空） | "" |
| degree | string | 学位要求（可空） | "" |
| industry | string | 行业（可空） | "" |
| scale | string | 公司规模（可空） | "" |
| _ | string | 时间戳（防缓存） | 1765447688321 |

**响应格式**:

成功响应（code = 0）:
```json
{
  "code": 0,
  "message": "ok",
  "data": [
    {
      "encryptId": "IZbyyNY6tVpUCVvlDlzVFl_h",
      "positionId": 123456789,
      "positionName": "React开发工程师",
      "companyFullName": "腾讯科技有限公司",
      "companyId": 987654321,
      "companyLogoUrl": "https://...",
      "cityName": "北京",
      "cityId": 101010100,
      "salary": "25k-35k",
      "workYear": "3-5年",
      "education": "本科",
      "financeStage": "A轮融资",
      "companySize": "15000人以上",
      "positionLables": ["React", "Vue", "Node.js"],
      "companyFullName": "腾讯科技有限公司",
      "formatCreateTime": "1小时前",
      "matchScore": 0.92
    }
    // ... 更多职位
  ],
  "zpData": {
    "pageSize": 15,
    "pageNo": 1,
    "hasMore": true,
    "totalCount": 500
  }
}
```

异常响应（API返回异常）:
```json
{
  "code": 37,
  "message": "您的访问行为异常",
  "zpData": {
    "ts": 1765451405020,
    "name": "ba93db10",
    "seed": "oIu3CKDqjq2OsLFiXNJlKE4KhlQPpKlUW3GtC+DJKgQ="
  }
}
```

### 城市代码

| 城市 | 代码 | 说明 |
|------|------|------|
| 北京 | 101010100 | 北京市 |
| 上海 | 101020100 | 上海市 |
| 深圳 | 101210100 | 广东省深圳市 |
| 杭州 | 101280100 | 浙江省杭州市 |
| 南京 | 101190400 | 江苏省南京市 |
| 成都 | 101260100 | 四川省成都市 |
| 西安 | 101110100 | 陕西省西安市 |
| 武汉 | 101200100 | 湖北省武汉市 |
| 天津 | 101030100 | 天津市 |
| 长沙 | 101220100 | 湖南省长沙市 |

### 职位类型代码

| 类型 | 代码 | 说明 |
|------|------|------|
| 全职 | 1901 | 全职工作 |
| 兼职 | 1902 | 兼职工作 |
| 实习 | 1903 | 实习生 |
| 其他 | 1904 | 其他类型 |

### 学位要求代码

| 学位 | 代码 |
|------|------|
| 初中及以下 | 1 |
| 高中 | 2 |
| 大专 | 3 |
| 本科 | 4 |
| 硕士 | 5 |
| 博士 | 6 |

## Chrome Extension API

### Chrome Storage API

#### 保存数据
```javascript
chrome.storage.local.set({
  'filterConfig': {
    website: 'boss',
    city: '101010100',
    // ... 更多字段
  }
}, () => {
  console.log('Data saved');
});
```

#### 读取数据
```javascript
chrome.storage.local.get(['filterConfig'], (result) => {
  const config = result.filterConfig;
  console.log(config);
});
```

#### 删除数据
```javascript
chrome.storage.local.remove(['filterConfig'], () => {
  console.log('Data removed');
});
```

### Chrome Runtime API

#### 发送消息
```javascript
chrome.runtime.sendMessage(
  {
    type: 'FETCH_JOBS',
    config: {
      website: 'boss',
      city: '101010100',
      // ... 其他配置
    },
    params: 'page=1&pageSize=15&city=101010100...'
  },
  (response) => {
    if (response.success) {
      console.log('Jobs fetched:', response.data);
    } else {
      console.error('Error:', response.error);
    }
  }
);
```

#### 监听消息
```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'FETCH_JOBS') {
    // 处理请求
    sendResponse({ success: true, data: [] });
  }
  return true; // 允许异步响应
});
```

## 插件内部消息格式

### FETCH_JOBS 消息

**发送者**: popup.tsx  
**接收者**: service-worker.js

**请求格式**:
```javascript
{
  type: 'FETCH_JOBS',
  config: {
    website: string,        // 招聘网站
    city: string,          // 城市代码
    district: string,      // 区域代码
    jobTitle: string,      // 职位名称
    jobType: string,       // 职位类型
    minAge: number,        // 最小年龄
    maxAge: number,        // 最大年龄
    minSalary: number,     // 最小薪资
    maxSalary: number,     // 最大薪资
    skills: string[]       // 技能标签
  },
  params: string          // URL查询字符串
}
```

**响应格式**:
```javascript
{
  success: boolean,       // 是否成功
  data: [                 // 职位数据
    {
      id: string,
      name: string,
      company: string,
      city: string,
      salary: string,
      skills: string[],
      matchScore: number
    }
  ],
  error?: string          // 错误信息（如果有）
}
```

## 数据存储结构

### FilterConfig
```typescript
interface FilterConfig {
  website: string;           // 招聘网站：boss, liepin, 51job, zhaopin, maimengaoping
  city: string;             // 城市代码
  district: string;         // 区域代码
  jobTitle: string;         // 职位名称关键词
  jobType: string;          // 职位类型：1901, 1902, 1903
  minAge: number;           // 最小年龄：18-65
  maxAge: number;           // 最大年龄：18-65
  minSalary: number;        // 最小薪资：0-100(K)
  maxSalary: number;        // 最大薪资：0-100(K)
  skills: string[];         // 技能标签数组
}
```

### JobData
```typescript
interface JobData {
  id: string;              // 职位唯一ID
  name: string;            // 职位名称
  company: string;         // 公司名称
  city: string;            // 工作城市
  salary: string;          // 薪资范围（如"25k-35k"）
  skills: string[];        // 所需技能数组
  matchScore: number;      // 匹配度：0-100
}
```

### CollectionStats
```typescript
interface CollectionStats {
  total: number;           // 职位总数
  lastUpdate: string;      // 最后更新时间（ISO 8601）
  source: string;          // 数据来源（如"BOSS直聘"）
}
```

## 错误处理

### 常见错误

| 错误代码 | 消息 | 原因 |
|--------|------|------|
| 37 | 您的访问行为异常 | 请求被BOSS直聘反爬虫机制拦截 |
| 401 | 未授权 | Cookie过期或会话失效 |
| 403 | 禁止访问 | IP被封禁或请求频率过高 |
| 404 | 未找到 | 接口不存在或已废弃 |
| 500 | 服务器错误 | BOSS直聘服务器问题 |

### 错误恢复策略

1. **网络错误** - 使用模拟数据进行演示
2. **API错误** - 返回缓存的上次采集数据
3. **解析错误** - 使用通用模拟数据

## 性能考虑

### 请求优化
- 使用合理的pageSize（推荐15-30）
- 避免频繁请求（建议间隔>60秒）
- 使用时间戳防止缓存

### 数据处理
- 只保存必要字段
- 定期清理过期数据
- 限制本地存储大小

## 安全建议

1. **不要存储敏感信息** - 避免保存密码、token等
2. **验证数据来源** - 只接受来自官方API的数据
3. **限制权限** - manifest.json中只申请必要权限
4. **监控请求** - 记录异常请求模式

## 扩展示例

### 添加新的招聘网站

1. 在 `popup.tsx` 中添加网站配置：
```javascript
const WEBSITES = [
  { value: 'boss', label: 'BOSS直聘' },
  { value: 'liepin', label: '猎聘' },  // 新增
  // ...
];
```

2. 在 `manifest.json` 中添加权限：
```json
"host_permissions": [
  "https://www.zhipin.com/*",
  "https://www.liepin.com/*"  // 新增
]
```

3. 在 `service-worker.js` 中实现采集函数：
```javascript
async function fetchJobsFromLiepin(config, params) {
  // 实现采集逻辑
}
```

## 参考资源

- [Chrome Extension API](https://developer.chrome.com/docs/extensions/reference/)
- [BOSS直聘](https://www.zhipin.com/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
- [Chrome Runtime API](https://developer.chrome.com/docs/extensions/reference/runtime/)

---

**最后更新**: 2025年12月11日  
**版本**: 1.0.0

