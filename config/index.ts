import { serverConfig } from './server'
import { defineConfig as defineGlobalConfig } from './define'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

export const alias = {
	'@': resolve(__dirname, '../src'),
}

export const viteConfig = {
	plugins: [react()],
	server: serverConfig,
	define: defineGlobalConfig,
	resolve: {
		alias,
	},
}
