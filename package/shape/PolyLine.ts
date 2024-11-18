import { G, Line, Polyline, } from "@svgdotjs/svg.js";
import { ImageMarkShape, ShapeData, ShapeOptions } from "./Shape";
import ImageMark from "..";

export interface PolyLineData extends ShapeData {
	shapeName: "polyline",
	points: number[]
}

export class ImageMarkPolyLine extends ImageMarkShape<PolyLineData> {
	static shapeName = "polyline"

	constructor(data: PolyLineData, imageMarkInstance: ImageMark, options: ShapeOptions) {
		const group = new G()
		const line = new Polyline()
		group.add(line)
		super(data, imageMarkInstance, options, group)
		this.draw()
	}

	dmoveData(dmove: [number, number]): PolyLineData {
		const { points = [] } = this.data
		points.forEach((point, index) => {
			if (index % 2 === 0) {
				points[index] = point + dmove[0]
			} else {
				points[index] = point + dmove[1]
			}
		})
		return this.data
	}

	draw(): G {
		const { points } = this.data
		const line = this.shapeInstance.findOne('polyline') as Polyline
		if (line) {
			line.attr({
				points: points.join(',')
			}).stroke({ width: 4, color: '#F53F3F' }).fill('none')
		}
		return this.shapeInstance
	}

	updateData(newData: PolyLineData): G {
		this.data = newData
		this.draw()
		return this.shapeInstance
	}

	// mouseEvent2Data(eventList: MouseEvent[]): PolyLineData | null {
	// 	if (eventList.length < 2) return null
	// 	const startPoint = this.imageMark.image.point(eventList[0])
	// 	const endPoint = this.imageMark.image.point(eventList[eventList.length - 1])
	// 	const newLine: PolyLineData = {
	// 		...this.data,
	// 		x: startPoint.x,
	// 		y: startPoint.y,
	// 		x2: endPoint.x,
	// 		y2: endPoint.y,
	// 	}
	// 	return newLine

	// }
}
