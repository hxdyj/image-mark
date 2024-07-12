import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'base',
		component: () => import('../views/Base.vue'),
	},
	{
		path: '/map',
		name: 'map',
		component: () => import('../views/Map.vue'),
	},

]

export const constRoutes = routes.filter(i => i.meta?.isConstRoute)

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes,
})

export default router
