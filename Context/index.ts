import { http } from "cloudly-http"
import { Environment as ContextEnvironment } from "./Environment"

export class Context {
	constructor(public readonly environment: Context.Environment) {}
	async authenticate(request: http.Request): Promise<"admin" | undefined> {
		return this.environment.adminSecret && request.header.authorization == `Basic ${this.environment.adminSecret}`
			? "admin"
			: undefined
	}
}
export namespace Context {
	export type Environment = ContextEnvironment
}
