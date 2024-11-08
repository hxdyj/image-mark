import { ImageMark } from "..";
import { Plugin } from ".";
import { ImageMarkShape, ShapeData } from "../shape/Shape";
import { EventBusEventName } from "../event/const";

export class ShapePlugin<T extends ShapeData = ShapeData> extends Plugin {
	static pluginName = "shape";
	protected node2ShapeInstanceWeakMap = new WeakMap<T, ImageMarkShape>()
	protected shapeInstance2NodeWeakMap = new WeakMap<ImageMarkShape, T>()
	data: T[] = []
	constructor(imageMarkInstance: ImageMark) {
		super(imageMarkInstance);
		// @ts-ignore
		let pluginName = this.constructor['pluginName']
		this.data = imageMarkInstance.options.pluginOptions?.[pluginName]?.shapeList || []
		ShapePlugin.shapeList.forEach(shape => {
			this.initShape(shape)
		})

		this.bindEventThis(['onRerender', 'onDraw', 'onInit', 'onDelete', 'onResize'])
		this.bindEvent()
	}

	protected addNode(node: T) {
		if (!this.node2ShapeInstanceWeakMap.has(node)) {
			let shape = null
			const ShapeClass = this.shape[node.shapeName]
			if (ShapeClass) {
				if (ShapeClass.constructor === ImageMarkShape) {
					throw new Error(`Shape ${Reflect.get(ShapeClass, 'shapeName')} must be a subclass of ImageMarkShape`)
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

	destroy(): void {
		super.destroy()
		this.clear()
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
		const data = this.shapeInstance2NodeWeakMap.get(shapeInstance)
		if (data) {
			const index = this.data.findIndex(item => item === data)
			this.data.splice(index, 1)
			this.node2ShapeInstanceWeakMap.delete(data)
			this.shapeInstance2NodeWeakMap.delete(shapeInstance)
		}
	}

	clear() {
		while (this.data.length) {
			let item = this.data[0]
			let nodeInstance = this.node2ShapeInstanceWeakMap.get(item)
			nodeInstance?.destroy()
			this.onDelete(item, nodeInstance!)
		}
	}

	protected onInit() {
		this.createShape()
	}

	clearMap() {
		this.node2ShapeInstanceWeakMap = new WeakMap<T, ImageMarkShape>()
		this.shapeInstance2NodeWeakMap = new WeakMap<ImageMarkShape, T>()
	}

	protected onRerender() {
		this.onResize()
	}

	protected onResize() {
		//TODO(songle): do this
		// this.clearMap()
		// this.createShape()
		// this.onDraw()
	}

	protected renderNode(node: T) {
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

	getInstanceByData(data: T) {
		return this.node2ShapeInstanceWeakMap.get(data)
	}

	shape: {
		[key: string]: ImageMarkShape
	} = {}

	addShape(shape: typeof ImageMarkShape<T>) {
		this.initShape(shape)
	}

	removeShape(shape: typeof ImageMarkShape<T>) {
		Reflect.deleteProperty(this.shape, shape.shapeName)
	}

	initShape<T extends ShapeData>(shape: typeof ImageMarkShape<T>) {
		if (!shape.shapeName) throw new Error(`${shape.name} shapeName is required`)
		this.shape[shape.shapeName] = shape as unknown as ImageMarkShape<T>
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
