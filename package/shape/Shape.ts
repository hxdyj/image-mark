import { G, Rect, Shape, StrokeData, Svg, Text } from "@svgdotjs/svg.js";
import { ImageMark, SelectionAction } from "../index";
import { EventBindingThis } from '../event/event'
import { Action } from "../action/action";
import { uid } from "uid";
import { cloneDeep, defaultsDeep } from "lodash-es";
import { LmbMoveAction } from "../action/LmbMoveAction";
import { EventBusEventName } from "../event/const";
import { getOptimalTextColor } from "../utils/color.util";
import { setObjectNewValue } from "#/utils/object";

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

export type EditPointItem<T extends string | number = string | number> = {
	x: number
	y: number
	className: T
}

export abstract class ImageMarkShape<T extends ShapeData = ShapeData> extends EventBindingThis {
	shapeInstance: G;
	isRendered = false
	isBindActions = false
	static shapeName: string
	imageMark: ImageMark;
	action: {
		[key: string]: Action
	} = {}

	attr: ShapeAttr = {
		stroke: {
			width: 10,
			// color: '#FADC19'
			color: '#FF7D00'
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
			opacity: 1,
			preserveAspectRatio: 'xMidYMid'
		}
	}

	constructor(public data: T, imageMarkInstance: ImageMark, public options?: ShapeOptions) {
		super()
		const constructor = this.constructor
		// @ts-ignore
		if (!constructor.shapeName) {
			throw new Error(`${constructor.name} must have a static property 'shapeName'`);
		}
		if (!this.data.uuid) this.data.uuid = uid(6)

		this.imageMark = imageMarkInstance;
		const group = new G()
		group.id(`G_${this.data.uuid}`)
		group.addClass(`shape-${this.data.shapeName}`)
		this.shapeInstance = group
		//@ts-ignore
		this.shapeInstance._imageMarkShape = this
		const finalOptions = this.getOptions()
		this.attr = defaultsDeep(finalOptions?.setAttr?.(this) || {}, this.attr)
		finalOptions?.initDrawFunc && this.addDrawFunc(finalOptions.initDrawFunc)

		this.bindEventThis([
			'startEditShape',
			'endEditShape',
			'onContextMenu',
			'onMouseDown',
			'onMouseUp'
		])
		this.bindEvent()
		this.draw()
	}

	getOptions(options?: ShapeOptions): ShapeOptions {
		return defaultsDeep(options, this.options, this.imageMark.getShapePlugin()?.getShapeOptions())
	}

	bindEvent() {
		this.shapeInstance.on('contextmenu', this.onContextMenu)
		this.shapeInstance.on('mousedown', this.onMouseDown)
		this.shapeInstance.on('mouseup', this.onMouseUp)
	}

	unbindEvent() {
		this.shapeInstance.off('contextmenu', this.onContextMenu)
		this.shapeInstance.off('mousedown', this.onMouseDown)
		this.shapeInstance.off('mouseup', this.onMouseUp)
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
		text.addClass('shape-label')
		const scale = this.imageMark.getCurrentScale()

		const { optimalStrokeColor } = this.getMainShapeInfo()
		const fontSize = (this.attr?.label?.font?.size ?? 14) / scale
		text.font({
			fill: this.attr?.label?.font?.fill || optimalStrokeColor,
			size: fontSize
		})
		const { strokeWidth } = this.getMainShapeInfo()
		const halfStrokeWidth = strokeWidth / 2

		text.move(halfStrokeWidth, 0)

		// 获取文本的边界框
		let textBbox = text.bbox();

		labelGroup.transform({
			translate: [bbox.x, bbox.y - textBbox.height - halfStrokeWidth + 0.5]
		}, false)

		// 创建一个矩形元素作为背景
		const bgBox = labelGroup.find('rect')[0] as Rect || new Rect()

		bgBox // 矩形的宽度和高度比文本稍大一点
			.fill(this.attr?.label?.fill ?? this.attr?.stroke?.color ?? '#FADC19') // 设置背景颜色
			.move(-halfStrokeWidth, 0)
			.addTo(labelGroup) // 将矩形移动到文本的后面

		text.addTo(labelGroup)
		labelGroup.addTo(this.shapeInstance, 10000)
		this.setLabelBgBox()
	}

	setLabelBgBox() {
		const labelGroup = this.getLabelShape<G>() || new G()
		const bgBox = labelGroup.find('rect')[0] as Rect || new Rect()
		const text = labelGroup.find('text')[0] as Text || new Text()
		let textBbox = text.bbox();
		const { strokeWidth } = this.getMainShapeInfo()
		bgBox.size(textBbox.width + strokeWidth * 2, textBbox.height)
	}


