import { G, Line, } from "@svgdotjs/svg.js";
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeOptions } from "./Shape";
import ImageMark from "..";

export interface LineData extends ShapeData {
	shapeName: "line",
	x: number,
	y: number,
	x2: number
	y2: number
}

export class ImageMarkLine extends ImageMarkShape<LineData> {
	static shapeName = "line"
	constructor(data: LineData, imageMarkInstance: ImageMark, options: ShapeOptions) {
		super(data, imageMarkInstance, options)
	}

	draw(): G {
		const { x, y, x2, y2 } = this.data
		const line = this.getMainShape<Line>() || new Line()
		line.id(this.getMainId())

		line.plot([x, y, x2, y2]).stroke(this.attr?.stroke || {})

		line.addTo(this.shapeInstance)
		this.drawLabel()

		this.drawFuncList.forEach(func => {
			func(this)
		})

		return this.shapeInstance
	}


	translate(x: number, y: number): void {
		this.data.x += x
		this.data.y += y
		this.data.x2 += x
		this.data.y2 += y
		this.shapeInstance.transform({
			translate: [0, 0]
		}, false)
	}

	mouseEvent2Data(options: MouseEvent2DataOptions): LineData | null {
		const { eventList = [] } = options
		if (eventList.length < 2) return null
		const startPoint = this.imageMark.image.point(eventList[0])
		const endPoint = this.imageMark.image.point(eventList[eventList.length - 1])
		const newLine: LineData = {
			...this.data,
			x: startPoint.x,
			y: startPoint.y,
			x2: endPoint.x,
			y2: endPoint.y,
		}
		return newLine

	}
}
