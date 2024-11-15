import { Circle, G } from "@svgdotjs/svg.js";
import { ImageMarkShape, ShapeData, ShapeOptions } from "./Shape";
import ImageMark from "..";


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
}
