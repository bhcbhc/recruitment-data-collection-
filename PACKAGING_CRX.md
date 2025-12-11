# CRX 文件打包指南

生成 CRX 文件用于分发和发布 Chrome 扩展。

## 📦 什么是 CRX 文件？

CRX（Chrome Extension）是 Chrome 扩展的官方打包格式，包含：
- 所有扩展文件（HTML、JS、CSS 等）
- manifest.json 配置
- 数字签名（用于验证）

## 🚀 方法1: 使用 Chrome 浏览器打包（推荐）

这是最安全和官方的方法。

### 步骤1: 生成扩展密钥

首先，确保已构建项目：

```bash
npm run build
```

### 步骤2: 打开 Chrome 扩展管理页面

1. 打开 Chrome 浏览器
2. 输入地址栏: `chrome://extensions/`
3. 确保右上角 **"开发者模式"** 已启用

### 步骤3: 打包扩展

1. 在扩展列表中找到 "招聘数据采集器"
2. 点击 **"打包扩展程序"** 按钮
3. 弹出对话框，选择 `dist` 文件夹作为扩展文件夹
4. 将 **私钥文件** 字段留空（首次生成）
5. 点击 **"打包扩展程序"**

**输出文件**：
```
recruitment-data-collection-.crx      # 打包后的扩展文件
recruitment-data-collection-.pem      # 私钥文件（妥善保管！）
```

### ⚠️ 重要：保存私钥

私钥文件（`.pem`）用于：
- 签名更新的扩展版本
- 保证扩展的真实性
- 发布到 Chrome Web Store

**必须妥善保管此文件！** 建议：
```bash
# 保存到安全的位置
mkdir -p ~/.chrome-extensions
cp recruitment-data-collection-.pem ~/.chrome-extensions/

# 设置文件权限
chmod 600 ~/.chrome-extensions/recruitment-data-collection-.pem
```

## 🔧 方法2: 使用 NPM 脚本自动化（可选）

可以在 package.json 中添加自动打包脚本。

### 安装 crx3 工具

```bash
npm install --save-dev crx3
```

### 创建打包脚本

在项目根目录创建 `scripts/build-crx.js`:

```javascript
#!/usr/bin/env node

import Crx3 from 'crx3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist');
const keyFile = path.join(__dirname, '../recruitment-data-collection-.pem');
const outputFile = path.join(__dirname, '../recruitment-data-collection-.crx');

async function buildCrx() {
  try {
    // 检查dist目录是否存在
    if (!fs.existsSync(distDir)) {
      console.error('❌ dist 目录不存在，请先运行 npm run build');
      process.exit(1);
    }

    console.log('📦 开始生成 CRX 文件...');

    // 如果密钥文件存在，使用它；否则生成新的
    let privateKey = null;
    if (fs.existsSync(keyFile)) {
      privateKey = fs.readFileSync(keyFile);
      console.log('🔑 使用现有私钥文件');
    } else {
      console.log('🔑 生成新的私钥文件');
    }

    const crx3 = new Crx3({
      privateKey: privateKey
    });

    // 生成CRX文件
    const crxData = await crx3.load(distDir);
    const crxBuffer = crxData.toBuffer();

    // 保存CRX文件
    fs.writeFileSync(outputFile, crxBuffer);
    console.log(`✅ CRX 文件已生成: ${outputFile}`);

    // 保存私钥（如果是新生成的）
    if (!fs.existsSync(keyFile) && crx3.privateKey) {
      fs.writeFileSync(keyFile, crx3.privateKey);
      console.log(`✅ 私钥已保存: ${keyFile}`);
      console.log('⚠️  请妥善保管私钥文件！');
    }

  } catch (error) {
    console.error('❌ 生成CRX文件失败:', error.message);
    process.exit(1);
  }
}

buildCrx();
```

### 在 package.json 中添加脚本

```json
{
  "scripts": {
    "build": "tsc -b && vite build && npm run copy-assets",
    "build:crx": "npm run build && node scripts/build-crx.js"
  }
}
```

### 使用自动化脚本

```bash
npm run build:crx
```

这会自动：
1. 构建项目
2. 复制资源文件
3. 生成 CRX 文件
4. 保存私钥

## 📋 生成 CRX 文件检查清单

生成前确保：

- [ ] 已运行 `npm run build` 成功
- [ ] `dist` 文件夹包含所有必需文件：
  - [ ] manifest.json
  - [ ] popup.html
  - [ ] popup.js
  - [ ] service-worker.js
  - [ ] content-script.js
  - [ ] icons/

## 📊 生成的文件说明

### CRX 文件格式

```
recruitment-data-collection-.crx
├── 文件头信息（签名和元数据）
├── 所有扩展文件的压缩存档
└── 数字签名
```

### 文件大小

