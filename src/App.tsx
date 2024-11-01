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
		if (location.pathname === '/') {
			navigate(INDEX_PATH, {
				replace: true,
			})
		}
		nProgress.done()
	}, [location])

	return <Outlet />

}
