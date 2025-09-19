import { Circle, G, Line, Point, Polyline, } from "@svgdotjs/svg.js";
import { EditPointItem, ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeMouseDrawType, ShapeOptions } from "./Shape";
import ImageMark from "..";
import { chunk, clamp } from "lodash-es";
import { getOptimalTextColor } from "../../src/utils/color.util";

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

		editPointList.forEach(point => {
			const className = this.getEditPointClassName(point.className)
			const findCircle = g.find(`.${className}`)[0]
			const circle = findCircle || new Circle().addClass(className).addClass('edit-move-point').attr('data-index', point.className) as Circle
			const mainStrokeWidth = this.getMainShape().attr('stroke-width')
			const mainStrokeColor = this.getMainShape().attr('stroke')
			circle.center(point.x, point.y).attr({
				r: (mainStrokeWidth || 6)
			}).fill(getOptimalTextColor(mainStrokeColor))
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
