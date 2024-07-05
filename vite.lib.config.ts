import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import strip from '@rollup/plugin-strip'

export default defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, './package/index.ts'),
			name: 'image-mark',
			fileName: format => `index.${format}.js`,
		},
		minify: false
	},
	plugins: [
		strip({ include: '**/*.(js|ts)' }),
		dts({
			outDir: 'types',
		}),
	],
})
