import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vitePluginForArco } from '@arco-plugins/vite-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		outDir: 'web-dist',
	},
	server: {
		host: true
	},
	plugins: [
		react(),
		vitePluginForArco({
			// theme: '@arco-themes/react-bywl-orangered'
		})
	],
	resolve: {
		alias: {
			'#': path.resolve(__dirname, './package'),
		}
	}
})
