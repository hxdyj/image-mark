export class EventBindingThis {
	protected bindEventThis(functionNameList: string[], args?: {
		[key: string]: any
	}) {
		functionNameList.forEach(functionName => {
			// @ts-ignore
			if (typeof this[functionName] === 'function') {
				// @ts-ignore
				const caller = this[functionName].bind(this)
				function eventCaller(event: Event) {
					if (event instanceof Event) {
						Reflect.set(event, '__args', args?.[functionName])
					}
					caller(event)
				}
				// @ts-ignore
				this[functionName] = eventCaller
			}
		})
		return this
	}
}
