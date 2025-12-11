# 开发指南

## 📚 目录结构

```
recruitment-data-collection-/
├── public/                          # 静态资源和插件配置
│   ├── manifest.json               # Chrome扩展清单（必需）
│   ├── popup.html                  # 弹出窗口HTML（必需）
│   ├── service-worker.js           # 后台服务工作者（必需）
│   ├── content-script.js           # 内容脚本
│   └── icons/                      # 扩展图标
├── src/                            # React源代码
│   ├── popup.tsx                   # 主Popup组件
│   ├── popup.css                   # 样式文件
│   ├── main.tsx                    # 应用入口
│   ├── index.css                   # 全局样式
│   ├── App.tsx                     # 原始App组件
│   ├── types/                      # TypeScript类型定义
│   │   └── index.ts               # 所有类型定义
│   └── assets/                     # 静态资源
├── config/                         # 配置文件
│   ├── define.ts                  # 构建定义
│   ├── index.ts                   # 配置入口
│   └── server.ts                  # 开发服务器配置
├── docs/                          # 文档
│   ├── API_REFERENCE.md           # API参考
│   └── DEVELOPMENT.md             # 开发指南（本文件）
├── scripts/                        # 构建脚本
│   ├── copy-assets.js             # 资源复制脚本
│   └── generate-icons.js          # 图标生成脚本
├── vite.config.ts                 # Vite配置
├── tsconfig.json                  # TypeScript主配置
├── tsconfig.app.json              # TypeScript应用配置
├── tsconfig.node.json             # TypeScript Node配置
├── eslint.config.js               # ESLint配置
├── package.json                   # 项目依赖
├── pnpm-lock.yaml                 # 依赖锁定文件
├── README.md                       # 项目说明
├── QUICK_START.md                 # 快速开始
└── html_prototype.html            # HTML原型（参考）
```

## 🔧 开发环境配置

### 1. 安装Node.js

推荐使用最新的LTS版本（v18或更高）。

```bash
# 验证Node.js安装
node --version
npm --version
```

### 2. 安装依赖

```bash
cd /Users/apple/Documents/github/recruitment-data-collection-
npm install
# 或使用pnpm
pnpm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

开发服务器会在 `http://localhost:5173` 启动。

## 📦 构建项目

### 生产构建

```bash
npm run build
```

这会执行以下步骤：
1. 运行 `prebuild` 脚本生成图标
2. 编译TypeScript
3. 运行Vite构建
4. 复制资源文件到dist目录

### 输出文件

构建完成后，`dist/` 目录包含：
- `popup.html` - 弹出窗口HTML
- `popup.js` - 编译后的React应用
- `manifest.json` - 扩展清单
- `service-worker.js` - 后台脚本
- `content-script.js` - 内容脚本
- `icons/` - 图标文件

## 🎯 核心开发概念

### 1. Chrome Extension 架构

```
┌─────────────────────────────────────┐
│   Chrome浏览器              │
├─────────────────────────────────────┤
│ Service Worker (后台)          │
│ ├─ 处理消息                 │
│ ├─ 发送HTTP请求            │
│ └─ 管理数据                 │
├─────────────────────────────────────┤
│ Popup (UI界面)              │
│ ├─ React组件              │
│ ├─ 用户交互               │
│ └─ 显示结果               │
├─────────────────────────────────────┤
│ Content Script (网页脚本)      │
│ ├─ 注入到网页              │
│ ├─ 提取页面数据            │
│ └─ 与网页交互              │
└─────────────────────────────────────┘
```

### 2. 数据流

```
用户配置
    ↓
点击刷新按钮
    ↓
发送消息到Service Worker
    ↓
Service Worker获取数据
    ↓
解析API响应
    ↓
存储到Chrome Storage
    ↓
更新UI显示结果
```

### 3. 消息通信

**Popup → Service Worker**:
```javascript
chrome.runtime.sendMessage({
  type: 'FETCH_JOBS',
  config: filterConfig,
  params: queryString
})
```

**Service Worker → Popup**:
```javascript
sendResponse({
  success: true,
  data: jobsList
})
```

## 💻 开发工作流

### 修改UI组件

编辑 `src/popup.tsx`：

```typescript
// 添加新的输入字段
const handleNewField = (value: string) => {
  setConfig({ ...config, newField: value })
  saveConfig({ ...config, newField: value })
}

// 在JSX中使用
<input
  value={config.newField}
  onChange={(e) => handleNewField(e.target.value)}
/>
```

### 修改样式

编辑 `public/popup.html` 中的 `<style>` 标签：

```css
.my-class {
  background: #2C5AA0;
  padding: 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.my-class:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

或使用Tailwind工具类：

```html
<div class="bg-primary p-3 rounded-lg hover:shadow-lg transition-all">
  Content
