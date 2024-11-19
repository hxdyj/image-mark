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
	line: Line
	constructor(data: LineData, imageMarkInstance: ImageMark, options: ShapeOptions) {
		const group = new G()
		super(data, imageMarkInstance, options, group)
		this.line = new Line()
		group.add(this.line)
		this.draw()

	}

	dmoveData(dmove: [number, number]): LineData {
		const { x, y, x2, y2 } = this.data
		this.data.x += dmove[0]
		this.data.y += dmove[1]
		this.data.x2 = x2 + this.data.x - x
		this.data.y2 = y2 + this.data.y - y
		return this.data
	}

	draw(): G {
		const { x, y, x2, y2 } = this.data
		this.line.attr({
			x1: x,
			y1: y,
			x2: x2,
			y2: y2
		}).stroke({ width: 10, color: '#FADC19' })
		return this.shapeInstance
	}

	updateData(newData: LineData): G {
		this.data = newData
		this.draw()
		return this.shapeInstance
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
