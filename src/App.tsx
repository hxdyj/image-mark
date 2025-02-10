import './App.scss'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { getRouteIndexPath, INDEX_PATH } from './router/router'
import { setTitle } from './utils/dom'
import { useEffect } from 'react'
import nProgress from 'nprogress'
import { useRoute } from './hooks/useRoute'
nProgress.configure({
	showSpinner: false,
})
let key: null | string = null
export default function App() {


	const navigate = useNavigate()
	const location = useLocation()
	const { route } = useRoute()


	if (route?.meta?.title) {
		setTitle(route.meta.title)
	}
	if (key !== location.key) {
		key = location.key
		nProgress.start()
	}

	useEffect(() => {
		if (!route.element && route.children?.length) {
			const childIndexPath = getRouteIndexPath(route)
			navigate(childIndexPath, {
				replace: true,
			})
		}

		if (location.pathname === '/') {
			navigate(INDEX_PATH, {
				replace: true,
			})
		}
		nProgress.done()
	}, [location])

	return <Outlet />

}
