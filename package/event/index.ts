export class EventBindingThis {
	protected bindEventThis(functionNameList: string[]) {
		functionNameList.forEach(functionName => {
			// @ts-ignore
			if (typeof this[functionName] === 'function') {
				// @ts-ignore
				this[functionName] = this[functionName].bind(this)
			}
		})
		return this
	}
}
