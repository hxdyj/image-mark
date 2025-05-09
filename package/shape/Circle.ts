import { Circle, G, Rect, } from "@svgdotjs/svg.js";
import { AddToShape, getDefaultTransform, ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeOptions } from "./Shape";
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

	draw(): G {
		const { x, y, r, transform = getDefaultTransform() } = this.data
		console.log('draw circle', cloneDeep(transform), x, y, r)
		const circle = this.getMainShape<Circle>() || new Circle()
		circle.id(this.getMainId())

		circle.center(x, y).attr({
			r
		}).fill('transparent').stroke({ width: 10, color: '#FADC19' })
		this.shapeInstance.transform(transform.matrix)

		circle.addTo(this.shapeInstance)

		this.drawFuncList.forEach(func => {
			func(this)
		})

		this.drawLabel()

		this.options?.initDrawFunc?.(this)

		return this.shapeInstance
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
		return newCircle
	}
}
