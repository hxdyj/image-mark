import { createHashRouter, resolvePath } from 'react-router-dom'
import { Layout } from '../components/Layout/Layout'
import type { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom'
import App from '../App'
import { AppError } from '../views/Error/Error'
import { IconFont } from '../components/Iconfont'
import { Base } from '../views/Base'
import { TeamMarkPluginDemo } from '../views/TeamMarkPluginDemo'
import { TwoInstance } from '../views/TwoInstance'
import { SvgPointDemo } from '../views/test/SvgPointDemo'
import { SvgMaskDemo } from '../views/test/SvgMaskDemo'
import { FullDemo } from '../views/FullDemo'
import { SvgNestGroupTransform } from '../views/test/SvgNestGroupTransform'
import { SvgNestDemo } from '../views/test/SvgNestDemo'

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
				path: '/full',
				element: <FullDemo />,
				meta: {
					title: 'Full',
					menuShow: false,
					noLogin: false,
				},
			},
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
							icon: <IconFont type="icon-demo" style={{ fontSize: '18px' }} />,
						},
						children: [
							{
								childIndexRoute: true,
								homeRoute: true,
								path: '/demo/full',
								element: <FullDemo />,
								meta: {
									title: 'Full',
									menuShow: true,
									noLogin: false,
								},
							},
							{
								path: '/demo/base',
								element: <Base />,
								meta: {
									title: 'Base',
									menuShow: true,
									noLogin: false,
								},
							},
							{
								path: '/demo/two_instance',
								element: <TwoInstance />,
								meta: {
									title: 'TwoInstance',
									menuShow: true,
									noLogin: false,
								},
							},
							{
								path: '/demo/teamPlugin',
								element: <TeamMarkPluginDemo />,
								meta: {
									title: 'TeamPlugin',
									menuShow: true,
									noLogin: false,
								},
							},

						],
					},
					{
						path: '/test',
						childIndexRoute: true,
						meta: {
							title: 'Test',
							menuShow: true,
							noLogin: false,
							icon: <IconFont type="icon-test" style={{ fontSize: '22px' }} className=' relative left-[-2px]' />,
						},
						children: [
							{
								// childIndexRoute: true,
								path: '/test/point',
								element: <SvgPointDemo />,
								meta: {
									title: 'SvgPointDemo',
									menuShow: true,
									noLogin: false,
								},
							},
							{
								path: '/test/mask',
								element: <SvgMaskDemo />,
								meta: {
									title: 'SvgMaskDemo',
									menuShow: true,
									noLogin: false,
								},
							},
							{
								path: '/test/nestGroupTransform',
								element: <SvgNestGroupTransform />,
								meta: {
									title: 'SvgNestGroupTransform',
									menuShow: true,
									noLogin: false,
								},
							},
							{
								path: '/test/nestSvg',
								element: <SvgNestDemo />,
								meta: {
									title: 'SvgNestDemo',
									menuShow: true,
									noLogin: false,
								},
							},
						]
					}
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

function recursionGetRouteIndexPath(route: IRoute, pathTrack: string[]) {
	let result: string[] = []
	const list = route.children || []
	if (!list.length) return pathTrack.slice()
	let childIndexRoute = list.find(item => item.homeRoute || item.childIndexRoute)
	if (!childIndexRoute) childIndexRoute = list[0]

	if (childIndexRoute) {
		pathTrack.push(childIndexRoute.path || '')
		result = recursionGetRouteIndexPath(childIndexRoute, pathTrack)
		pathTrack.pop()
		if (result?.length) {
			return result
		}
	}
	return result
}

export function getRouteIndexPath(route: IRoute) {
	const pathArr = recursionGetRouteIndexPath(route, []) || []
	return pathArr.reduce((pre, current) => {
		return resolvePath(current, pre).pathname
	}, '/')
}

const router = createHashRouter(routes)

export default router
