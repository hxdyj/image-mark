import { G, Rect, Shape, StrokeData, Svg, Text } from "@svgdotjs/svg.js";
import { ImageMark } from "../index";
import { Action } from "../action/action";
import { uid } from "uid";
import { defaultsDeep } from "lodash-es";
import { LmbMoveAction } from "../action/LmbMoveAction";
import { EventBusEventName } from "../event/const";

export type AddToShape = Parameters<InstanceType<typeof Shape>['addTo']>[0]
export type MouseEvent2DataOptions = {
	eventList?: MouseEvent[]
	auxiliaryEvent?: MouseEvent
}


export type ShapeAttr = {
	stroke?: StrokeData
	fill?: string
	auxiliary?: {
		stroke?: StrokeData
	}
	label?: {
		font?: {
			fill?: string,
			size?: number
		},
		fill?: string
	}
	dot?: {
		r?: number
	}
} | undefined

export type ShapeOptions = {
	setAttr?: (shapeInstance: ImageMarkShape) => ShapeAttr
	afterRender?: (shapeInstance: ImageMarkShape) => void
	initDrawFunc?: ShapeDrawFunc
}
export type ShapeMouseDrawType = 'oneTouch' | 'multiPress'

export type ShapeDrawFunc = (shape: ImageMarkShape) => void

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

	attr: ShapeAttr = {
		stroke: {
			width: 10,
			color: '#FADC19'
		},
		auxiliary: {
			stroke: {
				dasharray: `20,20`
			}
		},
		label: {
			font: {
				fill: 'red',
				size: 14
			}
		}
	}

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
		this.attr = defaultsDeep(this.options.setAttr?.(this) || {}, this.attr)
		this.draw()
	}

	abstract draw(): G;

	protected drawFuncList: ShapeDrawFunc[] = []

	drawLabel() {
		if (!this.data.label) return
		const mainShape = this.getMainShape()
		const bbox = mainShape.bbox()
		const labelGroup = this.getLabelShape<G>() || new G()
		labelGroup.id(this.getLabelId())

		const text = labelGroup.find('text')[0] as Text || new Text()
		text.text(this.data.label)
		const scale = this.imageMark.getCurrentScale()
		text.font({
			fill: this.attr?.label?.font?.fill,
			size: (this.attr?.label?.font?.size ?? 14) / scale
		})

		const strokeWidth = mainShape.attr('stroke-width')
		const halfStrokeWidth = strokeWidth / 2

		text.move(halfStrokeWidth, 0)
		// 获取文本的边界框
		let textBbox = text.bbox();

		labelGroup.transform({
			translate: [bbox.x, bbox.y - textBbox.height - halfStrokeWidth + 0.5]
		}, false)

		// 创建一个矩形元素作为背景
		const bgBox = labelGroup.find('rect')[0] as Rect || new Rect()

		bgBox.size(textBbox.width + strokeWidth + 10, textBbox.height) // 矩形的宽度和高度比文本稍大一点
			.fill(this.attr?.label?.fill ?? this.attr?.stroke?.color ?? '#FADC19') // 设置背景颜色
			.move(-halfStrokeWidth, 0)
			.addTo(labelGroup) // 将矩形移动到文本的后面

		text.addTo(labelGroup)

		labelGroup.addTo(this.shapeInstance)
	}

	addDrawFunc(func: ShapeDrawFunc) {
		if (this.drawFuncList.indexOf(func) > -1) return
		this.drawFuncList.push(func)
	}

	removeDrawFunc(func: ShapeDrawFunc) {
		const index = this.drawFuncList.indexOf(func)
		if (index > -1) {
			this.drawFuncList.splice(index, 1)
		}
	}

	getMainShape<T = Shape>() {
		return this.shapeInstance.find(`#${this.getMainId()}`)[0] as T
	}

	getLabelShape<T = Shape>() {
		return this.shapeInstance.find(`#${this.getLabelId()}`)[0] as T
	}

	getLabelId() {
		return `label_${this.uid}`
	}

	getMainId() {
		return `main_${this.uid}`
	}

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

			let needCall = this.actionAfterRenderNeedAdd.pop()
			while (needCall) {
				needCall()
				needCall = this.actionAfterRenderNeedAdd.pop()
			}

			this.isBindActions = true
		}
	}


	afterRender() {
		this.bindActions()
		this.options?.afterRender?.(this)
		this.imageMark.eventBus.emit(EventBusEventName.shape_after_render, this)
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

	private actionAfterRenderNeedAdd: Function[] = []

	addAction(action: typeof Action, actionOptions: any = {}) {
		if (!this.isRendered) {
			this.actionAfterRenderNeedAdd.push(() => this.initAction(action, actionOptions))
		} else {
			this.initAction(action, actionOptions)
		}
	}

	removeAction(action: typeof Action) {
		const actionInstance = this.action[action.actionName]
		if (actionInstance) {
			actionInstance.destroy()
		}
	}

	initAction(action: typeof Action, actionOptions: any = null) {
		const constructor = Object.getPrototypeOf(this).constructor as typeof ImageMarkShape<T>
		if (this.action[action.actionName]) {
			this.removeAction(action)
		}
		this.action[action.actionName] = new action(this.imageMark, this, defaultsDeep(actionOptions, action.actionOptions[constructor.shapeName], action.actionOptions['static']))
	}

	static actionList: Array<typeof Action> = []

	static useAction(action: typeof Action, actionOptions: any = {}) {
		if (ImageMarkShape.hasAction(action)) return ImageMarkShape
		action.actionOptions[this.shapeName || 'static'] = actionOptions
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

	abstract translate(x: number, y: number): void

	//TODO(songle): 开启编辑功能

	static useDefaultAction() {
		ImageMarkShape.useAction(LmbMoveAction)
	}

	static unuseDefaultAction() {
		ImageMarkShape.unuseAction(LmbMoveAction)
	}

}

ImageMarkShape.useDefaultAction()

export interface ShapeData {
	shapeName: string
	label?: string
	[x: string]: any
}

