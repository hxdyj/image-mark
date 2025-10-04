import { Circle, G, Point, Polygon, Rect } from "@svgdotjs/svg.js";
import { EditPointItem, ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeMouseDrawType, ShapeOptions } from "./Shape";
import ImageMark, { BoundingBox } from "../index";
import { clamp } from "lodash-es";


export interface RectData extends BoundingBox, ShapeData {
	shapeName: "rect",
	x: number,
	y: number,
	width: number,
	height: number,
}

export function getBoundingBoxByTwoPoints(point1: Point, point2: Point): BoundingBox {
	const xMin = Math.min(point1.x, point2.x);
	const xMax = Math.max(point1.x, point2.x);
	const yMin = Math.min(point1.y, point2.y);
	const yMax = Math.max(point1.y, point2.y);
	return {
		x: xMin,
		y: yMin,
		width: xMax - xMin,
		height: yMax - yMin,
	};
}

export type RectEditPointClassName = 'tl' | 't' | 'tr' | 'b' | 'bl' | 'br' | 'l' | 'r'
export type RectEditPointItem = EditPointItem<RectEditPointClassName>


export class ImageMarkRect extends ImageMarkShape<RectData> {
	static shapeName = "rect"
	constructor(data: RectData, imageMarkInstance: ImageMark, options?: ShapeOptions) {
		super(data, imageMarkInstance, options)
	}

	draw(): G {
		const { x, y, width, height } = this.data
		const rect = this.getMainShape<Polygon>() || new Polygon()
		rect.id(this.getMainId())
		rect.plot([x, y, x + width, y, x + width, y + height, x, y + height]).size(width, height).fill(this.attr?.fill || 'transparent').stroke(this.attr?.stroke || {})
		rect.addTo(this.shapeInstance)

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

		this.shapeInstance.transform({
			translate: [0, 0]
		}, false)
	}


	mouseEvent2Data(options: MouseEvent2DataOptions): RectData | null {
		const { eventList = [] } = options
		if (eventList.length < 2) return null
		const startPoint = this.imageMark.image.point(eventList[0])
		const endPoint = this.imageMark.image.point(eventList[eventList.length - 1])
		const newRect: RectData = {
			...this.data,
			...getBoundingBoxByTwoPoints(startPoint, endPoint),
		}
		return newRect
	}

	drawEdit() {
		const { x, y, width, height } = this.data
		const g = this.getEditGroup<G>() || new G().id(this.getEditGroupId())
		const editPointList: RectEditPointItem[] = [
			{
				x,
				y,
				className: 'tl'
			},
			{
				x: x + width / 2,
				y,
				className: 't'
			},
			{
				x: x + width,
				y,
				className: 'tr'
			},
			{
				x: x + width / 2,
				y: y + height,
				className: 'b'
			},
			{
				x,
				y: y + height,
				className: 'bl'
			},
			{
				x: x + width,
				y: y + height,
				className: 'br'
			},
			{
				x,
				y: y + height / 2,
				className: 'l'
			},
			{
				x: x + width,
				y: y + height / 2,
				className: 'r'
			},
		]

		const { strokeWidth, optimalStrokeColor } = this.getMainShapeInfo()

		editPointList.forEach(point => {
			const findCircle = g.find(`.${point.className}`)[0]
			const circle = findCircle || new Circle().addClass(point.className) as Circle
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

	getEditEventPointType() {
		//@ts-ignore
		const point = this.editMouseDownEvent?.target.instance as Circle
		const className = point.classes()[0] as unknown as RectEditPointClassName
		return className
	}

	getEditPoint(event: MouseEvent): [Point, Point] {
		const className = this.getEditEventPointType()
		const currentEvent = event
		const startEvent = this.editMouseDownEvent!

		const currentPoint = this.imageMark.image.point(currentEvent.clientX, currentEvent.clientY)
		const startPoint = this.imageMark.image.point(startEvent.clientX, startEvent.clientY)
		const offset = [currentPoint.x - startPoint.x, currentPoint.y - startPoint.y]
		const { x = 0, y = 0, width = 0, height = 0 } = this.editOriginData || {}
		const handle = {
			'l': () => {
				return [
					new Point({
						x: x + width,
						y: y
					}),
					new Point({
						x: x + offset[0],
						y: y + height
					}
					)]
			},
			'tl': () => {
				return [
					new Point({
						x: x + width,
						y: y + height
					}),
					new Point({
						x: x + offset[0],
						y: y + offset[1]
					})
				]
			},
			'tr': () => {
				return [
					new Point({
						x: x,
						y: y + height
					}),
					new Point({
						x: x + width + offset[0],
						y: y + offset[1]
					})
				]
			},
			't': () => {
				return [
					new Point({
						x: x + width,
						y: y + height
					}),
					new Point({
						x: x,
						y: y + offset[1]
					})
				]
			},
			'r': () => {
				return [
					new Point({
						x: x,
						y: y
					}),
					new Point({
						x: x + width + offset[0],
						y: y + height
					})
				]
			},
			'br': () => {
				return [
					new Point({
						x: x,
						y: y
					}),
					new Point({
						x: x + width + offset[0],
						y: y + height + offset[1]
					})
				]
			},
			'bl': () => {
				return [
					new Point({
						x: x + width,
						y: y
					}),
					new Point({
						x: x + offset[0],
						y: y + height + offset[1],
					})
				]
			},
			'b': () => {
				return [
					new Point({
						x: x,
						y: y
					}),
					new Point({
						x: x + width,
						y: y + height + offset[1]
					})
				]
			},
		}[className]
		const list = handle() as [Point, Point]

		if (!this.imageMark.options.action?.enableEditShapeOutOfImg) {
			list.forEach(point => {
				point.x = clamp(point.x, 0, this.imageMark.imageDom.naturalWidth)
				point.y = clamp(point.y, 0, this.imageMark.imageDom.naturalHeight)
			})
		}
		return list
	}

	onDocumentMouseMove(event: MouseEvent, emit = false) {
		super.onDocumentMouseMove(event)
		const evt = event as MouseEvent
		if (evt.button === 0 && this.editMouseDownEvent) {
			event.stopPropagation()
			const list = this.getEditPoint(event)
			const newData = getBoundingBoxByTwoPoints(...list)
			this.updateData({
				...this.data,
				...newData
			}, emit)
		}
	}
	onDocumentMouseUp(event: MouseEvent) {
		super.onDocumentMouseUp(event)
		this.onDocumentMouseMove(event, true)
		this.endEditShape()
	}
}
