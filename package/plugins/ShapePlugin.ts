import { ImageMark } from "..";
import { Plugin } from ".";
import { ImageMarkShape, ShapeData } from "../shape/Shape";
import { EventBusEventName } from "../event/const";

export class ShapePlugin extends Plugin {
	static pluginName = "shape";
	protected node2ShapeInstanceWeakMap = new WeakMap<ShapeData, ImageMarkShape>()
	protected shapeInstance2NodeWeakMap = new WeakMap<ImageMarkShape, ShapeData>()
	data: ShapeData[] = []
	constructor(imageMarkInstance: ImageMark) {
		super(imageMarkInstance);
		// @ts-ignore
		let pluginName = this.constructor['pluginName']
		this.data = imageMarkInstance.options.pluginOptions?.[pluginName]?.shapeList || []
		this.bindEventThis(['onRerender', 'onDraw', 'onInit', 'onDelete', 'onResize'])
		this.bindEvent()
	}

	protected addNode(node: ShapeData) {
		if (!this.node2ShapeInstanceWeakMap.has(node)) {
			let shape = null
			const ShapeClass = ShapePlugin.shapeList.find(item => item.shapeName == node.shapeName)
			if (ShapeClass) {
				if (ShapeClass.constructor === ImageMarkShape) {
					throw new Error(`Shape ${ShapeClass.shapeName} must be a subclass of ImageMarkShape`)
				}
				// @ts-ignore
				shape = new ShapeClass(node, this.imageMark)
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

	protected bindEvent() {
		this.imageMark.on('rerender', this.onRerender)
		this.imageMark.on('draw', this.onDraw)
		this.imageMark.on('init', this.onInit)
		this.imageMark.on('shape_delete', this.onDelete)
		this.imageMark.on('resize', this.onResize)
	}

	protected unbindEvent() {
		this.imageMark.off('rerender', this.onRerender)
		this.imageMark.off('draw', this.onDraw)
		this.imageMark.off('init', this.onInit)
		this.imageMark.off('shape_delete', this.onDelete)
		this.imageMark.off('resize', this.onResize)
	}

	updateData(data: ShapeData[]) {
		this.data = data
		this.createShape()
	}

	onAdd(data: ShapeData, emit = true) {
		this.data.push(data)
		this.addNode(data)
		this.renderNode(data)
		if (emit) {
			this.imageMark.eventBus.emit(EventBusEventName.shape_add, data, this.node2ShapeInstanceWeakMap.get(data))
		}
	}

	onDelete(_data: ShapeData, shapeInstance: ImageMarkShape) {
		const data = this.shapeInstance2NodeWeakMap.get(shapeInstance)
		if (data) {
			this.data = this.data.filter(item => item !== data)
			this.node2ShapeInstanceWeakMap.delete(data)
			this.shapeInstance2NodeWeakMap.delete(shapeInstance)
		}
	}

	protected onInit() {
		this.createShape()
	}

	clearMap() {
		this.node2ShapeInstanceWeakMap = new WeakMap<ShapeData, ImageMarkShape>()
		this.shapeInstance2NodeWeakMap = new WeakMap<ImageMarkShape, ShapeData>()
	}

	protected onRerender() {
		this.onResize()
	}

	protected onResize() {
		this.clearMap()
		this.createShape()
		this.onDraw()
	}

	protected renderNode(node: ShapeData) {
		const shape = this.node2ShapeInstanceWeakMap.get(node)
		if (shape) {
			shape.render(this.imageMark.stageGroup)
		}
	}

	protected onDraw() {
		this.data.forEach(node => {
			this.renderNode(node)
		})
	}

	getInstanceByData(data: ShapeData) {
		return this.node2ShapeInstanceWeakMap.get(data)
	}

	static shapeList: Array<typeof ImageMarkShape> = []
	static registerShape(shape: typeof ImageMarkShape) {
		if (ShapePlugin.hasShape(shape)) return ShapePlugin
		ShapePlugin.shapeList.push(shape)
		return ShapePlugin
	}
	static hasShape(shape: typeof ImageMarkShape) {
		return ShapePlugin.shapeList.find(item => item === shape)
	}
}
