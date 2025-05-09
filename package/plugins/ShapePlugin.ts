import { ImageMark } from "..";
import { Plugin } from "./plugin";
import { ImageMarkShape, ShapeData, ShapeOptions } from "../shape/Shape";
import { EventBusEventName } from "../event/const";
import { cloneDeep, last } from "lodash-es";
import { twoPointsDistance } from "../utils/cartesianCoordinateSystem";
import { ImageMarkRect } from "../shape/Rect";
import { ImageMarkCircle } from "../shape/Circle";
import { ImageMarkPathLine } from "../shape/PathLine";
import { ImageMarkLine } from "../shape/Line";
import { ImageMarkImage } from "../shape/Image";
import { ImageMarkPolyLine } from "../shape/PolyLine";
import { ImageMarkPolygon } from "../shape/Polygon";

export type ShapePluginOptions<T extends ShapeData = ShapeData> = {
	shapeList: T[]
	shapeOptions?: ShapeOptions
}

export class ShapePlugin<T extends ShapeData = ShapeData> extends Plugin {
	static pluginName = "shape";
	protected node2ShapeInstanceWeakMap = new WeakMap<T, ImageMarkShape>()
	protected shapeInstance2NodeWeakMap = new WeakMap<ImageMarkShape, T>()
	data: T[] = []
	disableActionList: Set<string> = new Set()

	constructor(imageMarkInstance: ImageMark) {
		super(imageMarkInstance);
		// @ts-ignore
		let pluginName = this.constructor['pluginName']
		const thisPlugin = imageMarkInstance.options.pluginOptions?.[pluginName] as ShapePluginOptions<T>

		this.data = thisPlugin?.shapeList || []

		ShapePlugin.shapeList.forEach(shape => {
			this.initShape(shape.shape, shape.shapeOptions || thisPlugin?.shapeOptions)
		})

		this.bindEventThis(
			[
				'onRerender',
				'onDraw',
				'onDelete',
				'onResize',
				'onDrawingMouseDown',
				'onDrawingDocumentMouseMove',
				'onDrawingDocumentMouseUp',
				'onDrawingMouseMove',
				'onFirstRender',
				'onScale',
			]
		)
		this.bindEvent()
	}

	disableAction(action: string | string[]) {
		if (typeof action === 'string') {
			this.disableActionList.add(action)
		} else {
			action.forEach(item => this.disableActionList.add(item))
		}
	}

	enableAction(action: string | string[]) {
		if (typeof action === 'string') {
			this.disableActionList.delete(action)
		} else {
			action.forEach(item => this.disableActionList.delete(item))
		}
	}

	protected addNode(node: T) {
		if (!this.node2ShapeInstanceWeakMap.has(node)) {
			let shape = null
			const shapeInfo = this.shape[node.shapeName]
			if (shapeInfo) {
				if (shapeInfo.ShapeClass.constructor === ImageMarkShape) {
					throw new Error(`Shape ${Reflect.get(shapeInfo.ShapeClass, 'shapeName')} must be a subclass of ImageMarkShape`)
				}
				// @ts-ignore
				shape = new shapeInfo.ShapeClass(node, this.imageMark, shapeInfo.shapeOptions)
				if (shape) {
					this.node2ShapeInstanceWeakMap.set(node, shape)
					this.shapeInstance2NodeWeakMap.set(shape, node)
				}
			}
		}
	}

	protected createShape() {
		this.data.forEach(node => {
			this.addNode(node)
		})
	}

	bindEvent() {
		super.bindEvent()
		this.imageMark.on(EventBusEventName.rerender, this.onRerender)
		this.imageMark.on(EventBusEventName.draw, this.onDraw)
		this.imageMark.on(EventBusEventName.shape_delete, this.onDelete)
		this.imageMark.on(EventBusEventName.resize, this.onResize)
		this.imageMark.on(EventBusEventName.first_render, this.onFirstRender)
		this.imageMark.on(EventBusEventName.scale, this.onScale)
		this.imageMark.container.addEventListener('mousedown', this.onDrawingMouseDown)
		this.imageMark.container.addEventListener('mousemove', this.onDrawingMouseMove)
		document.addEventListener('mousemove', this.onDrawingDocumentMouseMove)
		document.addEventListener('mouseup', this.onDrawingDocumentMouseUp)
	}

	unbindEvent() {
		super.unbindEvent()
		this.imageMark.off(EventBusEventName.rerender, this.onRerender)
		this.imageMark.off(EventBusEventName.draw, this.onDraw)
		this.imageMark.off(EventBusEventName.shape_delete, this.onDelete)
		this.imageMark.off(EventBusEventName.resize, this.onResize)
		this.imageMark.off(EventBusEventName.first_render, this.onFirstRender)
		this.imageMark.off(EventBusEventName.scale, this.onScale)

		this.imageMark.container.removeEventListener('mousedown', this.onDrawingMouseDown)
		this.imageMark.container.removeEventListener('mousemove', this.onDrawingMouseMove)
		document.removeEventListener('mousemove', this.onDrawingDocumentMouseMove)
		document.removeEventListener('mouseup', this.onDrawingDocumentMouseUp)
	}

