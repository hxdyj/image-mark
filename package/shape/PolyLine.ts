import { G, Line, Polyline, } from "@svgdotjs/svg.js";
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeMouseDrawType, ShapeOptions } from "./Shape";
import ImageMark from "..";

export interface PolyLineData extends ShapeData {
	shapeName: "polyline",
	points: number[],
	auxiliaryPoint?: [number, number]
}

export class ImageMarkPolyLine extends ImageMarkShape<PolyLineData> {
	static shapeName = "polyline"
	readonly mouseDrawType: ShapeMouseDrawType = 'multiPress'
	constructor(data: PolyLineData, imageMarkInstance: ImageMark, options: ShapeOptions) {
		const group = new G()
		const line = new Polyline()
		group.add(line)
		super(data, imageMarkInstance, options, group)
		this.data.auxiliaryPoint = undefined
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
				points: points.concat(this.data.auxiliaryPoint || []).join(',')
			}).stroke({ width: 4, color: '#F53F3F' }).fill('none')
		}
		return this.shapeInstance
	}

	updateData(newData: PolyLineData): G {
		this.data = newData
		this.draw()
		return this.shapeInstance
	}

	mouseEvent2Data(options: MouseEvent2DataOptions): PolyLineData | null {
		const { eventList = [], auxiliaryEvent } = options
		if (!(eventList.length && auxiliaryEvent)) return null
		const points = eventList.map(event => {
			const { x, y } = this.imageMark.image.point(event)
			return [x, y]
		}).flat() as unknown as number[]

		const auxiliaryPoint = this.imageMark.image.point(auxiliaryEvent)
		const newLine: PolyLineData = {
			...this.data,
			points,
			auxiliaryPoint: [auxiliaryPoint.x, auxiliaryPoint.y]
		}
		return newLine
	}
}
