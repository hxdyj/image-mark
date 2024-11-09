import { Shape } from "@svgdotjs/svg.js";
import { ImageMark } from "../index";
import { Action } from "../action";

type AddToShape = Parameters<InstanceType<typeof Shape>['addTo']>[0]

export abstract class ImageMarkShape<T extends ShapeData = ShapeData, S extends Shape = Shape> {
	shapeInstance: S;
	isRendered = false
	static shapeName: string
	imageMark: ImageMark;

	action: {
		[key: string]: Action
	} = {}

	constructor(public data: T, imageMarkInstance: ImageMark, shapeInstance: S) {
		const constructor = this.constructor
		// @ts-ignore
		if (!constructor.shapeName) {
			throw new Error(`${constructor.name} must have a static property 'shapeName'`);
		}
		this.imageMark = imageMarkInstance;

		this.shapeInstance = shapeInstance
		this.draw()
	}

	abstract draw(): S;

	afterRender() {

	}

	destroy() {
		this.shapeInstance.remove()
		Object.values(this.action).forEach(action => {
			action.destroy()
		})
	}

	render(stage: AddToShape): void {
		if (!this.isRendered) {
			this.shapeInstance.addTo(stage)
			//TODO(songle): 这里需要重新设计一下，没办法用到部分action
			ImageMarkShape.actionList.forEach(action => {
				this.initAction(action)
			})
			this.isRendered = true
			this.afterRender()
		}
	}

	addAction(action: typeof Action) {
		this.initAction(action)
	}

	removeAction(action: typeof Action) {
		const actionInstance = this.action[action.actionName]
		if (actionInstance) {
			actionInstance.beforeActionRemove()
			delete this.action[action.actionName]
		}
	}

	initAction(action: typeof Action) {
		if (!this.action[action.actionName]) {
			this.action[action.actionName] = new action(this.imageMark, this, Reflect.get(action, 'actionOptions'))
		}
	}

	static actionList: Array<typeof Action> = []

	static useAction(action: typeof Action, actionOptions: any = {}) {
		if (ImageMarkShape.hasAction(action)) return ImageMarkShape
		Reflect.set(action, 'actionOptions', actionOptions)
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

