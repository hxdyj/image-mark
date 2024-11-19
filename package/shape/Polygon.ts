import { G, Line, Polygon, Polyline } from "@svgdotjs/svg.js";
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeMouseDrawType, ShapeOptions } from "./Shape";
import ImageMark from "..";

export interface PolygonData extends ShapeData {
	shapeName: "polygon",
	points: number[],
	auxiliaryPoint?: [number, number]
}

export class ImageMarkPolygon extends ImageMarkShape<PolygonData> {
	static shapeName = "polygon"
	readonly mouseDrawType: ShapeMouseDrawType = 'multiPress'

	polygon: Polygon
	constructor(data: PolygonData, imageMarkInstance: ImageMark, options: ShapeOptions) {
		const group = new G()
		data.auxiliaryPoint = undefined
		super(data, imageMarkInstance, options, group)
		this.polygon = new Polygon()
		group.add(this.polygon)
		this.draw()

	}

	dmoveData(dmove: [number, number]): PolygonData {
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
		const { points, auxiliaryPoint } = this.data
		console.log('ImageMarkPolygon draw', this.uid, JSON.stringify(this.data))
		if (auxiliaryPoint) {
			this.polygon.opacity(0)
			let polyline = this.shapeInstance.findOne('polyline') as Polyline
			if (!polyline) {
				polyline = new Polyline()
				this.shapeInstance.add(polyline)
			}

			polyline.attr({
				points: points.concat(this.data.auxiliaryPoint || []).join(',')
			}).stroke({ width: 10, color: '#FADC19' }).fill('none')

			if (points.length > 2) {
				let dashLine = this.shapeInstance.findOne('line') as Line
				if (!dashLine) {
					dashLine = new Line()
					this.shapeInstance.add(dashLine)
				}

				dashLine.attr({
					x1: auxiliaryPoint[0],
					y1: auxiliaryPoint[1],
					x2: points[0],
					y2: points[1],
				}).stroke({ width: 10, color: '#FADC19', dasharray: `20,20` })
				console.log(111, this.uid)
			}
		} else {
			this.polygon.attr({
				points: points.join(',')
			}).stroke({ width: 10, color: '#FADC19' }).fill('none')
			console.log(222, this.uid)
		}
		return this.shapeInstance
	}

	updateData(newData: PolygonData): G {
		this.data = newData
		this.draw()
		return this.shapeInstance
	}

	mouseEvent2Data(options: MouseEvent2DataOptions): PolygonData | null {
		const { eventList = [], auxiliaryEvent } = options
		if (!(eventList.length && auxiliaryEvent)) return null
		const points = eventList.map(event => {
			const { x, y } = this.imageMark.image.point(event)
			return [x, y]
		}).flat() as unknown as number[]

		const auxiliaryPoint = this.imageMark.image.point(auxiliaryEvent)
		const newLine: PolygonData = {
			...this.data,
			points,
			auxiliaryPoint: [auxiliaryPoint.x, auxiliaryPoint.y]
		}
		return newLine
	}
}
