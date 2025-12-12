/**
 * Vite 全局变量定义配置
 */
export const defineConfig = {
	'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
	global: 'globalThis',
}