	destroy(): void {
		this.clear()
		this.disableActionList.clear()
		this.clearMap()
		this.unbindEvent()
		super.destroy()
	}

	onAdd(data: T, emit = true) {
		this.data.push(data)
		this.addNode(data)
		this.renderNode(data)
		if (emit) {
			this.imageMark.eventBus.emit(EventBusEventName.shape_add, data, this.node2ShapeInstanceWeakMap.get(data))
		}
	}

	onDelete(_data: T, shapeInstance: ImageMarkShape) {
		const data = this.shapeInstance2NodeWeakMap?.get(shapeInstance) || _data
		if (data) {
			const index = this.data?.findIndex(item => item === data)
			if (index == -1 || index == undefined) return
			this.data.splice(index, 1)
			this.node2ShapeInstanceWeakMap.delete(data)
			this.shapeInstance2NodeWeakMap.delete(shapeInstance)
		}
	}

	clear() {
		const oldData = this.data.slice()
		while (oldData?.length) {
			let item = oldData[0]
			let nodeInstance = this.node2ShapeInstanceWeakMap.get(item)
			nodeInstance?.destroy()
			this.onDelete(item, nodeInstance!)
		}
		this.data = []
		this.imageMark.eventBus.emit(EventBusEventName.shape_delete_all)
	}

	onScale() {
		this.redrawNodes()
	}

	onFirstRender() {
		this.redrawNodes()
	}

	onInit() {
		super.onInit()
		this.createShape()
	}

	clearMap() {
		this.node2ShapeInstanceWeakMap = new WeakMap<T, ImageMarkShape>()
		this.shapeInstance2NodeWeakMap = new WeakMap<ImageMarkShape, T>()
	}

	protected onRerender() {
		this.clearMap()
		this.createShape()
		this.onDraw()
	}

	redrawNodes() {
		this.data.forEach(node => {
			const shape = this.node2ShapeInstanceWeakMap.get(node)
			if (shape) {
				shape.draw()
			}
		})
	}

	protected onResize() {

	}

	protected renderNode(node: T) {
		const shape = this.node2ShapeInstanceWeakMap.get(node)
		if (shape) {
			shape.render(this.imageMark.stageGroup)
		}
	}

	protected onDraw() {
		(this.data || []).forEach(node => {
			this.renderNode(node)
		})
	}

	getInstanceByData(data: T) {
		return this.node2ShapeInstanceWeakMap.get(data)
	}

	shape: {
		[key: string]: {
			ShapeClass: ImageMarkShape,
			shapeOptions?: ShapeOptions
		}
	} = {}

	addShape(shape: typeof ImageMarkShape<T>, shapeOptions?: ShapeOptions) {
		this.initShape(shape, shapeOptions)
		return this
	}

	removeShape(shape: typeof ImageMarkShape<T>) {
		Reflect.deleteProperty(this.shape, shape.shapeName)
		return this
	}

	initShape<T extends ShapeData>(shape: typeof ImageMarkShape<T>, shapeOptions?: ShapeOptions) {
		if (!shape.shapeName) throw new Error(`${shape.name} shapeName is required`)
		this.shape[shape.shapeName] = {
			ShapeClass: shape as unknown as ImageMarkShape<T>,
			shapeOptions
		}
		return this
	}


	drawingShape: ImageMarkShape<T> | null = null


	programmaticDrawing = false

	startDrawing(shape: ImageMarkShape<T>, programmaticDrawing = false) {
		// const isClass = !(shape instanceof ImageMarkShape)
		// const shapeName = isClass ? shape.shapeName : Object.getPrototypeOf(shape).constructor.shapeName
		const shapeName = Object.getPrototypeOf(shape).constructor.shapeName
		this.imageMark.status.drawing = shapeName
		this.drawingShape = shape
		this.programmaticDrawing = programmaticDrawing
		this.drawingMouseTrace = []
		return this
	}



	drawing(shapeData: T) {
		if (!this.drawingShape) throw new Error('drawingShape is null')
		if (!this.drawingShape.isRendered) {
			this.drawingShape.render(this.imageMark.stageGroup)
		}
		this.drawingShape.updateData(shapeData)
		return this
	}

	endDrawing(cancel = false) {
		if (!this.drawingShape) throw new Error('drawingShape is null')
		const shapeData = cloneDeep(this.drawingShape.data)
		this.drawingShape.destroy()
		if (!cancel) {
			this.onAdd(shapeData, true)
		}
		this.drawingShape = null
		this.imageMark.status.drawing = false
		this.programmaticDrawing = false
		this.drawingMouseTrace = []
		return this
	}

	drawingMouseTrace: Array<MouseEvent> = []

