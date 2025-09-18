import { Circle, G, Point, Polygon, Rect } from "@svgdotjs/svg.js";
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeMouseDrawType, ShapeOptions } from "./Shape";
import ImageMark, { BoundingBox } from "..";
import { getOptimalTextColor } from "../../src/utils/color.util";
import { cloneDeep } from "lodash-es";


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

export type EditPointType = 'tl' | 't' | 'tr' | 'b' | 'bl' | 'br' | 'l' | 'r'


export class ImageMarkRect extends ImageMarkShape<RectData> {
	static shapeName = "rect"
	constructor(data: RectData, imageMarkInstance: ImageMark, options: ShapeOptions) {
		super(data, imageMarkInstance, options)
		this.bindEventThis([
			'onEditPointMouseDown',
		])
	}

	getEditEventPointType() {
		//@ts-ignore
		const point = this.editMouseDownEvent?.target.instance as Circle
		const className = point.classes()[0] as unknown as EditPointType
		return className
	}

	editMouseDownEvent: Event | null = null
	tmpData: RectData | null = null
	getEditPoint(event: Event): [Point, Point] {
		const className = this.getEditEventPointType()
		const currentEvent = event as MouseEvent
		const startEvent = this.editMouseDownEvent as MouseEvent
		const offset = [currentEvent.clientX - startEvent.clientX, currentEvent.clientY - startEvent.clientY]
		const { x = 0, y = 0, width = 0, height = 0 } = this.tmpData || {}
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
						x: 0,
						y: 0
					}),
					new Point({
						x: 0,
						y: 0
					})
				]
			},
			'tr': () => {
				return [
					new Point({
						x: 0,
						y: 0
					}),
					new Point({
						x: 0,
						y: 0
					})
				]
			},
			't': () => {
				return [
					new Point({
						x: 0,
						y: 0
					}),
					new Point({
						x: 0,
						y: 0
					})
				]
			},
			'r': () => {
				return [
					new Point({
						x: 0,
						y: 0
					}),
					new Point({
						x: 0,
						y: 0
					})
				]
			},
			'br': () => {
				return [
					new Point({
						x: 0,
						y: 0
					}),
					new Point({
						x: 0,
						y: 0
					})
				]
			},
			'bl': () => {
				return [
					new Point({
						x: 0,
						y: 0
					}),
					new Point({
						x: 0,
						y: 0
					})
				]
			},
			'b': () => {
				return [
					new Point({
						x: 0,
						y: 0
					}),
					new Point({
						x: 0,
						y: 0
					})
				]
			},
		}[className]
		return handle() as [Point, Point]
	}

	onEditPointMouseDown(event: Event) {
		event.stopPropagation()
		this.editMouseDownEvent = event
		this.tmpData = cloneDeep(this.data)
		this.imageMark.getShapePlugin()?.setHoldShape(this)
	}

	onDocumentMouseMove(event: MouseEvent) {
		super.onDocumentMouseMove(event)
		const evt = event as MouseEvent
		if (evt.button === 0 && this.editMouseDownEvent) {
			event.stopPropagation()
			const list = this.getEditPoint(event)
			const newData = getBoundingBoxByTwoPoints(...list)
			this.updateData(newData as RectData)

			//TODO(songle): 这里需要更新label的位置 而且编辑完以后再移动，label位置也不对
		}
	}
	onDocumentMouseUp(event: MouseEvent) {
		super.onDocumentMouseUp(event)
		const evt = event as MouseEvent
		if (evt.button === 0 && this.editMouseDownEvent) {
			event.stopPropagation()
			const list = this.getEditPoint(event)
			const newData = getBoundingBoxByTwoPoints(...list)
			this.updateData(newData as RectData)
			this.editMouseDownEvent = null
			this.tmpData = null
			this.imageMark.getShapePlugin()?.setHoldShape(null)
		}
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

	//TODO(songle):
	drawEdit() {
		const { x, y, width, height } = this.data
		const g = this.getEditGroup<G>() || new G().id(this.getEditGroupId())
		const editPointList: Array<{
			x: number
			y: number
			type: EditPointType

		}> = [
				{
					x,
					y,
					type: 'tl'
				},
				{
					x: x + width / 2,
					y,
					type: 't'
				},
				{
					x: x + width,
					y,
					type: 'tr'
				},
				{
					x: x + width / 2,
					y: y + height,
					type: 'b'
				},
				{
					x,
					y: y + height,
					type: 'bl'
				},
				{
					x: x + width,
					y: y + height,
					type: 'br'
				},
				{
					x,
					y: y + height / 2,
					type: 'l'
				},
				{
					x: x + width,
					y: y + height / 2,
					type: 'r'
				},
			]

		editPointList.forEach(point => {
			const findCircle = g.find(`.${point.type}`)[0]
			const circle = findCircle || new Circle().addClass(point.type) as Circle
			const mainStrokeWidth = this.getMainShape().attr('stroke-width')
			const mainStrokeColor = this.getMainShape().attr('stroke')
			circle.center(point.x, point.y).attr({
				r: (mainStrokeWidth || 6) / 2
			}).fill(getOptimalTextColor(mainStrokeColor))
			circle.addTo(g)
			if (!findCircle) {
				circle.on('mousedown', this.onEditPointMouseDown)
			}
		})

		g.addTo(this.shapeInstance)
	}
}