- CRX 文件通常在 200-500KB 之间
- 包含了所有资源和编译后的代码

## 🔐 私钥管理

### 重要事项

```bash
# ✅ 做这些
- 将 .pem 文件保存在安全的地方
- 使用版本控制系统的 .gitignore 排除私钥
- 为多个开发者共享密钥时使用加密存储

# ❌ 不要做这些
- 不要公开分享 .pem 文件
- 不要将 .pem 文件提交到公开仓库
- 不要在不安全的通道中传输密钥
```

### .gitignore 配置

```bash
# 添加到 .gitignore
*.pem
*.crx
dist/
```

## 🚀 发布 CRX 文件

### 方式1: 直接安装（开发/测试）

```bash
# 将 .crx 文件拖入 Chrome 窗口
# 或
# chrome://extensions/ → 选择 .crx 文件
```

### 方式2: 发布到 Chrome Web Store

1. 访问 https://chrome.google.com/webstore/devconsole/
2. 上传 `.crx` 文件
3. 填写应用信息
4. 提交审核

### 方式3: 企业分发

使用 CRX 文件和更新清单进行企业内部分发：

```xml
<?xml version='1.0' encoding='UTF-8'?>
<gupdate xmlns='http://www.google.com/update2/response' protocol='3.0'>
  <app appid='extension_id'>
    <updatecheck codebase='https://example.com/recruitment.crx' version='1.0.0' />
  </app>
</gupdate>
```

## 📈 版本更新

### 更新现有扩展

1. 修改代码
2. 更新 `manifest.json` 中的版本号：

```json
{
  "version": "1.0.1"
}
```

3. 重新构建和打包：

```bash
npm run build:crx
```

4. 使用之前保存的 `.pem` 私钥，CRX 文件会使用相同的签名

### 版本号规范

遵循语义化版本（Semantic Versioning）：

```
1.0.0
│ │ └─ 补丁版本（修复bug）
│ └─── 次版本（新功能）
└───── 主版本（重大变更）
```

## 🆘 故障排除

### Q: 无法找到打包扩展程序按钮

**A**: 确保：
1. 已启用开发者模式（右上角开关）
2. 扩展已成功加载
3. 使用最新版 Chrome（v95+）

### Q: CRX 文件无法安装

**A**: 检查：
1. 文件不损坏（尝试重新生成）
2. manifest.json 有效
3. 所有资源文件存在

### Q: 签名验证失败

**A**: 
1. 确保使用相同的私钥文件
2. 不要修改 .crx 文件内容
3. 重新生成新的 CRX 文件

### Q: 私钥文件丢失

**A**: 
1. 如果在 Chrome Web Store 发布，可以从 Store 重新获取
2. 如果是本地开发，可以生成新的私钥（但扩展 ID 会改变）
3. 建议定期备份 .pem 文件

## 📚 完整工作流

### 本地开发和测试

```bash
# 1. 开发代码
npm run dev

# 2. 构建项目
npm run build

# 3. 在 Chrome 中加载 dist 文件夹（开发者模式）
# chrome://extensions/ → 加载已解压的扩展程序 → 选择 dist

# 4. 测试功能

# 5. 修改代码后重新构建和重载
npm run build
# 在 chrome://extensions/ 中点击重载按钮
```

### 发布版本

```bash
# 1. 更新版本号
# 修改 manifest.json 和 package.json 中的版本号

# 2. 构建和打包
npm run build:crx

# 3. 生成发布说明
# 记录更新内容

# 4. 上传到 Chrome Web Store
# 或进行其他分发方式

# 5. 备份私钥
cp recruitment-data-collection-.pem ~/.chrome-extensions/backup-v1.0.0.pem
```

## 🎯 最佳实践

1. **版本控制**: 使用 git 标签标记发布版本
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

2. **变更日志**: 维护 CHANGELOG.md 记录版本变更
   ```
   ## [1.0.0] - 2025-12-11
   ### Added
   - 初始版本发布
   - 数据采集功能
   - 筛选和搜索
   ```

3. **密钥备份**: 多地备份私钥文件
   ```bash
   # 加密备份
   openssl enc -aes-256-cbc -in recruitment-data-collection-.pem -out recruitment-data-collection-.pem.enc
   ```

4. **代码签名**: 所有发布版本都应该用私钥签名

## 📞 更多资源

- [Chrome Extension 官方文档 - 打包](https://developer.chrome.com/docs/extensions/mv3/tut_basics/)
- [CRX 格式说明](https://wiki.crouchingtigerhiddendmca.com/CRX)
- [Chrome Web Store 发布指南](https://developer.chrome.com/docs/webstore/)

---

**提示**: 第一次生成 CRX 时，Chrome 会创建新的私钥。请妥善保管此文件，后续更新都需要使用相同的私钥来保持扩展 ID 不变。

**最后更新**: 2025年12月11日

