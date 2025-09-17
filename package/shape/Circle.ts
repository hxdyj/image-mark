import { Circle, G, } from "@svgdotjs/svg.js";
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeOptions } from "./Shape";
import ImageMark from "..";
import { cloneDeep } from "lodash-es";


function calculateDistance(point1: { x: number; y: number }, point2: { x: number; y: number }): number {
	const dx = point2.x - point1.x;
	const dy = point2.y - point1.y;
	return Math.sqrt(dx * dx + dy * dy);
}


export interface CircleData extends ShapeData {
	shapeName: "circle",
	x: number,
	y: number,
	r: number
}

export class ImageMarkCircle extends ImageMarkShape<CircleData> {
	static shapeName = "circle"
	constructor(data: CircleData, imageMarkInstance: ImageMark, options: ShapeOptions) {
		super(data, imageMarkInstance, options)
	}

	readonly drawType = 'centerScale'

	draw(): G {
		const { x, y, r } = this.data
		console.log('draw circle', x, y, r)
		const circle = this.getMainShape<Circle>() || new Circle()
		circle.id(this.getMainId())

		circle.center(x, y).attr({
			r
		}).fill(this.attr?.fill || 'transparent').stroke(this.attr?.stroke || {})

		circle.addTo(this.shapeInstance)

		this.drawLabel()
		this.drawFuncList.forEach(func => {
			func(this)
		})
		return this.shapeInstance
	}

	translate(x: number, y: number): void {
		this.data.x += x
		this.data.y += y
		this.shapeInstance.transform({
			translate: [0, 0]
		}, false)
	}

	mouseEvent2Data(options: MouseEvent2DataOptions): CircleData | null {
		const { eventList = [] } = options
		if (eventList.length < 2) return null
		const startPoint = this.imageMark.image.point(eventList[0])
		const endPoint = this.imageMark.image.point(eventList[eventList.length - 1])
		const r = calculateDistance(startPoint, endPoint)

		const newCircle: CircleData = {
			...this.data,
			x: startPoint.x,
			y: startPoint.y,
			r,
		}

		console.log('end', eventList[eventList.length - 1], endPoint, newCircle)

		return newCircle
	}
}
