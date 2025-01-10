export interface Environment extends Record<string, undefined | string | KVNamespace | DurableObjectNamespace> {
	adminSecret?: string
}
