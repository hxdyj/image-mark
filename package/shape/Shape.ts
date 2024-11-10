import { Shape } from "@svgdotjs/svg.js";
import { ImageMark } from "../index";
import { Action } from "../action";
import { uid } from "uid";

export type AddToShape = Parameters<InstanceType<typeof Shape>['addTo']>[0]

export type ShapeOptions = {
	afterRender?: (shapeInstance: ImageMarkShape) => void
}

export abstract class ImageMarkShape<T extends ShapeData = ShapeData, S extends Shape = Shape> {
	shapeInstance: S;
	isRendered = false
	isBindActions = false
	static shapeName: string
	imageMark: ImageMark;
	uid: string
	action: {
		[key: string]: Action
	} = {}

	constructor(public data: T, imageMarkInstance: ImageMark, public options: ShapeOptions, shapeInstance: S) {
		const constructor = this.constructor
		// @ts-ignore
		if (!constructor.shapeName) {
			throw new Error(`${constructor.name} must have a static property 'shapeName'`);
		}
		this.uid = uid(6)
		this.imageMark = imageMarkInstance;
		this.shapeInstance = shapeInstance
		this.draw()
	}

	abstract draw(): S;


	bindActions() {
		if (!this.isBindActions) {
			const constructor = Object.getPrototypeOf(this).constructor as typeof ImageMarkShape<T, S>
			constructor.actionList.forEach(action => {
				this.initAction(action, action.actionOptions[constructor.shapeName])
			})
			this.isBindActions = true
		}
	}

	afterRender() {
		this.bindActions()
		this.options?.afterRender?.(this)
	}

	destroy() {
		this.shapeInstance.remove()
		this.isRendered = false
		Object.values(this.action).forEach(action => {
			action.destroy()
		})
		this.isBindActions = false
	}

	render(stage: AddToShape): void {
		if (!this.isRendered) {
			this.shapeInstance.addTo(stage)

			this.isRendered = true
			this.afterRender()
		}
	}

	addAction(action: typeof Action, actionOptions: any = {}) {
		if (!this.isRendered) return
		this.initAction(action, actionOptions)
	}

	removeAction(action: typeof Action) {
		const actionInstance = this.action[action.actionName]
		if (actionInstance) {
			actionInstance.beforeActionRemove()
			delete this.action[action.actionName]
		}
	}

	initAction(action: typeof Action, actionOptions: any = {}) {
		if (!this.action[action.actionName]) {
			const constructor = Object.getPrototypeOf(this).constructor as typeof ImageMarkShape<T, S>
			this.action[action.actionName] = new action(this.imageMark, this, actionOptions || action.actionOptions[constructor.shapeName])
		}
	}

	static actionList: Array<typeof Action> = []

	static useAction(action: typeof Action, actionOptions: any = {}) {
		if (ImageMarkShape.hasAction(action)) return ImageMarkShape
		action.actionOptions[this.shapeName] = actionOptions
		ImageMarkShape.actionList.push(action)
		return ImageMarkShape
	}
	static unuseAction(action: typeof Action) {
		const hasAction = ImageMarkShape.hasAction(action)
		if (hasAction) {
			ImageMarkShape.actionList.splice(ImageMarkShape.actionList.indexOf(action), 1)
		}
		return ImageMarkShape
	}
	static hasAction(action: typeof Action) {
		return ImageMarkShape.actionList.includes(action)
	}
}

export interface ShapeData {
	shapeName: string
	[x: string]: any
}

