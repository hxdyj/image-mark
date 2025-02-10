import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import strip from '@rollup/plugin-strip'
import pkg from './package.json'
export default defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, './package/index.ts'),
			name: pkg.name,
			fileName: format => `index.${format}.js`,
		},
		minify: false
	},
	plugins: [
		strip({ include: '**/*.(js|ts)' }),
		dts({
			outDir: path.resolve(__dirname, './types'),
			root: path.resolve(__dirname, './package'),
			include: [path.resolve(__dirname, './package') + '/**/*'],
			tsconfigPath: path.resolve(__dirname, './tsconfig.node.json')
		}),
	],
})
