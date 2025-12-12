/**
 * Vite 配置主文件
 * 整合所有配置模块
 */
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import { serverConfig } from './server'
import { defineConfig as defineGlobalConfig } from './define'
import { buildConfig } from './build'

/**
 * 路径别名配置
 */
export const alias = {
	'@': resolve(__dirname, '../src'),
	'@components': resolve(__dirname, '../src/components'),
	'@types': resolve(__dirname, '../src/types'),
}

/**
 * 完整的 Vite 配置对象
 */
export const viteConfig = {
	plugins: [react()],
	server: serverConfig,
	define: defineGlobalConfig,
	resolve: {
		alias,
	},
	build: buildConfig,
}
