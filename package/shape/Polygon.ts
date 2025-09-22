import { Circle, G, Line, Point, Polygon, Polyline } from "@svgdotjs/svg.js";
import { EditPointItem, ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeMouseDrawType, ShapeOptions } from "./Shape";
import ImageMark from "..";
import { chunk, clamp, defaultsDeep } from "lodash-es";
import { getOptimalTextColor } from "../../src/utils/color.util";

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

		if (this.editOn) {
			this?.drawEdit()
		} else {
			this.removeEdit()
		}

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


	getEditPointClassName(className: number) {
		return `edit-point-${className}`
	}

	drawEdit() {
		const g = this.getEditGroup<G>() || new G().id(this.getEditGroupId())
		const editPointList: EditPointItem<number>[] = chunk(this.data.points, 2).map((item, index) => {
			return {
				x: item[0],
				y: item[1],
				className: index
			}
		})

		const { strokeWidth, optimalStrokeColor } = this.getMainShapeInfo()

		editPointList.forEach(point => {
			const className = this.getEditPointClassName(point.className)
			const findCircle = g.find(`.${className}`)[0]
			const circle = findCircle || new Circle().addClass(className).addClass('edit-move-point').attr('data-index', point.className) as Circle
			circle.center(point.x, point.y).attr({
				r: (strokeWidth)
			}).fill(optimalStrokeColor)
			circle.addTo(g)
			if (!findCircle) {
				circle.on('mousedown', this.startEditShape)
			}
		})
		g.addTo(this.shapeInstance)
	}


	getEditShape() {
		//@ts-ignore
		return this.editMouseDownEvent?.target.instance as Circle
	}

	getEditEventPointIndex() {
		//@ts-ignore
		const point = this.getEditShape()
		const index = point.attr('data-index')
		return index
	}



	getEditPoint(event: MouseEvent): {
		index: number,
		point: Point
	} {
		const index = this.getEditEventPointIndex()
		const currentEvent = event
		const point = this.imageMark.image.point(currentEvent.clientX, currentEvent.clientY)

		if (!this.imageMark.options.action?.enableEditShapeOutOfImg) {
			point.x = clamp(point.x, 0, this.imageMark.imageDom.naturalWidth)
			point.y = clamp(point.y, 0, this.imageMark.imageDom.naturalHeight)
		}

		return {
			index,
			point
		}
	}

	onDocumentMouseMove(event: MouseEvent) {
		super.onDocumentMouseMove(event)
		const evt = event as MouseEvent
		if (evt.button === 0 && this.editMouseDownEvent) {
			event.stopPropagation()
			const { index, point } = this.getEditPoint(event)
			const startIndex = index * 2
			this.data.points.splice(startIndex, 2, point.x, point.y)
			this.updateData(this.data)
		}
		this.getEditShape()?.addClass('edit-moving-point')
	}

	onDocumentMouseUp(event: MouseEvent) {
		super.onDocumentMouseUp(event)
		this.onDocumentMouseMove(event)
		this.getEditShape()?.removeClass('edit-moving-point')
		this.endEditShape()
	}
}
