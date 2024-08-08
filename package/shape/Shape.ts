import { Shape } from "@svgdotjs/svg.js";
import { ImageMark } from "../index";
import { Action } from "../action";
export abstract class ImageMarkShape<T extends ShapeData = ShapeData> {
	abstract shapeInstance: Shape;
	private isRendered = false
	static shapeName: string
	imageMark: ImageMark;
	action: {
		[key: string]: Action
	} = {}

	constructor(public data: T, imageMarkInstance: ImageMark) {
		const constructor = this.constructor
		// @ts-ignore
		if (!constructor.shapeName) {
			throw new Error(`${constructor.name} must have a static property 'shapeName'`);
		}
		this.imageMark = imageMarkInstance;
	}
	abstract draw(): Shape;
	render(stage: Parameters<InstanceType<typeof Shape>['addTo']>[0]): void {
		if (!this.isRendered) {
			ImageMarkShape.actionList.forEach(action => {
				this.initAction(action)
			})
			this.shapeInstance.addTo(stage)
			this.isRendered = true
		}
	}

	static actionList: Array<typeof Action> = []

	static useAction(action: typeof Action, actionOptions: any = {}) {
		if (ImageMarkShape.hasAction(action)) return ImageMarkShape
		Reflect.set(action, 'actionOptions', actionOptions)
		ImageMarkShape.actionList.push(action)
		return ImageMarkShape
	}

	static hasAction(action: typeof Action) {
		return ImageMarkShape.actionList.includes(action)
	}

	initAction(action: typeof Action) {
		this.action[action.actionName] = new action(this.imageMark, this, Reflect.get(action, 'actionOptions'))
	}
}

export interface ShapeData {
	shapeName: string
	[x: string]: any
}

