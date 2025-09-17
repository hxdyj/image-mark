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
		data.auxiliaryPoint = undefined
		super(data, imageMarkInstance, options)
	}

	draw(): G {
		const { points } = this.data
		const polyline = this.getMainShape<Polyline>() || new Polyline()
		polyline.id(this.getMainId())

		polyline.plot(points.concat(this.data.auxiliaryPoint || [])).stroke(this.attr?.stroke || {}).fill(this.attr?.fill || 'none')

		polyline.addTo(this.shapeInstance)
		this.drawLabel()
		this.drawFuncList.forEach(func => {
			func(this)
		})
		return this.shapeInstance
	}

	translate(x: number, y: number): void {
		this.data.points = this.data.points.map((point, index) => {
			if (index % 2 === 0) {
				return point + x
			}
			return point + y
		})
		this.shapeInstance.transform({
			translate: [0, 0]
		}, false)
	}

	mouseEvent2Data(options: MouseEvent2DataOptions): PolyLineData | null {
		const { eventList = [], auxiliaryEvent } = options
		if (!eventList.length) return null
		const points = eventList.map(event => {
			const { x, y } = this.imageMark.image.point(event)
			return [x, y]
		}).flat() as unknown as number[]

		const newLine: PolyLineData = {
			...this.data,
			points,
		}

		if (auxiliaryEvent) {
			const auxiliaryPoint = this.imageMark.image.point(auxiliaryEvent)
			newLine.auxiliaryPoint = [auxiliaryPoint.x, auxiliaryPoint.y]
		}

		return newLine
	}
}