</div>
```

### 修改API逻辑

编辑 `public/service-worker.js`：

```javascript
async function fetchJobsFromZhipin(config, params) {
  try {
    const url = `https://www.zhipin.com/wapi/...?${params}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0...'
      }
    })
    
    const data = await response.json()
    return parseZhipinData(data, config)
  } catch (error) {
    console.error('Error:', error)
    return generateMockData(config)
  }
}
```

### 调试

使用Chrome DevTools：

1. **Popup调试**:
   - 右键点击插件图标 → "检查"
   - 或 `chrome://extensions/` → 插件详情 → "检查视图" → popup

2. **Service Worker调试**:
   - `chrome://extensions/` → 插件详情 → "检查视图" → service worker

3. **Content Script调试**:
   - 打开目标网站
   - F12打开DevTools
   - Console标签页查看错误

## 🧪 测试

### 手动测试清单

- [ ] 配置各个筛选条件
- [ ] 点击刷新按钮采集数据
- [ ] 检查采集结果是否正确
- [ ] 查看职位列表展示
- [ ] 切换标签页
- [ ] 刷新浏览器确保数据持久化
- [ ] 测试删除技能标签
- [ ] 测试添加新技能标签

### 测试模拟数据

在 `public/service-worker.js` 中修改 `generateMockData` 函数来测试不同场景：

```javascript
function generateMockData(config) {
  return [
    {
      id: 'test_1',
      name: '测试职位',
      company: '测试公司',
      city: '北京',
      salary: '20K-30K/月',
      skills: ['React', 'TypeScript'],
      matchScore: 95
    }
    // ... 更多测试数据
  ]
}
```

## 📝 代码规范

### TypeScript

```typescript
// 使用类型注解
const handleChange = (value: string): void => {
  setConfig({ ...config, jobTitle: value })
}

// 使用接口定义数据结构
interface Config {
  website: string
  city: string
}

// 避免使用 any
// ❌ const config: any = {}
// ✅ const config: FilterConfig = {}
```

### React

```typescript
// 使用函数组件和Hooks
export default function MyComponent() {
  const [state, setState] = useState<string>('')
  
  useEffect(() => {
    // 初始化逻辑
  }, [])
  
  return <div>Component</div>
}

// 使用useCallback避免不必要的重新渲染
const handleClick = useCallback(() => {
  console.log('clicked')
}, [])
```

### 命名规范

```typescript
// 组件：PascalCase
export function MyComponent() {}

// 函数：camelCase
const fetchJobs = () => {}

// 常量：UPPER_SNAKE_CASE
const API_URL = 'https://...'

// 接口：PascalCase
interface FilterConfig {}

// 类型：PascalCase
type JobStatus = 'active' | 'inactive'
```

## 🐛 常见问题

### Q: 编译错误 "Cannot find module..."
**A**: 运行 `npm install` 重新安装依赖。

### Q: Service Worker未加载
**A**: 检查 `manifest.json` 中的 `service_worker` 字段是否正确。

### Q: 样式未应用
**A**: 
1. 检查Tailwind CSS是否已加载
2. 清除浏览器缓存
3. 重新加载扩展程序

### Q: API请求失败
**A**:
1. 检查网络连接
2. 验证请求URL和参数
3. 查看service worker控制台错误
4. 确认BOSS直聘网站可访问

## 🚀 优化技巧

### 性能优化

```typescript
// 使用useMemo避免重复计算
const filteredJobs = useMemo(() => {
  return jobs.filter(job => job.matchScore > 80)
}, [jobs])

// 使用useCallback保存函数引用
const handleFetch = useCallback(async () => {
  // 采集数据
}, [config])

// 使用React.memo优化子组件
const JobCard = React.memo(({ job }: { job: JobData }) => {
  return <div>{job.name}</div>
})
```

### 代码分割

```typescript
// 动态导入组件
const JobList = lazy(() => import('./JobList'))

// 在Suspense中使用
<Suspense fallback={<Loading />}>
  <JobList />
</Suspense>
```

## 📚 学习资源

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🔒 安全最佳实践

1. **验证所有输入**
   ```typescript
   const validateInput = (input: string): boolean => {
     return input.trim().length > 0 && input.length < 100
   }
   ```

2. **避免执行动态代码**
   ```typescript
   // ❌ 避免
   eval(userInput)
   
   // ✅ 使用安全的方法
   const result = JSON.parse(userInput)
   ```

3. **使用HTTPS**
   ```javascript
   // manifest.json中的host_permissions
   "host_permissions": [
     "https://www.zhipin.com/*"  // 使用HTTPS
   ]
   ```

## 📤 发布到Chrome Web Store

1. 创建[Chrome Web Store开发者账户](https://developer.chrome.com/docs/webstore/)
2. 构建项目：`npm run build`
3. 创建 `.zip` 文件包含 `dist/` 目录
4. 上传到Chrome Web Store
5. 填写应用信息和截图
6. 提交审核

## 🎓 进阶话题

### 扩展权限模型

```json
{
  "permissions": [
    "storage",    // 访问Chrome Storage API
    "alarms",     // 使用定时任务
    "activeTab"   // 访问当前活跃标签
  ],
  "host_permissions": [
    "https://www.zhipin.com/*"  // 在这些网站上运行脚本
  ]
}
```

### 跨域请求

Service Worker中的请求不受CORS限制，可以直接访问任何API。

### 本地存储限制

Chrome Storage API的大小限制：
- `chrome.storage.sync`: 100KB
- `chrome.storage.local`: 10MB (或更多)

---

**最后更新**: 2025年12月11日  
**版本**: 1.0.0

