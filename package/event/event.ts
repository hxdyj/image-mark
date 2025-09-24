export class EventBindingThis {
	protected bindEventThis(functionNameList: string[]) {
		functionNameList.forEach(functionName => {
			// @ts-ignore
			if (typeof this[functionName] === 'function') {
				// @ts-ignore
				const caller = this[functionName].bind(this)
				function eventCaller(...args: any) {
					caller(...args)
				}
				// @ts-ignore
				this[functionName] = eventCaller
			}
		})
		return this
	}
}
