import { G, Shape, Svg } from "@svgdotjs/svg.js";
import { ImageMark } from "../index";
import { Action } from "../action";
import { uid } from "uid";
import { DeepPartial } from "@arco-design/web-react/es/Form/store";
import { defaultsDeep } from "lodash-es";

export type AddToShape = Parameters<InstanceType<typeof Shape>['addTo']>[0]
export type MouseEvent2DataOptions = {
	eventList?: MouseEvent[]
	auxiliaryEvent?: MouseEvent
}
export type ShapeOptions = {
	afterRender?: (shapeInstance: ImageMarkShape) => void
}
export type ShapeMouseDrawType = 'oneTouch' | 'multiPress'

export type ShapeTransform = {
	matrix: {
		a: number,
		b: number,
		c: number,
		d: number,
		e: number,
		f: number,
	},
	// origin: [number, number]
}

export function getDefaultTransform(option?: DeepPartial<ShapeTransform>): ShapeTransform {
	return defaultsDeep(option, {
		matrix: {
			a: 1,
			b: 0,
			c: 0,
			d: 1,
			e: 0,
			f: 0,
		},
		// origin: [0, 0]
	})
}

export abstract class ImageMarkShape<T extends ShapeData = ShapeData> {
	shapeInstance: G;
	isRendered = false
	isBindActions = false
	static shapeName: string
	imageMark: ImageMark;
	uid: string
	action: {
		[key: string]: Action
	} = {}

	constructor(public data: T, imageMarkInstance: ImageMark, public options: ShapeOptions) {
		const constructor = this.constructor
		// @ts-ignore
		if (!constructor.shapeName) {
			throw new Error(`${constructor.name} must have a static property 'shapeName'`);
		}
		this.uid = uid(6)
		this.imageMark = imageMarkInstance;
		const group = new G()
		group.id(this.uid)
		this.shapeInstance = group
		this.draw()
	}

	abstract draw(): G;

	updateData(data: T): G {
		this.data = data
		this.draw()
		return this.shapeInstance
	}


	//鼠标绘制类型，oneTouch:一笔绘制，multiPress:多次点击绘制，paint:作画模式绘制，相当于多笔绘制
	readonly mouseDrawType: ShapeMouseDrawType = 'oneTouch'

	private mouseMoveThreshold = 0

	getMouseMoveThreshold() {
		return this.mouseMoveThreshold
	}

	setMouseMoveThreshold(threshold: number) {
		if (threshold < 0) {
			console.warn('setMouseMoveThreshold should be a positive number')
			return
		}
		this.mouseMoveThreshold = threshold
	}

	//通过鼠标事件怎么画出Shape
	mouseEvent2Data(options: MouseEvent2DataOptions = {
		eventList: [],
	}): T | null {
		return null;
	}

	bindActions() {
		if (!this.isBindActions) {
			const constructor = Object.getPrototypeOf(this).constructor as typeof ImageMarkShape<T>
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
			const constructor = Object.getPrototypeOf(this).constructor as typeof ImageMarkShape<T>
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


	rotate(angle: number) {
		// 1. 获取当前的变换信息
		const currentTransform = this.shapeInstance.transform();
		const currentTranslate = {
			x: currentTransform.translateX || 0,
			y: currentTransform.translateY || 0
		};

		// 2. 获取innerGroup的边界盒，计算中心点
		const bbox = this.shapeInstance.bbox();
		const center = {
			x: bbox.x + bbox.width / 2,
			y: bbox.y + bbox.height / 2
		};

		this.shapeInstance.transform({
			rotate: angle,
			origin: [center.x, center.y] // 补偿平移带来的影响
		}, true);

		return this;
	}

}

export interface ShapeData {
	shapeName: string
	transform?: ShapeTransform
	[x: string]: any
}

