import { gracely } from "gracely"
import { http } from "cloudly-http"
import { storage } from "cloudly-storage"
import { Context } from "../Context"
import { router } from "../router"

export async function list(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	let result: storage.Continuable<storage.KeyValueStore.ListItem<any, any>> | gracely.Error
	if (!((await context.authenticate(request)) == "admin"))
		result = gracely.client.unauthorized()
	else if (gracely.Error.is(context.kv))
		result = context.kv
	else
		result = await context.kv.list({ values: false })
	return result
}
router.add("GET", "/kv", list)
