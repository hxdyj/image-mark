import { ImageMark } from "..";
import { Plugin } from ".";
import { ImageMarkShape, ShapeData, ShapeOptions } from "../shape/Shape";
import { EventBusEventName } from "../event/const";

export type ShapePluginOptions<T extends ShapeData = ShapeData> = {
	shapeList: T[]
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
		this.data = imageMarkInstance.options.pluginOptions?.[pluginName]?.shapeList || []
		ShapePlugin.shapeList.forEach(shape => {
			this.initShape(shape)
		})
		this.bindEventThis(['onRerender', 'onDraw', 'onDelete', 'onResize', 'onDrawingMouseDown', 'onDrawingMouseMove', 'onDrawingMouseUp'])
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
		this.imageMark.on('rerender', this.onRerender)
		this.imageMark.on('draw', this.onDraw)
		this.imageMark.on('shape_delete', this.onDelete)
		this.imageMark.on('resize', this.onResize)
		this.imageMark.container.addEventListener('mousedown', this.onDrawingMouseDown)
		document.addEventListener('mousemove', this.onDrawingMouseMove)
		document.addEventListener('mouseup', this.onDrawingMouseUp)
	}

	unbindEvent() {
		super.unbindEvent()
		this.imageMark.off('rerender', this.onRerender)
		this.imageMark.off('draw', this.onDraw)
		this.imageMark.off('shape_delete', this.onDelete)
		this.imageMark.off('resize', this.onResize)

		this.imageMark.container.removeEventListener('mousedown', this.onDrawingMouseDown)
		document.removeEventListener('mousemove', this.onDrawingMouseMove)
		document.removeEventListener('mouseup', this.onDrawingMouseUp)
	}

	destroy(): void {
		super.destroy()
		this.clear()
		this.disableActionList.clear()
		this.clearMap()
		this.unbindEvent()
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
		while (this.data?.length) {
			let item = this.data[0]
			let nodeInstance = this.node2ShapeInstanceWeakMap.get(item)
			nodeInstance?.destroy()
			this.onDelete(item, nodeInstance!)
		}
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
	}

	removeShape(shape: typeof ImageMarkShape<T>) {
		Reflect.deleteProperty(this.shape, shape.shapeName)
	}

	initShape<T extends ShapeData>(shape: typeof ImageMarkShape<T>, shapeOptions?: ShapeOptions) {
		if (!shape.shapeName) throw new Error(`${shape.name} shapeName is required`)
		this.shape[shape.shapeName] = {
			ShapeClass: shape as unknown as ImageMarkShape<T>,
			shapeOptions
		}
	}


	drawingShape: ImageMarkShape<T> | null = null



	startDrawing(shape: ImageMarkShape<T>) {
		// const isClass = !(shape instanceof ImageMarkShape)
		// const shapeName = isClass ? shape.shapeName : Object.getPrototypeOf(shape).constructor.shapeName
		const shapeName = Object.getPrototypeOf(shape).constructor.shapeName
		this.imageMark.status.drawing = shapeName
		this.drawingShape = shape
	}


	drawing(shapeData: T) {
		if (!this.drawingShape) throw new Error('drawingShape is null')
		if (!this.drawingShape.isRendered) {
			this.drawingShape.render(this.imageMark.stageGroup)
		}
		this.drawingShape.updateData(shapeData)
	}

	endDrawing() {
		if (!this.drawingShape) throw new Error('drawingShape is null')
		this.onAdd(this.drawingShape.data, true)
		this.drawingShape.destroy()
		this.drawingShape = null
		this.imageMark.status.drawing = false
	}

	drawingMouseTrace: Array<MouseEvent> = []

	onDrawingMouseDown(event: MouseEvent) {
		if (!this.imageMark.status.drawing) return
		this.drawingMouseTrace.push(event)
	}

	onDrawingMouseMove(event: MouseEvent) {
		if (!this.imageMark?.status.drawing || !this.drawingShape) return
		if (event.buttons === 0) {
			return
		}
		this.drawingMouseTrace.push(event)
		const newData = this.drawingShape.mouseEvent2Data(this.drawingMouseTrace)
		newData && this.drawing(newData)
	}

	onDrawingMouseUp(event: MouseEvent) {
		if (!this.imageMark?.status.drawing || !this.drawingShape) return
		this.drawingMouseTrace.push(event)
		const newData = this.drawingShape.mouseEvent2Data(this.drawingMouseTrace)
		newData && this.drawing(newData)
		this.drawingMouseTrace = []
		this.endDrawing()
	}

	static shapeList: Array<typeof ImageMarkShape> = []
	static useShape<T extends ShapeData>(shape: typeof ImageMarkShape<T>) {
		if (ShapePlugin.hasShape(shape)) return ShapePlugin<T>
		ShapePlugin.shapeList.push(shape as typeof ImageMarkShape)
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
		return ShapePlugin.shapeList.find(item => item === shape)
	}
}
