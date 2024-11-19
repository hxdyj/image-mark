import { Circle, G, } from "@svgdotjs/svg.js";
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeOptions } from "./Shape";
import ImageMark from "..";


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
		const group = new G()
		const circle = new Circle()
		group.add(circle)
		super(data, imageMarkInstance, options, group)
		this.draw()
	}

	draw(): G {
		const { x, y, r } = this.data
		this.shapeInstance.move(x - r, y - r)
		const circle = this.shapeInstance.findOne('circle') as Circle
		if (circle) {
			circle.attr({
				r
			}).fill('transparent').stroke({ width: 4, color: '#F53F3F' })
		}
		return this.shapeInstance
	}

	updateData(newData: CircleData): G {
		this.data = newData
		this.draw()
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
