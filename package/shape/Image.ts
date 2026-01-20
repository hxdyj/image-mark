import { Circle, G, Image, Point } from "@svgdotjs/svg.js";
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeDrawType, ShapeOptions } from "./Shape";
import { ImageMark } from "../index";
import { getBoundingBoxByTwoPoints, RectEditPointClassName, RectEditPointItem } from "./Rect";
import { clamp } from "lodash-es";

export interface ImageData extends ShapeData {
	x: number
	y: number
	width: number
	height: number
	src: string
	shapeName: 'image'
}
export class ImageMarkImage extends ImageMarkShape<ImageData> {
	static shapeName = 'image'
	readonly mouseDrawType = 'multiPress' as const

	constructor(data: ImageData, imageMarkInstance: ImageMark, options?: ShapeOptions) {
		super(data, imageMarkInstance, options)
	}

	sourceWH: {
		width: number,
		height: number
	} | null = null

	protected loadUrl: string = ''
	readonly drawType: ShapeDrawType = 'centerRxy'

	draw(): G {
		const { src } = this.data
		const image = this.getMainShape<Image>() || new Image()
		image.id(this.getMainId())
		image.opacity(this.attr?.image?.opacity ?? 0.8)
		image.attr({
			preserveAspectRatio: this.attr?.image?.preserveAspectRatio
		})


		if (this.loadUrl === src) {
			this.drawInfo()
		} else {
			image.load(src, (evt) => {
				this.sourceWH = {
					//@ts-ignore
					width: evt.target?.naturalWidth || 0,
					//@ts-ignore
					height: evt.target?.naturalHeight || 0
				}
				this.loadUrl = src
				this.drawInfo()
			})
		}

		image.addTo(this.shapeInstance)

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

	protected drawInfo() {
		const image = this.shapeInstance.findOne('image') as Image
		image.size(this.data.width, this.data.height)
		console.log('draw image info', this.data.x, this.data.y, this.data.width, this.data.height)
		this.getMainShape()?.move(this.data.x, this.data.y)
		this.getLabelShape()?.remove()
		this.drawLabel()
	}

	onEndDrawing() {
		const img = this.getMainShape()
		const preserveAspectRatio = img.attr('preserveAspectRatio')
		if (this.sourceWH && (preserveAspectRatio === 'xMidYMid' || !preserveAspectRatio)) {
			const { x, y, width, height } = this.data
			let boxFitScale = this.sourceWH.width / this.sourceWH.height > width / height ? this.sourceWH.width / width : this.sourceWH.height / height  // 长边尽量展示出来
			const scaleWH = {
				width: this.sourceWH.width / boxFitScale,
				height: this.sourceWH.height / boxFitScale,
			}
			this.data.width = scaleWH.width
			this.data.height = scaleWH.height
			this.data.x = x + Math.abs(scaleWH.width - width) / 2
			this.data.y = y + Math.abs(scaleWH.height - height) / 2
		}
	}

	translate(x: number, y: number): void {
		this.data.x += x
		this.data.y += y
		this.shapeInstance.transform({
			translate: [0, 0]
		}, false)
	}

	fixData(data?: ImageData | undefined): void {
		data = data || this.data
		const flagName = this.getPreStatusOperateActionName()
		if (flagName) {
			data.x = this.imageMark.options.action?.[flagName] ? data.x : this.clampX(data.x, -data.width)
			data.y = this.imageMark.options.action?.[flagName] ? data.y : this.clampY(data.y, -data.height)
		}
	}


	mouseEvent2Data(options: MouseEvent2DataOptions): ImageData | null {
		const { pointList = [], auxiliaryPoint } = options
		if (pointList.length < 1) return null
		const startPoint = pointList[0]
		const endPoint = auxiliaryPoint || pointList[pointList.length - 1]
		if (!endPoint) return null
		const halfWidth = Math.abs(endPoint.x - startPoint.x)
		const halfHeight = Math.abs(endPoint.y - startPoint.y)
		const newImageData: ImageData = {
			...this.data,
			x: startPoint.x - halfWidth,
			y: startPoint.y - halfHeight,
			width: halfWidth * 2,
			height: halfHeight * 2,
		}

		// 点击两次完成绘制
		if (pointList.length >= 2) {
			this.imageMark.getShapePlugin()?.endDrawing()
		}

		return newImageData
	}

	drawEdit() {
		const { x, y, width, height } = this.data
		const g = this.getEditGroup<G>() || new G().id(this.getEditGroupId())
		let editPointList: RectEditPointItem[] = [
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
		const img = this.getMainShape()
		const preserveAspectRatio = img.attr('preserveAspectRatio')
		if (preserveAspectRatio != 'none') {
			editPointList = editPointList.filter(item => ['tl', 'tr', 'bl', 'br'].includes(item.className))
		}

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
		this.onEndDrawing()
		this.draw()
	}
}
