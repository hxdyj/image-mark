import { Circle, G, Line, Point, } from "@svgdotjs/svg.js";
import { EditPointItem, ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeOptions } from "./Shape";
import ImageMark from "..";
import { getOptimalTextColor } from "../../src/utils/color.util";
import { clamp } from "lodash-es";

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

	getEditPointClassName(className: number) {
		return `edit-point-${className}`
	}

	drawEdit() {
		const { x, y, x2, y2 } = this.data
		const g = this.getEditGroup<G>() || new G().id(this.getEditGroupId())
		const editPointList: EditPointItem<number>[] = [
			{
				x,
				y,
				className: 0
			},
			{
				x: x2,
				y: y2,
				className: 1
			}
		]

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
			this.updateData({
				...this.data,
				[index === 0 ? 'x' : 'x2']: point.x,
				[index === 0 ? 'y' : 'y2']: point.y,
			})
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
