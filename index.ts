import { Context } from "./Context"
import { router } from "./router"

import "./kv"
import "./version"

export default {
	async fetch(request: Request, environment: Context.Environment) {
		return await router.handle(request, new Context(environment))
	},
}
