import { Action, ImageMark } from "../index";
import { Plugin } from "./plugin";
import { ImageMarkShape, ShapeData, ShapeOptions } from "../shape/Shape";
import { EventBusEventName } from "../event/const";
import { clamp, cloneDeep, defaultsDeep, last } from "lodash-es";
import { twoPointsDistance, unitVector } from "../utils/cartesianCoordinateSystem";
import { ImageMarkRect } from "../shape/Rect";
import { ImageMarkCircle } from "../shape/Circle";
import { ImageMarkPathLine } from "../shape/PathLine";
import { ImageMarkLine } from "../shape/Line";
import { ImageMarkImage } from "../shape/Image";
import { ImageMarkPolyLine } from "../shape/PolyLine";
import { ImageMarkPolygon } from "../shape/Polygon";
import { ImageMarkDot } from "../shape/Dot";
import { Point } from "@svgdotjs/svg.js";
import { DeepPartial } from "utility-types";

export type ShapePluginOptions<T extends ShapeData = ShapeData> = {
	shapeList: T[]
	shapeOptions?: ShapeOptions
}

export class ShapePlugin<T extends ShapeData = ShapeData> extends Plugin {
	static pluginName = "shape";
	protected node2ShapeInstanceWeakMap = new WeakMap<T, ImageMarkShape>()
	protected shapeInstance2NodeWeakMap = new WeakMap<ImageMarkShape, T>()
	data: T[]
	disableActionList: Set<string> = new Set()

	constructor(imageMarkInstance: ImageMark, public pluginOptions?: DeepPartial<ShapePluginOptions<T>>) {
		super(imageMarkInstance, pluginOptions);

		const finalOptions = this.getShapePluginOptions(pluginOptions)
		const that = this
		this.data = new Proxy((finalOptions?.shapeList || []).map(i => this.proxyDataItem(i)), {
			set(target, property, newValue, receiver) {
				const result = Reflect.set(target, property, newValue, receiver)
				that.imageMark.eventBus.emit(EventBusEventName.shape_data_change, that.data, that.imageMark)
				return result
			},
		})
		ShapePlugin.shapeList.forEach(shape => {
			this.initShape(shape.shape, finalOptions.shapeOptions)
		})

		this.bindEventThis(
			[
				'onRerender',
				'onDraw',
				'onDelete',
				'onResize',
				'onContainerMouseDown',
				'onDocumentMouseMove',
				'onDocumentMouseUp',
				'onContainerMouseMove',
				'onFirstRender',
				'onScale',
			]
		)
		this.bindEvent()
	}

	proxyDataItem(data: T) {
		let that = this
		return new Proxy(data, {
			set(target, property, newValue, receiver) {
				const result = Reflect.set(target, property, newValue, receiver)
				if (!['auxiliaryPoint'].includes(property.toString())) {
					that.imageMark.eventBus.emit(EventBusEventName.shape_data_change, that.data, that.imageMark)
				}
				return result
			},
		})
	}


	getShapePluginOptions(options?: DeepPartial<ShapePluginOptions<T>>) {
		return this.getOptions(options, thisPluginOptions => {
			delete thisPluginOptions.shapeList
			return thisPluginOptions
		}) as ShapePluginOptions<T>
	}

	addAction(action: typeof Action, actionOptions: any = {}) {
		this.data?.forEach(node => {
			const shape = this.getInstanceByData(node)
			if (shape) {
				shape.addAction(action, actionOptions)
			}
		})
	}

	removeAction(action: typeof Action) {
		this.data?.forEach(node => {
			const shape = this.getInstanceByData(node)
			if (shape) {
				shape.removeAction(action)
			}
		})
	}

	disableAction(action: string | string[]) {
		const actionNameList = typeof action === 'string' ? [action] : action
		actionNameList.forEach(item => this.disableActionList.add(item))
	}

	enableAction(action: string | string[]) {
		const actionNameList = typeof action === 'string' ? [action] : action
		actionNameList.forEach(item => this.disableActionList.delete(item))
	}