	dropLastMouseTrace() {
		if (!this.imageMark.status.drawing) return
		if (this.programmaticDrawing) return
		if (this.drawingShape?.mouseDrawType !== 'multiPress') return

		if (this.drawingMouseTrace.length == 1) {
			this.endDrawing(true)
			return
		}

		this.drawingMouseTrace.pop()
		const newData = this.drawingShape.mouseEvent2Data({
			eventList: this.drawingMouseTrace,
			auxiliaryEvent: this.drawingShape.data.auxiliaryEvent
		})
		newData && this.drawing(newData)
	}

	onDrawingMouseDown(event: MouseEvent) {
		if (!this.imageMark.status.drawing) return
		if (this.programmaticDrawing) return

		if (this.drawingShape?.mouseDrawType == 'oneTouch') {
			this.drawingMouseTrace.push(event)
		}

		if (this.drawingShape?.mouseDrawType == 'multiPress') {
			this.drawingMouseTrace.push(event)
			const newData = this.drawingShape.mouseEvent2Data({
				eventList: this.drawingMouseTrace
			})
			newData && this.drawing(newData)
		}
	}

	onDrawingMouseMove(event: MouseEvent) {
		if (!this.imageMark?.status.drawing || !this.drawingShape) return
		if (this.programmaticDrawing) return

		if (this.drawingShape?.mouseDrawType == 'multiPress') {
			const newData = this.drawingShape.mouseEvent2Data({
				eventList: this.drawingMouseTrace,
				auxiliaryEvent: event
			})
			newData && this.drawing(newData)
		}
	}


	onDrawingDocumentMouseMove(event: MouseEvent) {
		if (!this.imageMark?.status.drawing || !this.drawingShape) return
		if (this.programmaticDrawing) return

		if (event.buttons === 0) {
			return
		}

		if (this.drawingShape?.mouseDrawType == 'oneTouch') {
			const threshold = this.drawingShape.getMouseMoveThreshold()
			if (threshold) {
				const lastEvent = last(this.drawingMouseTrace) as MouseEvent
				const distance = twoPointsDistance([lastEvent.pageX, lastEvent.pageY], [event.pageX, event.pageY])
				console.log(distance)
				if (distance < threshold) return
			}
			this.drawingMouseTrace.push(event)
			const newData = this.drawingShape.mouseEvent2Data({
				eventList: this.drawingMouseTrace
			})
			newData && this.drawing(newData)
		}
	}

	onDrawingDocumentMouseUp(event: MouseEvent) {
		if (!this.imageMark?.status.drawing || !this.drawingShape) return
		if (this.programmaticDrawing) return

		if (this.drawingShape?.mouseDrawType == 'oneTouch') {
			this.drawingMouseTrace.push(event)
			const newData = this.drawingShape.mouseEvent2Data({
				eventList: this.drawingMouseTrace
			})
			newData && this.drawing(newData)

			this.endDrawing()
		}
	}

	static shapeList: Array<{
		shape: typeof ImageMarkShape,
		shapeOptions?: ShapeOptions
	}> = []
	static useShape<T extends ShapeData>(shape: typeof ImageMarkShape<T>, shapeOptions?: ShapeOptions) {
		if (ShapePlugin.hasShape(shape)) return ShapePlugin<T>
		ShapePlugin.shapeList.push({
			shape: shape as typeof ImageMarkShape,
			shapeOptions
		})
		return ShapePlugin
	}
	static unuseShape<T extends ShapeData>(shape: typeof ImageMarkShape<T>) {
		const hasShape = ShapePlugin.hasShape(shape)
		if (hasShape) {
			//@ts-ignore
			ShapePlugin.shapeList.splice(ShapePlugin.shapeList.indexOf(shape), 1)
		}
		return ShapePlugin
	}
	static hasShape<T extends ShapeData>(shape: typeof ImageMarkShape<T>) {
		return ShapePlugin.shapeList.find(item => item.shape === shape)
	}

	static useDefaultShape() {
		ShapePlugin.useShape(ImageMarkRect)
		ShapePlugin.useShape(ImageMarkCircle)
		ShapePlugin.useShape(ImageMarkPathLine)
		ShapePlugin.useShape(ImageMarkLine)
		ShapePlugin.useShape(ImageMarkImage)
		ShapePlugin.useShape(ImageMarkPolyLine)
		ShapePlugin.useShape(ImageMarkPolygon)
	}

	static unuseDefaultShape() {
		ShapePlugin.unuseShape(ImageMarkRect)
		ShapePlugin.unuseShape(ImageMarkCircle)
		ShapePlugin.unuseShape(ImageMarkPathLine)
		ShapePlugin.unuseShape(ImageMarkLine)
		ShapePlugin.unuseShape(ImageMarkImage)
		ShapePlugin.unuseShape(ImageMarkPolyLine)
		ShapePlugin.unuseShape(ImageMarkPolygon)
	}
}


ShapePlugin.useDefaultShape()
