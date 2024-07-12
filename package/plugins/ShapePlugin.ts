import { ImageMark } from "..";
import { Plugin } from ".";
import { ImageMarkShape, ShapeData } from "../shape/Shape";

export class ShapePlugin extends Plugin {
	static pluginName = "shape";
	private node2ShapeInstanceWeakMap = new WeakMap<ShapeData, ImageMarkShape>()
	data: ShapeData[] = []
	constructor(imageMarkInstance: ImageMark) {
		super(imageMarkInstance);
		// @ts-ignore
		let pluginName = this.constructor['pluginName']
		this.data = imageMarkInstance.options.pluginOptions?.[pluginName]?.shapeList || []
		this.bindEventThis(['onRerender', 'onDraw', 'onInit'])
		this.bindEvent()
	}

	private createShape() {
		this.data.forEach(node => {
			if (!this.node2ShapeInstanceWeakMap.has(node)) {
				let shape = null
				const ShapeClass = ShapePlugin.shapeList.find(item => item.shapeName == node.shapeName)
				if (ShapeClass) {
					if (ShapeClass.constructor === ImageMarkShape) {
						throw new Error(`Shape ${ShapeClass.shapeName} must be a subclass of ImageMarkShape`)
					}
					// @ts-ignore
					shape = new ShapeClass(node)
					if (shape) {
						this.node2ShapeInstanceWeakMap.set(node, shape)
					}
				}
			}
		})
	}

	private bindEvent() {
		this.imageMark.on('rerender', this.onRerender)
		this.imageMark.on('draw', this.onDraw)
		this.imageMark.on('init', this.onInit)
	}

	private unbindEvent() {
		this.imageMark.off('rerender', this.onRerender)
		this.imageMark.off('draw', this.onDraw)
		this.imageMark.off('init', this.onInit)
	}

	rerender() {
		this.createShape()
		this.onDraw()
	}

	private onInit() {
		this.createShape()
	}

	private onRerender() {
		this.node2ShapeInstanceWeakMap = new WeakMap<ShapeData, ImageMarkShape>()
	}

	private onDraw() {
		this.data.forEach(node => {
			const shape = this.node2ShapeInstanceWeakMap.get(node)
			if (shape) {
				shape.render(this.imageMark.stageGroup)
			}
		})
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