	protected renderNewNode(node: T) {
		if (!this.node2ShapeInstanceWeakMap.has(node)) {
			let shape = null
			const shapeInfo = this.shape[node.shapeName]
			if (shapeInfo) {
				if (shapeInfo.ShapeClass.constructor === ImageMarkShape) {
					throw new Error(`Shape ${Reflect.get(shapeInfo.ShapeClass, 'shapeName')} must be a subclass of ImageMarkShape`)
				}
				// @ts-ignore
				shape = new shapeInfo.ShapeClass(node, this.imageMark, this.getShapeOptions(shapeInfo.shapeOptions))
				if (shape) {
					this.node2ShapeInstanceWeakMap.set(node, shape)
					this.shapeInstance2NodeWeakMap.set(shape, node)
				}
			}
		}
	}

	protected createShape() {
		this.data.forEach(node => {
			this.renderNewNode(node)
		})
	}

	setData(data: T[]) {
		const oldData = this.data.slice()
		this.removeAllNodes(false)
		this.data = data.map(i => this.proxyDataItem(i))
		this.createShape()
		this.onDraw()
		this.imageMark.eventBus.emit(EventBusEventName.shape_plugin_set_data, data, oldData, this.imageMark)
		this.imageMark.eventBus.emit(EventBusEventName.shape_data_change, data, this.imageMark)
	}

	bindEvent() {
		super.bindEvent()
		this.imageMark.on(EventBusEventName.rerender, this.onRerender)
		this.imageMark.on(EventBusEventName.draw, this.onDraw)
		this.imageMark.on(EventBusEventName.shape_delete, this.onDelete)
		this.imageMark.on(EventBusEventName.resize, this.onResize)
		this.imageMark.on(EventBusEventName.first_render, this.onFirstRender)
		this.imageMark.on(EventBusEventName.scale, this.onScale)
		this.imageMark.container.addEventListener('mousedown', this.onContainerMouseDown)
		this.imageMark.container.addEventListener('mousemove', this.onContainerMouseMove)
		document.addEventListener('mousemove', this.onDocumentMouseMove)
		document.addEventListener('mouseup', this.onDocumentMouseUp)
	}

	unbindEvent() {
		super.unbindEvent()
		this.imageMark.off(EventBusEventName.rerender, this.onRerender)
		this.imageMark.off(EventBusEventName.draw, this.onDraw)
		this.imageMark.off(EventBusEventName.shape_delete, this.onDelete)
		this.imageMark.off(EventBusEventName.resize, this.onResize)
		this.imageMark.off(EventBusEventName.first_render, this.onFirstRender)
		this.imageMark.off(EventBusEventName.scale, this.onScale)

		this.imageMark.container.removeEventListener('mousedown', this.onContainerMouseDown)
		this.imageMark.container.removeEventListener('mousemove', this.onContainerMouseMove)
		document.removeEventListener('mousemove', this.onDocumentMouseMove)
		document.removeEventListener('mouseup', this.onDocumentMouseUp)
	}

	destroy(): void {
		this.clear()
		this.disableActionList.clear()
		this.clearMap()
		this.unbindEvent()
		super.destroy()
	}

	updateNode(data: T, callShape = true) {
		const index = this.data.findIndex(item => item.uuid === data.uuid)
		if (index !== -1) {
			this.data[index] = this.proxyDataItem(data)
		}
		const shapeInstance = this.getInstanceByData(data)

		if (shapeInstance) {
			this.node2ShapeInstanceWeakMap.set(this.data[index], shapeInstance)
			this.node2ShapeInstanceWeakMap.delete(data)
			this.shapeInstance2NodeWeakMap.set(shapeInstance, this.data[index])
		}

		if (callShape && shapeInstance) {
			shapeInstance.updateData(this.data[index], false)
		}
		return this.data[index]
	}

	addNode(data: T, emit = true) {
		if (data instanceof ImageMarkShape) {
			data = data.data
		}
		this.data.push(data)
		this.renderNewNode(data)
		this.renderNode(data)
		emit && this.imageMark.eventBus.emit(EventBusEventName.shape_add, data, this.getInstanceByData(data))
	}

	addNodes(dataList: T[], emit = true) {
		dataList.forEach(item => this.addNode(item, false))
		emit && this.imageMark.eventBus.emit(EventBusEventName.shape_add_patch, dataList, this.imageMark)
	}

