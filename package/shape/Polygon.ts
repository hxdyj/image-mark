import { G, Line, Polygon, Polyline } from "@svgdotjs/svg.js";
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeMouseDrawType, ShapeOptions } from "./Shape";
import ImageMark from "..";
import { defaultsDeep } from "lodash-es";

export interface PolygonData extends ShapeData {
	shapeName: "polygon",
	points: number[],
	auxiliaryPoint?: [number, number]
}

export class ImageMarkPolygon extends ImageMarkShape<PolygonData> {
	static shapeName = "polygon"
	readonly mouseDrawType: ShapeMouseDrawType = 'multiPress'

	constructor(data: PolygonData, imageMarkInstance: ImageMark, options: ShapeOptions) {
		data.auxiliaryPoint = undefined
		super(data, imageMarkInstance, options)
	}

	draw(): G {
		const { points, auxiliaryPoint } = this.data
		const polygon = this.getMainShape<Polygon>() || new Polygon()
		polygon.id(this.getMainId())


		if (auxiliaryPoint) {
			polygon.opacity(0)
			let polyline = this.shapeInstance.findOne('polyline') as Polyline
			if (!polyline) {
				polyline = new Polyline()
				this.shapeInstance.add(polyline)
			}

			polyline.plot(points.concat(this.data.auxiliaryPoint || [])).stroke(this.attr?.stroke || {}).fill(this.attr?.fill || 'none')

			let dashLine = this.shapeInstance.findOne('line') as Line
			if (points.length > 2) {
				if (!dashLine) {
					dashLine = new Line()
					this.shapeInstance.add(dashLine)
				}

				dashLine.attr({
					x1: auxiliaryPoint[0],
					y1: auxiliaryPoint[1],
					x2: points[0],
					y2: points[1],
				}).stroke(defaultsDeep(this.attr?.auxiliary?.stroke || {}, this.attr?.stroke || {}))

			} else {
				if (dashLine) {
					dashLine.remove()
				}
			}
		} else {
			polygon.attr({
				points: points.join(',')
			}).stroke(this.attr?.stroke || {}).fill(this.attr?.fill || 'transparent')
		}

		polygon.addTo(this.shapeInstance)


		this.drawFuncList.forEach(func => {
			func(this)
		})

		this.drawLabel()

		this.options?.initDrawFunc?.(this)

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

	mouseEvent2Data(options: MouseEvent2DataOptions): PolygonData | null {
		const { eventList = [], auxiliaryEvent } = options
		if (!eventList.length) return null
		const points = eventList.map(event => {
			const { x, y } = this.imageMark.image.point(event)
			return [x, y]
		}).flat() as unknown as number[]

		const newLine: PolygonData = {
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
