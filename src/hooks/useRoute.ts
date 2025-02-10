import { matchRoutes, useLocation } from "react-router-dom";
import router, { IRoute } from "../router/router";

export function useRoute() {
	const location = useLocation()
	const mathchs = matchRoutes(router.routes, location)
	const route = mathchs?.at(-1)?.route as IRoute
	return {
		route
	}
}