	onDelete(_data: T, shapeInstance?: ImageMarkShape) {
		const data = shapeInstance ? this.shapeInstance2NodeWeakMap?.get(shapeInstance) || _data : _data
		const list = this.tempData || this.data
		if (data) {
			const index = list.findIndex(item => item.uuid === data.uuid)
			if (index == -1 || index == undefined) return
			const shapeInstance = this.getInstanceByData(data)
			list.splice(index, 1)
			this.node2ShapeInstanceWeakMap.delete(data)
			this.shapeInstance2NodeWeakMap.delete(shapeInstance!)
			shapeInstance?.destroy()
		}
	}

	removeNode(data: T | ImageMarkShape<T>, emit = true) {
		const instance = data instanceof ImageMarkShape ? data : this.getInstanceByData(data) as ImageMarkShape<T>
		if (!instance) return
		this.onDelete(instance.data)
		emit && this.imageMark.eventBus.emit(EventBusEventName.shape_delete, data instanceof ImageMarkShape ? data.data : data, instance, this.imageMark)
	}

	removeNodes(dataList: T[] | ImageMarkShape<T>[], emit = true) {
		dataList.forEach(item => this.removeNode(item instanceof ImageMarkShape ? item.data : item, false))
		emit && this.imageMark.eventBus.emit(EventBusEventName.shape_delete_patch, dataList.map(i => i instanceof ImageMarkShape ? i.data : i), this.imageMark)
	}

	protected tempData: T[] | null = null

	clear() {
		this.tempData = this.tempData || this.data.slice()
		while (this.tempData?.length) {
			let item = this.tempData[0]
			let nodeInstance = this.getInstanceByData(item)
			nodeInstance?.destroy()
			this.onDelete(item, nodeInstance!)
		}
		this.tempData = null
	}

