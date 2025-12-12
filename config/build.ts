import type { BuildOptions } from 'vite'

/**
 * Vite 构建配置
 * 所有依赖都会被打包到最终的 bundle 中
 */
export const buildConfig: BuildOptions = {
	target: 'esnext',
	minify: false,
	outDir: 'dist',
	emptyOutDir: false,
	rollupOptions: {
		input: 'src/main.tsx',
		output: {
			entryFileNames: 'main.js',
			assetFileNames: '[name][extname]',
			format: 'iife'
		}
	}
}

