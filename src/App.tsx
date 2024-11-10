import './App.scss'
import { Outlet, matchRoutes, useLocation, useNavigate } from 'react-router-dom'
import router, { INDEX_PATH, IRoute } from './router/router'
import { setTitle } from './utils/dom'
import { useEffect, useState } from 'react'
import nProgress from 'nprogress'
nProgress.configure({
	showSpinner: false,
})
let key: null | string = null
export default function App() {


	const navigate = useNavigate()
	const location = useLocation()
	const mathchs = matchRoutes(router.routes, location)
	const route = mathchs?.at(-1)?.route as IRoute

	if (route?.meta?.title) {
		setTitle(route.meta.title)
	}
	if (key !== location.key) {
		key = location.key
		nProgress.start()
	}

	useEffect(() => {
		//TODO(songle): /demo  如果这个路由存在，但是没有具体的页面，自动跳转到子页面的childIndex，如果没有childIndex，就child[0]
		if (location.pathname === '/') {
			navigate(INDEX_PATH, {
				replace: true,
			})
		}
		nProgress.done()
	}, [location])

	return <Outlet />

}