	removeAllNodes(emit = true) {
		this.clear()
		this.clearMap()
		if (emit) {
			this.imageMark.eventBus.emit(EventBusEventName.shape_delete_all, this.data, this.imageMark)
		}
		this.data.splice(0, this.data.length)
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
			const shape = this.getInstanceByData(node)
			if (shape) {
				shape.draw()
			}
		})
	}

	protected onResize() {

	}

	protected renderNode(node: T) {
		const shape = this.getInstanceByData(node)
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
		let instance = this.node2ShapeInstanceWeakMap.get(data)
		if (!instance) {
			let sourceData = this.data.find(node => node.uuid == data.uuid)
			if (sourceData) {
				instance = this.node2ShapeInstanceWeakMap.get(sourceData)
			}
		}
		return instance
	}

	shape: {
		[key: string]: {
			ShapeClass: ImageMarkShape,
			shapeOptions?: ShapeOptions
		}
	} = {}

	getShapeOptions(shapeOptions?: ShapeOptions) {
		const finalOptions = this.getShapePluginOptions()
		return defaultsDeep(shapeOptions, finalOptions?.shapeOptions)
	}

	addShape(shape: typeof ImageMarkShape<T>, shapeOptions?: ShapeOptions) {
		this.initShape(shape, this.getShapeOptions(shapeOptions))
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
		// const shapeName = Object.getPrototypeOf(shape).constructor.shapeName
		this.imageMark.status.drawing = shape
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
		this.drawingShape.onEndDrawing()
		const shapeData = cloneDeep(this.drawingShape.data)
		this.drawingShape.destroy()
		if (!cancel) {
			this.addNode(shapeData)
		}
		this.drawingShape = null
		this.imageMark.status.drawing = null
		this.programmaticDrawing = false
		this.drawingMouseTrace = []
		this.imageMark.eventBus.emit(EventBusEventName.shape_end_drawing, cancel, shapeData, this.imageMark)
		return this
	}

	drawingMouseTrace: Array<MouseEvent> = []


	shiftMouseEvent2LimitMouseEvent(evt: Event | MouseEvent) {
		let limit = false
		let event = evt as MouseEvent
		const enableDrawShapeOutOfImg = this.imageMark.options.action?.enableDrawShapeOutOfImg
		if (!enableDrawShapeOutOfImg) {
			const point = this.imageMark.image.point(event.clientX, event.clientY)
			if (this.drawingShape?.drawType == 'point') {
				if (point.x < 0 || point.y < 0 || point.x > this.imageMark.imageDom.naturalWidth || point.y > this.imageMark.imageDom.naturalHeight) {
					const newPoint = this.imageMark.image.unpoint(clamp(point.x, 0, this.imageMark.imageDom.naturalWidth), clamp(point.y, 0, this.imageMark.imageDom.naturalHeight))
					const limitEvent = new MouseEvent(event.type, {
						clientX: newPoint.x,
						clientY: newPoint.y
					})
					limit = true
					event = limitEvent
				}
			} else if (this.drawingShape?.drawType == 'centerR') {
				if (this.drawingMouseTrace?.length > 1) {
					const startPoint = this.imageMark.image.point(this.drawingMouseTrace[0])
					const minR = Math.min(
						startPoint.x,
						this.imageMark.imageDom.naturalWidth - startPoint.x,
						startPoint.y,
						this.imageMark.imageDom.naturalHeight - startPoint.y,
					)
					const endPoint = point
					const distance = twoPointsDistance([startPoint.x, startPoint.y], [endPoint.x, endPoint.y])
					if (distance > minR) {
						const unit = unitVector(startPoint, endPoint)
						const rPoint = new Point(startPoint.x + unit.x * minR, startPoint.y + unit.y * minR)
						const fixEventPoint = this.imageMark.image.unpoint(rPoint.x, rPoint.y)
						const limitEvent = new MouseEvent(event.type, {
							clientX: fixEventPoint.x,
							clientY: fixEventPoint.y
						})
						limit = true
						event = limitEvent
					}
				}
			} else if (this.drawingShape?.drawType == 'centerRxy') {
				if (this.drawingMouseTrace?.length > 1) {
					const startPoint = this.imageMark.image.point(this.drawingMouseTrace[0])
					const minRx = Math.min(
						startPoint.x,
						this.imageMark.imageDom.naturalWidth - startPoint.x,

					)
					const minRy = Math.min(
						startPoint.y,
						this.imageMark.imageDom.naturalHeight - startPoint.y,
					)

					// console.log(111, startPoint, [minRx, minRy])

					const endPoint = point

					const distanceX = Math.abs(endPoint.x - startPoint.x)
					const distanceY = Math.abs(endPoint.y - startPoint.y)

					const rPoint = new Point(endPoint.x, endPoint.y)

					if (distanceX > minRx) {
						rPoint.x = startPoint.x + minRx
					}
					if (distanceY > minRy) {
						rPoint.y = startPoint.y + minRy
					}

					if (rPoint.x != endPoint.x || rPoint.y != endPoint.y) {
						const fixEventPoint = this.imageMark.image.unpoint(rPoint.x, rPoint.y)
						const limitEvent = new MouseEvent(event.type, {
							clientX: fixEventPoint.x,
							clientY: fixEventPoint.y
						})
						limit = true
						event = limitEvent
					}

					// if (distanceX > minRx || distanceY > minRy) {
					// 	const unitX = unitVector(startPoint, new Point({
					// 		x: endPoint.x,
					// 		y: startPoint.y
					// 	})).x
					// 	const unitY = unitVector(startPoint, new Point({
					// 		x: startPoint.x,
					// 		y: endPoint.y
					// 	})).y
					// 	const rPoint = new Point(startPoint.x + unitX * minRx, startPoint.y + unitY * minRy)
					// 	const fixEventPoint = this.imageMark.image.unpoint(rPoint.x, rPoint.y)
					// 	const limitEvent = new MouseEvent(event.type, {
					// 		clientX: fixEventPoint.x,
					// 		clientY: fixEventPoint.y
					// 	})
					// 	limit = true
					// 	event = limitEvent
					// }
				}
			}
		}
		return {
			event,
			limit
		}
	}

	drawingMouseTracePush(event: MouseEvent): boolean {
		const { event: finalEvent, limit } = this.shiftMouseEvent2LimitMouseEvent(event)
		if (limit && this.drawingShape?.data.shapeName == 'dot') return false
		let preLength = this.drawingMouseTrace.length
		this.drawingMouseTrace.push(finalEvent)
		let curLength = this.drawingMouseTrace.length
		if (preLength == 0 && curLength == 1) {
			this.imageMark.eventBus.emit(EventBusEventName.shape_start_drawing, this.drawingShape, this.imageMark)
		}
		return true
	}

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

	// 当前正在编辑或移动等这种选中的shape，为了document或者container事件分发找到对应的shape
	holdShape: ImageMarkShape | null = null

	setHoldShape(shape: ImageMarkShape | null) {
		this.holdShape = shape
	}

	onContainerMouseDown(event: MouseEvent) {
		if (!this.imageMark.status.drawing) return
		if (this.programmaticDrawing) return

		if (this.drawingShape?.mouseDrawType == 'oneTouch') {
			this.drawingMouseTracePush(event)
		}

		if (this.drawingShape?.mouseDrawType == 'multiPress') {
			const valid = this.drawingMouseTracePush(event)
			if (!valid) return
			const newData = this.drawingShape.mouseEvent2Data({
				eventList: this.drawingMouseTrace
			})
			newData && this.drawing(newData)
		}
	}

	onContainerMouseMove(event: MouseEvent) {
		this.holdShape?.onContainerMouseMove(event)
		if (!this.imageMark?.status.drawing || !this.drawingShape) return
		if (this.programmaticDrawing) return

		if (this.drawingShape?.mouseDrawType == 'multiPress') {

			const { event: finalEvent } = this.shiftMouseEvent2LimitMouseEvent(event)
			const newData = this.drawingShape.mouseEvent2Data({
				eventList: this.drawingMouseTrace,
				auxiliaryEvent: finalEvent
			})
			newData && this.drawing(newData)
		}
	}

	onDocumentMouseMove(event: MouseEvent) {
		this.holdShape?.onDocumentMouseMove(event)

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
			const valid = this.drawingMouseTracePush(event)
			if (!valid) return
			const newData = this.drawingShape.mouseEvent2Data({
				eventList: this.drawingMouseTrace
			})
			newData && this.drawing(newData)
		}

		if (this.drawingShape?.mouseDrawType == 'multiPress') {
			const newData = this.drawingShape.mouseEvent2Data({
				eventList: this.drawingMouseTrace,
				auxiliaryEvent: event
			})
			newData && this.drawing(newData)
		}
	}

	onDocumentMouseUp(event: MouseEvent) {
		this.holdShape?.onDocumentMouseUp(event)

		if (!this.imageMark?.status.drawing || !this.drawingShape) return
		if (this.programmaticDrawing) return

		if (!this.drawingMouseTrace?.length) return

		if (this.drawingShape?.mouseDrawType == 'oneTouch') {
			const valid = this.drawingMouseTracePush(event)
			if (valid) {
				const newData = this.drawingShape.mouseEvent2Data({
					eventList: this.drawingMouseTrace
				})
				newData && this.drawing(newData)
			}
			this.endDrawing()
		}
	}

	onReadonlyChange(readonly: boolean) {
		this.data.forEach(shapeData => {
			const shapeInstance = this.getInstanceByData(shapeData)
			shapeInstance?.onReadonlyChange?.(readonly)
		})
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
		ShapePlugin.useShape(ImageMarkDot)
		ShapePlugin.useShape(ImageMarkCircle)
		ShapePlugin.useShape(ImageMarkPathLine)
		ShapePlugin.useShape(ImageMarkLine)
		ShapePlugin.useShape(ImageMarkImage)
		ShapePlugin.useShape(ImageMarkPolyLine)
		ShapePlugin.useShape(ImageMarkPolygon)
	}

	static unuseDefaultShape() {
		ShapePlugin.unuseShape(ImageMarkRect)
		ShapePlugin.unuseShape(ImageMarkDot)
		ShapePlugin.unuseShape(ImageMarkCircle)
		ShapePlugin.unuseShape(ImageMarkPathLine)
		ShapePlugin.unuseShape(ImageMarkLine)
		ShapePlugin.unuseShape(ImageMarkImage)
		ShapePlugin.unuseShape(ImageMarkPolyLine)
		ShapePlugin.unuseShape(ImageMarkPolygon)
	}
}


ShapePlugin.useDefaultShape()
