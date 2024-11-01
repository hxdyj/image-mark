export type EventCallback = (ev: Event) => void

export class SimpleEvent<T = unknown> {
	private ele: HTMLElement = document.body
	private alreadyListen = false
	constructor(readonly eventName: string, private callback?: EventCallback, el?: HTMLElement) {
		this.ele = el || this.ele
	}

	dispatchEvent(data: T) {
		const event = new CustomEvent(this.eventName, { detail: data })
		this.ele.dispatchEvent(event)
	}

	setCallback(callback: EventCallback) {
		if (this.alreadyListen) {
			this.removeEventListener()
		}

		this.callback = callback

		if (this.alreadyListen) {
			this.addEventListener()
		}
	}

	addEventListener() {
		if (!this.callback) {
			throw Error('callback must be set.')
		}
		this.ele.addEventListener(this.eventName, this.callback)
		this.alreadyListen = true
	}

	removeEventListener() {
		if (!this.callback) {
			throw Error('callback must be set.')
		}
		this.ele.removeEventListener(this.eventName, this.callback)
		this.alreadyListen = false
	}
}




export enum MindNodeEventName {
	operate = 'custom_event_node_operate'
}

export class MindNodeSimpleEvent<T = unknown> extends SimpleEvent<T> {
	constructor(node: NodeInstance, eventName: MindNodeEventName, callback?: EventCallback, el?: HTMLElement) {
		super(eventName + "_" + node.uid, callback, el)
	}
}

