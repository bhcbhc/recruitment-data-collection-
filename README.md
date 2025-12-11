# 招聘数据采集器 - Chrome浏览器插件

一个功能强大的Chrome浏览器插件，帮助用户快速筛选和采集招聘网站上的职位信息。目前支持BOSS直聘，后续可扩展支持其他平台。

## 📋 功能特性

### 核心功能
- ✨ **智能数据采集** - 一键采集招聘网站职位数据
- 🔍 **多维度筛选** - 支持岗位名称、城市、薪资、年龄、技能等多维筛选
- 📊 **实时统计** - 显示采集职位总数和匹配度评分
- 💾 **数据持久化** - 采集数据自动保存，支持离线查看
- 🎯 **智能匹配** - 根据技能标签计算职位匹配度

### 筛选维度
- **基础筛选**
  - 岗位名称搜索
  - 招聘网站选择（BOSS直聘、猎聘、51Job等）
  - 城市与区域多级选择
  - 岗位类型（全职、兼职、实习）

- **薪资与年龄**
  - 年龄范围滑块选择（18-65岁）
  - 薪资范围滑块选择（0-100K）
  - 实时显示选择范围

- **技能标签**
  - 快速添加技能标签
  - 支持多标签管理
  - 一键删除标签

### UI特点
- 🎨 现代化设计 - 使用Tailwind CSS框架
- 🌈 视觉分层 - 清晰的色彩和布局
- ⚡ 流畅交互 - 平滑的动画和过渡效果
- 📱 响应式布局 - 完美适配插件窗口

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 或 pnpm
- Chrome 90+ 浏览器

### 安装依赖

```bash
npm install
# 或
pnpm install
```

### 开发模式

```bash
npm run dev
```

### 构建插件

```bash
npm run build
```

构建完成后，编译好的插件文件将在 `dist/` 目录中。

## 📦 安装到Chrome

### 方法1：开发者模式安装（推荐用于开发）

1. 打开Chrome浏览器
2. 输入地址栏：`chrome://extensions/`
3. 启用右上角的 **"开发者模式"**
4. 点击 **"加载已解压的扩展程序"**
5. 选择项目中的 `dist` 文件夹
6. 完成！插件将出现在扩展程序列表中

### 方法2：使用CRX文件安装

1. 构建完成后会生成 `.crx` 文件
2. 将其拖入Chrome浏览器窗口
3. 按照提示完成安装

## 📖 使用指南

### 第一步：配置筛选条件

1. 点击插件图标打开采集器
2. 在 **筛选条件** 标签页配置参数：
   - 输入岗位名称（可选）
   - 选择招聘网站
   - 选择城市和区域
   - 选择岗位类型
   - 调整年龄范围
   - 调整薪资范围
   - 添加技能标签

### 第二步：开始采集

1. 配置完成后点击下方的 **"点击刷新采集数据"** 按钮
2. 插件将向BOSS直聘发起请求采集数据
3. 采集过程中会显示加载动画

### 第三步：查看结果

1. 采集完成后自动切换到 **职位列表** 标签页
2. 查看统计信息：职位总数、匹配度、更新时间
3. 浏览职位列表，每条职位显示：
   - 岗位名称
   - 公司名称和城市
   - 薪资范围
   - 所需技能
   - 匹配度评分
4. 点击职位卡片可查看详细信息

## 🔧 配置说明

### 联系BOSS直聘API

插件使用以下API端点采集数据：

```
https://www.zhipin.com/wapi/zpgeek/pc/recommend/job/list.json
```

主要参数：
- `page` - 页码（默认1）
- `pageSize` - 每页数量（默认15）
- `city` - 城市代码
- `jobType` - 岗位类型代码
- `salary` - 薪资范围
- `experience` - 工作经验
- `degree` - 学位要求

### 存储结构

插件使用Chrome Storage API存储配置和数据：

```javascript
{
  filterConfig: {
    website: 'boss',           // 招聘网站
    city: '101010100',         // 城市代码
    district: '',              // 区域代码
    jobTitle: '',              // 岗位名称
    jobType: '',               // 岗位类型
    minAge: 25,                // 最小年龄
    maxAge: 35,                // 最大年龄
    minSalary: 15,             // 最小薪资(K)
    maxSalary: 25,             // 最大薪资(K)
    skills: ['React']          // 技能标签数组
  },
  jobsData: [],                // 采集的职位数据
  stats: {                      // 统计信息
    total: 0,
    lastUpdate: '',
    source: 'BOSS直聘'
  }
}
```

