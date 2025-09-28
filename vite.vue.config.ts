import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
//@ts-ignore
import virtualHtml from 'vite-plugin-virtual-html'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		outDir: 'web-vue-dist',
	},
	server: {
		host: true,
	},
	plugins: [
		vue(),
		virtualHtml({
			pages: {
				index: '/index.vue.html',
			},
			index: 'index'
		}),
	],
	resolve: {
		alias: {
			'#': path.resolve(__dirname, './package'),
		}
	}
})
