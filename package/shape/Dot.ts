import { Circle, G, } from "@svgdotjs/svg.js";
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeOptions } from "./Shape";
import ImageMark from "../index";

export interface DotData extends ShapeData {
	shapeName: "dot",
	x: number,
	y: number,
	r: number
}

export class ImageMarkDot extends ImageMarkShape<DotData> {
	static shapeName = "dot"
	constructor(data: DotData, imageMarkInstance: ImageMark, options?: ShapeOptions) {
		super(data, imageMarkInstance, options)
	}

	draw(): G {
		const { x, y, r } = this.data
		console.log('draw dot', x, y, r)
		const circle = this.getMainShape<Circle>() || new Circle()
		circle.id(this.getMainId())

		circle.center(x, y).attr({
			r
		}).fill(this.attr?.fill || this.attr?.stroke?.color || 'transparent').stroke(this.attr?.stroke || {})

		circle.addTo(this.shapeInstance)

		this.drawLabel()

		this.drawFuncList.forEach(func => {
			func(this)
		})

		return this.shapeInstance
	}

	drawEdit(): void { }

	translate(x: number, y: number): void {
		this.data.x += x
		this.data.y += y
		this.shapeInstance.transform({
			translate: [0, 0]
		}, false)
	}

	fixData(data?: DotData | undefined): void {
		data = data || this.data
		const flagName = this.getPreStatusOperateActionName()
		if (flagName) {
			const r = this.data.r
			data.x = this.imageMark.options.action?.[flagName] ? data.x : this.clampX(data.x, -r, r)
			data.y = this.imageMark.options.action?.[flagName] ? data.y : this.clampY(data.y, -r, r)
		}
	}

	mouseEvent2Data(options: MouseEvent2DataOptions): DotData | null {
		const { eventList = [] } = options
		const startPoint = this.imageMark.image.point(eventList[0])
		const r = this.attr?.dot?.r || 10
		const newCircle: DotData = {
			...this.data,
			x: startPoint.x,
			y: startPoint.y,
			r,
		}
		return newCircle
	}
}
