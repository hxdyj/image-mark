import { createBrowserRouter, resolvePath } from 'react-router-dom'
import { Layout } from '../components/Layout/Layout'
import type { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom'
import App from '../App'
import { AppError } from '../views/Error/Error'
import { IconFont } from '../components/Iconfont'
import { Base } from '../views/Base'
import { TeamMarkPlugin } from '../views/TeamMarkPlugin'
import { SvgDemo } from '../views/SvgDemo'

interface CustomRouteFields {
	meta?: {
		icon?: JSX.Element
		title?: string
		permission?: string
		menuShow?: boolean
		noLogin?: boolean
		level?: number
	}
	homeRoute?: boolean
	layoutRoute?: boolean
	childIndexRoute?: boolean
}

type AppIndexRouteObject = IndexRouteObject & CustomRouteFields
type AppNonIndexRouteObject = Omit<NonIndexRouteObject, 'children'> &
	CustomRouteFields & {
		children?: (AppIndexRouteObject | AppNonIndexRouteObject)[]
	}

export type IRoute = AppIndexRouteObject | AppNonIndexRouteObject

export const routes: IRoute[] = [
	{
		path: '/',
		element: <App />,
		errorElement: <AppError />,
		children: [

			{
				layoutRoute: true,
				element: <Layout />,
				errorElement: <AppError />,
				meta: {
					noLogin: true
				},
				children: [
					{
						path: '/demo',
						childIndexRoute: true,
						meta: {
							title: 'Demo',
							menuShow: true,
							noLogin: false,
							icon: <IconFont type="icon-bianjibiaoge" style={{ fontSize: '18px' }} />,
						},
						children: [
							{
								homeRoute: true,
								childIndexRoute: true,
								path: '/demo/base',
								element: <Base />,
								meta: {
									title: 'base',
									menuShow: true,
									noLogin: false,
								},
							},
							{
								path: '/demo/svg',
								element: <SvgDemo />,
								meta: {
									title: 'Svg',
									menuShow: true,
									noLogin: false,
								},
							},
							{
								path: '/demo/teamPlugin',
								element: <TeamMarkPlugin />,
								meta: {
									title: 'teamPlugin',
									menuShow: true,
									noLogin: false,
								},
							},
						],
					},
				],
			},
		],
		meta: {
			noLogin: true
		}
	},
]

function generateRouteMap(routes: IRoute[], map = new Map<string, IRoute>()) {
	routes.forEach(route => {
		map.set(route.path || route.meta?.title || '', route)
		generateRouteMap(route.children || [], map)
	})
	return map
}
export const routeMap = generateRouteMap(routes)

export function findRouteByPathOrMetaTitle(pathOrMetaTitle: string) {
	return routeMap.get(pathOrMetaTitle)
}

function getIndexPath(routes: IRoute[], pathTrack: string[]) {
	let result: string[] = []
	for (const route of routes) {
		if (route.homeRoute) {
			pathTrack.push(route.path || '')
			return pathTrack.slice()
		}
		pathTrack.push(route.path || '')
		result = getIndexPath(route.children || [], pathTrack)
		pathTrack.pop()

		if (result?.length) {
			return result
		}
	}
	return result
}

export function isLoginRoute() {
	return window.location.pathname.startsWith('/login')
}

export const INDEX_PATH = getIndexPath(routes, []).reduce((pre, current) => {
	return resolvePath(current, pre).pathname
})

function getLayoutRoute(routes: IRoute[] = [], result: IRoute | null = null) {
	for (const route of routes) {
		if (route.layoutRoute) return route
		result = getLayoutRoute(route.children, result)
	}
	return result
}
export const LAYOUT_ROUTE = getLayoutRoute(routes)

const router = createBrowserRouter(routes)

export default router
