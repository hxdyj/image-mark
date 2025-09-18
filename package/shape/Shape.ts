import { G, Rect, Shape, StrokeData, Svg, Text } from "@svgdotjs/svg.js";
import { ImageMark } from "../index";
import { EventBindingThis } from '../event/event'
import { Action } from "../action/action";
import { uid } from "uid";
import { defaultsDeep } from "lodash-es";
import { LmbMoveAction } from "../action/LmbMoveAction";
import { EventBusEventName } from "../event/const";
import { getOptimalTextColor } from "../../src/utils/color.util";

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
	},
	image?: {
		opacity?: number
		preserveAspectRatio?: 'xMidYMid' | 'none'
	}
} | undefined

export type ShapeOptions = {
	setAttr?: (shapeInstance: ImageMarkShape) => ShapeAttr
	afterRender?: (shapeInstance: ImageMarkShape) => void
	initDrawFunc?: ShapeDrawFunc
}
//鼠标绘制类型，oneTouch:一笔绘制，multiPress:多次点击绘制
export type ShapeMouseDrawType = 'oneTouch' | 'multiPress'
//绘制类型，point:所有划过的点绘制，centerR:起点为中心点，起止点距离为半径r绘制，centerRxy:起点为中心点，起止点x1，x2差值为Rx,y1,y2差值为Ry绘制
export type ShapeDrawType = 'point' | 'centerR' | 'centerRxy'
export type ShapeDrawFunc = (shape: ImageMarkShape) => void

export abstract class ImageMarkShape<T extends ShapeData = ShapeData> extends EventBindingThis {
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
				// fill: 'red',
				size: 14
			}
		},
		image: {
			opacity: 0.8,
			preserveAspectRatio: 'xMidYMid'
		}
	}

	constructor(public data: T, imageMarkInstance: ImageMark, public options: ShapeOptions) {
		super()
		const constructor = this.constructor
		// @ts-ignore
		if (!constructor.shapeName) {
			throw new Error(`${constructor.name} must have a static property 'shapeName'`);
		}
		this.uid = uid(6)
		this.imageMark = imageMarkInstance;
		const group = new G()
		group.id(this.uid)
		group.addClass(`shape-${this.data.shapeName}`)
		this.shapeInstance = group
		this.attr = defaultsDeep(this.options.setAttr?.(this) || {}, this.attr)
		this.options.initDrawFunc && this.addDrawFunc(this.options.initDrawFunc)
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
		const mainStrokeColor = this.getMainShape().attr('stroke')
		text.font({
			fill: this.attr?.label?.font?.fill || getOptimalTextColor(mainStrokeColor),
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

		labelGroup.addTo(this.shapeInstance, 10000)
	}


	//当一个shape绘制完成时有 ShapePlugin 调用
	onEndDrawing() {

	}

	actionListForEach(callback: (action: Action) => void) {
		Object.values(this.action).forEach(action => callback(action))
	}

	onContainerMouseMove(event: MouseEvent) {
		this.actionListForEach(action => action.onContainerMouseMove(event))
	}

	onDocumentMouseMove(event: MouseEvent) {
		this.actionListForEach(action => action.onDocumentMouseMove(event))
	}
	onDocumentMouseUp(event: MouseEvent) {
		this.actionListForEach(action => action.onDocumentMouseUp(event))
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

	getEditGroup<T = G>() {
		return this.shapeInstance.find(`#${this.getEditGroupId()}`)[0] as T
	}

	getEditGroupId() {
		return `edit_${this.uid}`
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


	readonly mouseDrawType: ShapeMouseDrawType = 'oneTouch'
	readonly drawType: ShapeDrawType = 'point'

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

	protected editOn: boolean = false

	abstract drawEdit(): void

	removeEdit() {
		this.getEditGroup()?.remove()
	}

	edit(on?: boolean, needDraw = true): boolean {
		if (on === undefined) {
			return this.editOn
		}
		this.editOn = on
		needDraw && this.draw()
		return this.editOn
	}

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

