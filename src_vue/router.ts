import { createRouter, createMemoryHistory, RouteRecordRaw } from 'vue-router'
import App from './App.vue'

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: App,
		children: [
			{ path: '', component: () => import('./views/Swiper/Swiper.vue') },
		]
	},
]

export const router = createRouter({
	history: createMemoryHistory(),
	routes,
})

