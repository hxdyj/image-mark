import { Circle, G, Line, Point, Polygon, Polyline } from "@svgdotjs/svg.js";
import { EditPointItem, ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeMouseDrawType, ShapeOptions } from "./Shape";
import ImageMark from "../index";
import { chunk, clamp, defaultsDeep } from "lodash-es";
import { darkenColor } from "../utils/color.util";

export interface PolygonData extends ShapeData {
	shapeName: "polygon",
	points: number[],
	auxiliaryPoint?: [number, number]
}

export class ImageMarkPolygon extends ImageMarkShape<PolygonData> {
	static shapeName = "polygon"
	readonly mouseDrawType: ShapeMouseDrawType = 'multiPress'

	constructor(data: PolygonData, imageMarkInstance: ImageMark, options?: ShapeOptions) {
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

			const { strokeColor, strokeWidth } = this.getMainShapeInfo()
			polyline.plot(points.concat(this.data.auxiliaryPoint || [])).stroke({
				...this.attr?.stroke || {},
				color: strokeColor,
				width: strokeWidth
			}).fill(this.attr?.fill || 'none')

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

	fixData(data?: PolygonData | undefined): void {
		data = data || this.data
		const flagName = this.getPreStatusOperateActionName()
		if (flagName) {
			data.points = data.points.map((point, index) => {
				if (index % 2 === 0) {
					return this.imageMark.options.action?.[flagName] ? point : this.clampX(point)
				}
				return this.imageMark.options.action?.[flagName] ? point : this.clampY(point)
			})
		}
	}

	mouseEvent2Data(options: MouseEvent2DataOptions): PolygonData | null {
		const { pointList = [], auxiliaryPoint } = options
		if (!pointList.length) return null
		const points = pointList.map(point => {
			return [point.x, point.y]
		}).flat() as unknown as number[]

		const newLine: PolygonData = {
			...this.data,
			points,
		}

		if (auxiliaryPoint) {
			newLine.auxiliaryPoint = [auxiliaryPoint.x, auxiliaryPoint.y]
		}
		return newLine
	}


	getEditPointClassName(className: number) {
		return `edit-point-${className}`
	}

	getMidPointClassName(index: number) {
		return `edit-mid-point-${index}`
	}

	drawEdit() {
		const g = this.getEditGroup<G>() || new G().id(this.getEditGroupId())

		// 清理所有旧的中点控制点
		g.find('.edit-add-point').forEach(el => el.remove())

		const editPointList: EditPointItem<number>[] = chunk(this.data.points, 2).map((item, index) => {
			return {
				x: item[0],
				y: item[1],
				className: index
			}
		})

		const { strokeWidth, optimalStrokeColor, strokeColor } = this.getMainShapeInfo()

		// 渲染顶点控制点
		editPointList.forEach(point => {
			const className = this.getEditPointClassName(point.className)
			const findCircle = g.find(`.${className}`)[0]
			const circle = findCircle || new Circle().addClass(className).addClass('edit-move-point').attr('data-index', point.className).attr('data-type', 'vertex') as Circle
			circle.center(point.x, point.y).attr({
				r: (strokeWidth)
			}).fill(optimalStrokeColor)
			circle.addTo(g)
			if (!findCircle) {
				circle.on('mousedown', this.startEditShape)
			}
		})

		// 渲染中点控制点（用于添加新点）
		// Polygon 是闭合的，所以最后一个点和第一个点之间也需要中点
		const pointCount = editPointList.length
		if (pointCount >= 2 && this.isEnableEditAddMidPoint()) {
			for (let i = 0; i < pointCount; i++) {
				const currentPoint = editPointList[i]
				const nextPoint = editPointList[(i + 1) % pointCount]
				const midX = (currentPoint.x + nextPoint.x) / 2
				const midY = (currentPoint.y + nextPoint.y) / 2

				const midClassName = this.getMidPointClassName(i)
				const midGroup = new G()
					.addClass(midClassName)
					.addClass('edit-add-point')
					.attr('data-index', i)
					.attr('data-type', 'midpoint')

				// 背景圆（使用加深 20% 的主色）
				const midCircle = new Circle()
				midCircle.attr({
					cx: midX,
					cy: midY,
					r: strokeWidth * 1.6
				}).fill(darkenColor(optimalStrokeColor, 30))
				midCircle.addTo(midGroup)

				// 加号（使用主色）
				const plusSize = strokeWidth * 0.8
				const plusLine1 = new Line()
					.plot(midX - plusSize, midY, midX + plusSize, midY)
					.stroke({ color: strokeColor, width: strokeWidth * 0.4 })
				const plusLine2 = new Line()
					.plot(midX, midY - plusSize, midX, midY + plusSize)
					.stroke({ color: strokeColor, width: strokeWidth * 0.4 })
				plusLine1.addTo(midGroup)
				plusLine2.addTo(midGroup)

				midGroup.addTo(g)
				midGroup.on('mousedown', this.onMidPointMouseDown)
			}
		}

		g.addTo(this.shapeInstance)
	}

	onMidPointMouseDown = (event: Event) => {
		event.stopPropagation()
		const mouseEvent = event as unknown as MouseEvent
		// @ts-ignore
		let target = event.target.instance
		// 向上查找带有 data-index 的 Group
		while (target && target.attr('data-index') === undefined) {
			target = target.parent()
		}
		const index = target?.attr('data-index') as number
		if (index === undefined) return

		// 获取点击位置的实际坐标
		const point = this.imageMark.image.point(mouseEvent.clientX, mouseEvent.clientY)

		// 限制在图像边界内
		if (!this.imageMark.options.action?.enableEditShapeOutOfImg) {
			point.x = clamp(point.x, 0, this.imageMark.imageDom.naturalWidth)
			point.y = clamp(point.y, 0, this.imageMark.imageDom.naturalHeight)
		}

		// 保存数据快照用于 history
		this.startModifyData()

		// 在 index 和 index+1 之间插入新点
		// points 是扁平数组 [x1, y1, x2, y2, ...]
		const insertIndex = (index + 1) * 2
		this.data.points.splice(insertIndex, 0, point.x, point.y)

		// 更新数据并触发事件
		this.updateData(this.data, true)
	}

	onEndDrawing() {
		delete this.data.auxiliaryPoint
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

	onDocumentMouseMove(event: MouseEvent, emit = false) {
		super.onDocumentMouseMove(event)
		const evt = event as MouseEvent
		if (evt.button === 0 && this.editMouseDownEvent) {
			event.stopPropagation()
			const { index, point } = this.getEditPoint(event)
			const startIndex = index * 2
			this.data.points.splice(startIndex, 2, point.x, point.y)
			this.updateData(this.data, emit)
		}
		this.getEditShape()?.addClass('edit-moving-point')
	}

	onDocumentMouseUp(event: MouseEvent) {
		super.onDocumentMouseUp(event)
		this.onDocumentMouseMove(event, true)
		this.getEditShape()?.removeClass('edit-moving-point')
		this.endEditShape()
	}
}
