import { gracely } from "gracely"
import { http } from "cloudly-http"
import { storage } from "cloudly-storage"
import { Environment as ContextEnvironment } from "./Environment"

export class Context {
	#kv?: storage.KeyValueStore<any, any> | gracely.Error
	get kv(): storage.KeyValueStore<any, any> | gracely.Error {
		return (
			this.#kv ??
			(this.#kv = this.environment.kvStore
				? storage.KeyValueStore.partition(
						storage.KeyValueStore.Json.create(this.environment.kvStore),
						this.environment.kvPrefix ?? ""
				  )
				: gracely.server.misconfigured("kvStore", "KeyValueNamespace missing."))
		)
	}
	constructor(public readonly environment: Context.Environment) {
		// if (!gracely.Error.is(this.kv)) {
		// 	this.kv.set("key/a", { name: "a" }, { meta: { index: 0 }, retention: { years: 1 } })
		// 	this.kv.set("key/b", { name: "b" }, { meta: { index: 1 }, retention: { years: 1 } })
		// 	this.kv.set("key/c", { name: "c" }, { meta: { index: 2 }, retention: { years: 1 } })
		// 	this.kv.set("key/d", { name: "d" }, { meta: { index: 3 }, retention: { years: 1 } })
		// 	this.kv.set("key/e", { name: "e" }, { meta: { index: 4 }, retention: { years: 1 } })
		// }
	}
	async authenticate(request: http.Request): Promise<"admin" | undefined> {
		return this.environment.adminSecret && request.header.authorization == `Basic ${this.environment.adminSecret}`
			? "admin"
			: undefined
	}
}
export namespace Context {
	export type Environment = ContextEnvironment
}