	//当一个shape绘制完成时有 ShapePlugin 调用，目前主要用于image在保持比例绘制完重新计算实际大小
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
		return `edit_${this.data.uuid}`
	}

	getLabelId() {
		return `label_${this.data.uuid}`
	}

	getMainId() {
		return `main_${this.data.uuid}`
	}

	updateData(data: T, emit = true): G {
		setObjectNewValue(this.data, data)
		this.draw()
		console.log('updateData', emit, cloneDeep(this.dataSnapshot));
		if (emit && this.dataSnapshot) {
			this.imageMark.eventBus.emit(EventBusEventName.shape_update_data, this.data, this.dataSnapshot, this, this.imageMark)
			this.imageMark.getShapePlugin()?.emitPluginDataChange()
			this.dataSnapshot = null
		}
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
		this.setLabelBgBox()
	}

	destroy() {
		this.unbindEvent()
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

	addAction<ActionType extends typeof Action = typeof Action>(action: ActionType, actionOptions: any = {}) {
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

	initAction<ActionType extends typeof Action = typeof Action>(action: ActionType, actionOptions: any = null) {
		const constructor = Object.getPrototypeOf(this).constructor as typeof ImageMarkShape<T>
		if (this.action[action.actionName]) {
			this.removeAction(action)
		}
		this.action[action.actionName] = new action(this.imageMark, this, defaultsDeep(actionOptions, action.actionOptions[constructor.shapeName], action.actionOptions['static']))
	}

	static actionList: Array<typeof Action> = []

	static useAction<ActionType extends typeof Action = typeof Action>(action: ActionType, actionOptions: any = {}) {
		action.actionOptions[this.shapeName || 'static'] = actionOptions
		if (!ImageMarkShape.hasAction(action)) {
			ImageMarkShape.actionList.push(action)
		}
		return ImageMarkShape
	}

	static unuseAction<ActionType extends typeof Action = typeof Action>(action: ActionType) {
		const hasAction = ImageMarkShape.hasAction(action)
		if (hasAction) {
			ImageMarkShape.actionList.splice(ImageMarkShape.actionList.indexOf(action), 1)
		}
		return ImageMarkShape
	}

	static hasAction<ActionType extends typeof Action = typeof Action>(action: ActionType) {
		return ImageMarkShape.actionList.includes(action)
	}

	abstract translate(x: number, y: number): void

	protected editOn: boolean = false

	abstract drawEdit(): void
	editMouseDownEvent: MouseEvent | null = null
	editOriginData: T | null = null

	startEditShape(event: Event) {
		event.stopPropagation()
		this.editMouseDownEvent = event as unknown as MouseEvent
		this.editOriginData = cloneDeep(this.data)
		this.imageMark.getShapePlugin()?.setHoldShape(this)
		this.startModifyData()
		this.imageMark.status.shape_editing = this
		this.imageMark.eventBus.emit(EventBusEventName.shape_start_edit, this, this.imageMark)
	}


	endEditShape() {
		if (!this.imageMark.status.shape_editing) return
		this.editMouseDownEvent = null
		this.editOriginData = null
		this.imageMark.getShapePlugin()?.setHoldShape(null)
		this.imageMark.status.shape_editing = null
		this.imageMark.eventBus.emit(EventBusEventName.shape_end_edit, this, this.imageMark)
	}

	dataSnapshot: T | null = null
	startModifyData() {
		this.dataSnapshot = cloneDeep(this.data)
	}

	removeEdit() {
		this.getEditGroup()?.remove()
	}

	edit(on?: boolean, needDraw = true): boolean {
		if (this.imageMark.options?.readonly) {
			on = false
			needDraw = true
		}
		if (on === undefined) {
			return this.editOn
		}
		this.editOn = on
		needDraw && this.draw()
		return this.editOn
	}

	onReadonlyChange(readonly: boolean) {
		if (readonly) {
			this.edit(false)
		}
		const action = Object.values(this.action || {}) as Action[]
		action.forEach(action => action?.onReadonlyChange?.(readonly))
	}

	getMainShapeInfo() {
		const strokeWidth = this.getMainShape().attr('stroke-width') || 6
		const strokeColor = this.getMainShape().node.getAttribute('stroke') || this.attr?.stroke?.color || 'transparent'
		const optimalStrokeColor = strokeColor === 'transparent' ? 'transparent' : getOptimalTextColor(strokeColor)
		return {
			strokeWidth,
			strokeColor,
			optimalStrokeColor,
		}
	}

	onContextMenu(event: Event) {
		this.imageMark.eventBus.emit(EventBusEventName.shape_context_menu, event, this, this.imageMark)
	}
	mouseDownEvent: MouseEvent | null = null
	onMouseDown(event: Event) {
		this.mouseDownEvent = event as unknown as MouseEvent
	}

	onMouseUp(event: Event) {
		if (!this.imageMark.status.shape_drawing && !this.imageMark.status.shape_editing && this.mouseDownEvent && this.mouseDownEvent.button === 0 && event.timeStamp - this.mouseDownEvent.timeStamp < 300) {
			this.imageMark.eventBus.emit(EventBusEventName.shape_click, event, this, this.imageMark)
		}
		this.mouseDownEvent = null
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
	uuid?: string  // 形状的唯一标识, 如果不传入会自动生成
	shapeName: string
	label?: string
	[x: string]: any
}

