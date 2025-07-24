import { Circle, G, } from "@svgdotjs/svg.js";
import { getDefaultTransform, ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeOptions } from "./Shape";
import ImageMark from "..";
import { cloneDeep } from "lodash-es";

export interface DotData extends ShapeData {
	shapeName: "dot",
	x: number,
	y: number,
	r: number
}

export class ImageMarkDot extends ImageMarkShape<DotData> {
	static shapeName = "dot"
	constructor(data: DotData, imageMarkInstance: ImageMark, options: ShapeOptions) {
		super(data, imageMarkInstance, options)
	}

	draw(): G {
		const { x, y, r, transform = getDefaultTransform() } = this.data
		console.log('draw dot', cloneDeep(transform), x, y, r)
		const circle = this.getMainShape<Circle>() || new Circle()
		circle.id(this.getMainId())

		circle.center(x, y).attr({
			r
		}).fill(this.attr?.fill || this.attr?.stroke?.color || 'transparent').stroke(this.attr?.stroke || {})
		this.shapeInstance.transform(transform.matrix)

		circle.addTo(this.shapeInstance)

		this.drawFuncList.forEach(func => {
			func(this)
		})

		this.drawLabel()

		this.options?.initDrawFunc?.(this)

		return this.shapeInstance
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