## 📁 项目结构

```
recruitment-data-collection-/
├── public/
│   ├── manifest.json           # Chrome扩展清单文件
│   ├── popup.html              # 弹出窗口HTML
│   ├── service-worker.js       # 后台服务工作者
│   ├── content-script.js       # 内容脚本
│   └── icons/                  # 扩展图标
├── src/
│   ├── popup.tsx               # React Popup组件
│   ├── popup.css               # 样式文件
│   ├── App.tsx                 # 主应用组件
│   ├── main.tsx                # 入口文件
│   ├── index.css               # 全局样式
│   └── assets/                 # 静态资源
├── config/                     # 配置文件目录
├── scripts/
│   └── copy-assets.js          # 构建辅助脚本
├── vite.config.ts              # Vite配置
├── tsconfig.json               # TypeScript配置
├── package.json                # 项目配置
└── README.md                   # 本文件
```

## 🛠️ 开发

### 文件说明

#### public/manifest.json
Chrome扩展的配置清单，定义：
- 扩展元信息（名称、版本、权限等）
- 弹出窗口入口
- 后台服务工作者
- 内容脚本配置

#### public/service-worker.js
后台服务脚本，负责：
- 处理来自popup的消息
- 发送HTTP请求到招聘网站API
- 解析和处理返回数据
- 生成模拟数据用于测试

#### public/content-script.js
在网页上下文运行的脚本，负责：
- 从页面中提取数据（可选）
- 监听页面变化
- 与popup进行通信

#### src/popup.tsx
React组件，提供用户界面：
- 筛选条件表单
- 职位列表展示
- 统计信息展示
- 标签页切换

### 扩展API

#### Chrome Storage API
```javascript
// 保存数据
chrome.storage.local.set({ key: value })

// 读取数据
chrome.storage.local.get(['key'], (result) => {
  console.log(result.key)
})

// 清除数据
chrome.storage.local.remove(['key'])
```

#### Chrome Runtime API
```javascript
// 发送消息给service worker
chrome.runtime.sendMessage(
  { type: 'FETCH_JOBS', config: {...} },
  (response) => {
    console.log(response)
  }
)

// 监听消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse({ result: 'ok' })
})
```

## 🎨 样式系统

插件使用Tailwind CSS框架，自定义颜色方案：

```css
--color-primary: #2C5AA0      /* 主色 */
--color-darkGray: #333333     /* 深灰 */
--color-mediumGray: #666666   /* 中灰 */
--color-success: #28A745      /* 成功 */
--color-warning: #FFC107      /* 警告 */
```

## ⚠️ 注意事项

1. **CORS限制** - 直接从浏览器请求招聘网站API可能受到CORS限制，已配置跨域请求支持

2. **请求频率** - 避免频繁请求，建议间隔不少于1分钟

3. **用户代理** - Service Worker中设置了User-Agent以模拟浏览器请求

4. **数据解析** - 当API返回异常时，自动使用模拟数据进行演示

## 🔄 更新与维护

### 添加新的招聘网站

1. 在 `popup.tsx` 的 `WEBSITES` 数组中添加新网站
2. 在 `service-worker.js` 中实现新的fetch函数
3. 在 `manifest.json` 的 `host_permissions` 中添加新域名
4. 实现数据解析逻辑

### 修改API参数

在 `service-worker.js` 的 `fetchJobsFromZhipin` 函数中修改参数构建逻辑。

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📧 联系方式

如有问题或建议，请通过以下方式联系：

- 提交Issue
- 发送邮件

## 🎯 后续计划

- [ ] 支持更多招聘网站（猎聘、51Job、智联等）
- [ ] 添加数据导出功能（Excel、CSV）
- [ ] 实现自动定时采集
- [ ] 添加数据分析和统计报表
- [ ] 支持职位收藏和对比
- [ ] 实现简历匹配智能推荐
- [ ] 支持多语言界面

---

**最后更新**: 2025年12月11日

**版本**: 1.0.0

**开发者**: AI Assistant
