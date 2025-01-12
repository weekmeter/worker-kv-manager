import { gracely } from "gracely"
import { http } from "cloudly-http"
import { storage } from "cloudly-storage"
import { Context } from "../Context"
import { router } from "../router"

export async function list(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	let result: storage.Continuable<storage.KeyValueStore.ListItem<any, any>> | gracely.Error
	const options = storage.KeyValueStore.ListOptions.request(request)
	if (!((await context.authenticate(request)) == "admin"))
		result = gracely.client.unauthorized()
	else if (gracely.Error.is(context.kv))
		result = context.kv
	else
		result = await context.kv.list({ values: false, limit: 10, ...options })
	return result
}
router.add("GET", "/kv", list)

// type Options = Partial<Record<keyof storage.KeyValueStore.ListOptions, string>>
// namespace Options {
// 	export const type = isly.object<Options>({
// 		prefix: isly.string().optional(),
// 		limit: isly.string().optional(),
// 		cursor: isly.string().optional(),
// 		range: isly.string().optional(),
// 		values: isly.string().optional(),
// 	})
// 	export const is = type.is
// 	export const flaw = type.flaw
// 	export function parse(options: Options): storage.KeyValueStore.ListOptions
// 	export function parse(options: Options | any): storage.KeyValueStore.ListOptions | undefined
// 	export function parse(options: Options | any): storage.KeyValueStore.ListOptions | undefined {
// 		return {
// 			prefix: options.prefix,
// 			limit: options.limit ? Number.parseInt(options.limit) : undefined,
// 			cursor: options.cursor,
// 			range: options.range ? (options.range.split(",", 2) as [string, string]) : [undefined, undefined],
// 			values: options.values == "true",
// 		}
// 	}
// }
