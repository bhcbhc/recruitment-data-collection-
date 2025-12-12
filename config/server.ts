/**
 * Vite 开发服务器配置
 */
export const serverConfig = {
	port: parseInt(process.env.VITE_PORT || '5173'),
	host: true,
	open: false,
	strictPort: false,
}
