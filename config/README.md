# Vite 配置说明

## 📂 配置文件结构

```
config/
├── index.ts       # 主配置文件，整合所有配置模块
├── define.ts      # 全局变量定义
├── server.ts      # 开发服务器配置
├── build.ts       # 构建配置
└── README.md      # 本文档
```

## 📝 各文件详解

### `index.ts` - 主配置文件

整合所有配置模块，并导出最终的 `viteConfig` 对象。

**功能：**
- 集中管理所有配置
- 定义路径别名（@ 映射到 src）
- 导入并组合各个配置模块

```typescript
export const viteConfig = {
  plugins: [react()],
  server: serverConfig,      // 开发服务器配置
  define: defineGlobalConfig, // 全局变量定义
  resolve: { alias },        // 路径别名
  build: buildConfig,        // 构建配置
}
```

### `define.ts` - 全局变量定义

定义在整个应用中可用的全局变量。

**当前配置：**
- `process.env.NODE_ENV` - 环境变量（'production' 或 'development'）
- `global` - 全局对象引用

### `server.ts` - 开发服务器配置

配置 Vite 开发服务器的运行参数。

**当前配置：**
- `port: 5173` - 开发服务器端口
- `host: true` - 监听所有地址
- `open: false` - 启动时不自动打开浏览器
- `strictPort: false` - 端口被占用时自动寻找可用端口

### `build.ts` - 构建配置

配置生产环境构建的参数。

**当前配置：**
- `outDir: 'dist'` - 输出目录
- `emptyOutDir: false` - 构建前不清空输出目录
- `lib.formats: ['iife']` - 构建格式为 IIFE（立即执行函数）
- **所有依赖都被打包进最终的 bundle** - 无需单独配置外部依赖

## 🔧 路径别名

在应用中可以使用以下别名来导入文件：

```typescript
// 而不是这样
import { Header } from '../../../components/Header/Header'

// 可以这样
import { Header } from '@components'
```

**可用别名：**
- `@` - src 目录
- `@components` - src/components 目录
- `@types` - src/types 目录

## 🚀 使用方式

### 开发

```bash
npm run dev
```

启动开发服务器，访问 `http://localhost:5173`

### 构建

```bash
npm run build
```

生成生产版本，输出到 `dist/` 目录

## 📦 依赖打包

所有 npm 依赖（react、antd 等）都会被打包进最终的 `main.js` 文件。这是 Chrome 扩展所需的方式。

**配置原理：**
- 使用 IIFE 格式（立即执行函数）
- 不配置外部依赖
- 所有依赖通过 Vite 的默认处理都包含在内

## 🔄 修改配置

如需修改配置，请：

1. **添加新的全局变量**：编辑 `define.ts`
2. **修改开发服务器参数**：编辑 `server.ts`
3. **修改构建输出**：编辑 `build.ts`
4. **添加新的路径别名**：编辑 `index.ts` 中的 `alias` 对象

修改后无需重启开发服务器（除了服务器相关的配置）。

## 📌 注意事项

- 不要删除 `config/index.ts` 中的 `viteConfig` 导出
- `vite.config.ts` 应该保持简洁，只需导入和使用 `viteConfig`
- 环境变量定义在 `define.ts` 中实现，而不是通过外部 `.env` 文件

## 相关文件

- [vite.config.ts](../vite.config.ts) - Vite 配置入口
- [package.json](../package.json) - npm 脚本配置
- [README.md](../README.md) - 项目总体说明



