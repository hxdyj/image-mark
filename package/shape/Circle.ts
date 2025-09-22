import { Circle, G, Point, } from "@svgdotjs/svg.js";
import { EditPointItem, ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeOptions } from "./Shape";
import ImageMark from "..";
import { twoPointsDistance } from "#/utils/cartesianCoordinateSystem";
import { getBoundingBoxByTwoPoints, RectEditPointClassName } from "./Rect";
import { clamp } from "lodash-es";
export interface CircleData extends ShapeData {
	shapeName: "circle",
	x: number,
	y: number,
	r: number
}

export type CircleEditPointClassName = Extract<RectEditPointClassName, 'tl' | 'tr' | 'bl' | 'br'>
export type CircleEditPointItem = EditPointItem<CircleEditPointClassName>

export class ImageMarkCircle extends ImageMarkShape<CircleData> {
	static shapeName = "circle"
	constructor(data: CircleData, imageMarkInstance: ImageMark, options: ShapeOptions) {
		super(data, imageMarkInstance, options)
	}

	readonly drawType = 'centerR'

	draw(): G {
		const { x, y, r } = this.data
		console.log('draw circle', x, y, r)
		const circle = this.getMainShape<Circle>() || new Circle()
		circle.id(this.getMainId())

		circle.center(x, y).attr({
			r
		}).fill(this.attr?.fill || 'transparent').stroke(this.attr?.stroke || {})

		circle.addTo(this.shapeInstance)

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

	mouseEvent2Data(options: MouseEvent2DataOptions): CircleData | null {
		const { eventList = [] } = options
		if (eventList.length < 2) return null
		const startPoint = this.imageMark.image.point(eventList[0])
		const endPoint = this.imageMark.image.point(eventList[eventList.length - 1])
		const r = twoPointsDistance([startPoint.x, startPoint.y], [endPoint.x, endPoint.y])

		const newCircle: CircleData = {
			...this.data,
			x: startPoint.x,
			y: startPoint.y,
			r,
		}

		// console.log('end', eventList[eventList.length - 1], endPoint, newCircle)

		return newCircle
	}


	drawEdit() {
		const { x, y, r } = this.data
		const g = this.getEditGroup<G>() || new G().id(this.getEditGroupId())
		const editPointList: CircleEditPointItem[] = [
			{
				...getPointOnCircle([x, y], r, -135),
				className: 'tl'
			},

			{
				...getPointOnCircle([x, y], r, -45),
				className: 'tr'
			},
			{
				...getPointOnCircle([x, y], r, 135),
				className: 'bl'
			},
			{
				...getPointOnCircle([x, y], r, 45),
				className: 'br'
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


	getEditR(event: MouseEvent): number {
		const currentEvent = event
		const { x = 0, y = 0, r = 0 } = this.editOriginData || {}
		const endPoint = this.imageMark.image.point(currentEvent.clientX, currentEvent.clientY)

		let newR = twoPointsDistance([x, y], [endPoint.x, endPoint.y])

		if (!this.imageMark.options.action?.enableEditShapeOutOfImg) {
			const minR = Math.min(
				x,
				this.imageMark.imageDom.naturalWidth - x,
				y,
				this.imageMark.imageDom.naturalHeight - y,
			)
			if (newR > minR) {
				newR = minR
			}
		}
		return newR
	}

	onDocumentMouseMove(event: MouseEvent) {
		super.onDocumentMouseMove(event)
		const evt = event as MouseEvent
		if (evt.button === 0 && this.editMouseDownEvent) {
			event.stopPropagation()
			const r = this.getEditR(event)
			this.updateData({
				...this.data,
				r
			})
		}
	}
	onDocumentMouseUp(event: MouseEvent) {
		super.onDocumentMouseUp(event)
		this.onDocumentMouseMove(event)
		this.endEditShape()
	}
}

/**
 * 根据圆心坐标、半径和角度计算圆上的点坐标
 * @param center 圆心坐标 [x, y]
 * @param radius 圆的半径
 * @param angle 与正x轴的夹角（角度制，0-360度）
 * @returns 圆上的点坐标 [x, y]
 */
function getPointOnCircle(
	center: [number, number],
	radius: number,
	angle: number
): {
	x: number
	y: number
} {
	// 将角度转换为弧度
	const radians = (angle * Math.PI) / 180;

	// 计算点的坐标
	const x = center[0] + radius * Math.cos(radians);
	const y = center[1] + radius * Math.sin(radians);

	return {
		x,
		y
	};
}
