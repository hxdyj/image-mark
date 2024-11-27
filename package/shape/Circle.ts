import { Circle, G, Rect, } from "@svgdotjs/svg.js";
import { AddToShape, getDefaultTransform, ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeOptions } from "./Shape";
import ImageMark from "..";


function calculateDistance(point1: { x: number; y: number }, point2: { x: number; y: number }): number {
	const dx = point2.x - point1.x;
	const dy = point2.y - point1.y;
	return Math.sqrt(dx * dx + dy * dy);
}


export interface CircleData extends ShapeData {
	shapeName: "circle",
	r: number
}

export class ImageMarkCircle extends ImageMarkShape<CircleData> {
	static shapeName = "circle"
	constructor(data: CircleData, imageMarkInstance: ImageMark, options: ShapeOptions) {
		super(data, imageMarkInstance, options)
	}

	draw(): G {
		const { r, transform = getDefaultTransform() } = this.data
		this.shapeInstance.transform(transform.matrix)
		const circle = this.shapeInstance.findOne('circle') as Circle || new Circle()
		circle.addTo(this.shapeInstance)

		circle.attr({
			r
		}).fill('transparent').stroke({ width: 10, color: '#FADC19' })

		// this.shapeInstance.move(x - r, y - r)

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
