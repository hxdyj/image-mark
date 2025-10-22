import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import strip from '@rollup/plugin-strip'
import pkg from './package.json'
import cleanPlugin from 'vite-plugin-clean'
export default defineConfig({
	publicDir: 'public-faker',
	build: {
		lib: {
			entry: path.resolve(__dirname, './package/index.ts'),
			name: pkg.name,
			fileName: (format) => `index.${format}.js`,
			cssFileName: 'style'
		},
		rollupOptions: {
			external: ['@svgdotjs/svg.js'],
			output: {
				globals: {
					'@svgdotjs/svg.js': 'SVG'
				}
			}
		},
		minify: false,
	},
	plugins: [
		cleanPlugin({
			targetFiles: ['./dist', './types'],
		}),
		strip({ include: '**/*.(js|ts)' }),
		dts({
			outDir: path.resolve(__dirname, './types'),
			root: path.resolve(__dirname, './package'),
			include: [
				path.resolve(__dirname, './package') + '/**/*',
				path.resolve(__dirname, './typings') + '/**/*'
			],
			tsconfigPath: path.resolve(__dirname, './tsconfig.node.json'),
		})
	],
})
