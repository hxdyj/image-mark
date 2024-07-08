import { G, Image, MatrixExtract, SVG, Svg } from "@svgdotjs/svg.js";
import { getContainerInfo, getElement } from "./utils/dom";
import { ImageMarkShape, ShapeData, ShapeType } from "./shape/Shape";
import { ImageMarkRect, RectData } from "./shape/Rect";
import { ImageMarkImage, ImageData } from "./shape/Image";
import { throttle } from "lodash";
import EventEmitter from "eventemitter3";


export enum EventBusEventName {
	FirstRender = 'firstRender',
}

export type ImageClient = {
	imageClientX: number
	imageClientY: number
}

export type Document2ContainerOffset = {
	_offsetX?: number
	_offsetY?: number
}

export type ArrayPoint = [number, number]
export type ContainerMouseEvent = MouseEvent & ImageClient & Document2ContainerOffset
export type ContainerType = string | HTMLElement;
export type BoundingBox = Pick<RectData, "x" | "y" | "width" | "height">
export type ImageMarkOptions = {
	el: ContainerType
	src: string
	scaleToCenter?: {
		box?: BoundingBox
		/**
		 * 留白 数值应该在0 - 1之间，按照百分比去算的
		 *  */
		padding?: number
	}
	data?: ShapeData[]
}

export class ImageMark {
	private container: HTMLElement;
	private containerRectInfo: ReturnType<typeof getContainerInfo>;
	private stage: Svg;
	private stageGroup: G;
	private node2ShapeInstanceWeakMap = new WeakMap<ShapeData, ImageMarkShape>()
	private data: ShapeData[] = []
	private image: Image
	private imageDom: HTMLImageElement
	private lastTransform: MatrixExtract = {}
	private status = {
		scaling: false,
		moving: false
	}
	private minScale = 0.1
	private maxScale = 10
	private movingStartPoint: ArrayPoint | null = null
	private eventBus = new EventEmitter()
	constructor(private options: ImageMarkOptions) {
		this.data = options.data || []
		this.container = getElement(this.options.el)
		if (!this.container) {
			throw new Error('Container not found')
		}

		this.container.style.overflow = 'hidden'
		this.containerRectInfo = getContainerInfo(this.container)
		this.init()
		this.stage = SVG()
		this.stage.attr({
			style: `background-color:blue`
		})
		this.stageGroup = new G()

		this.image = new Image()
		this.imageDom = document.createElement('img')
		this.image.load(this.options.src, (ev) => {
			this.imageDom = ev.target as HTMLImageElement
			this.stageGroup.addTo(this.stage)
			this.drawImage(ev)
			this.draw()
			this.render()
			this.addDefaultAction()
			this.addContainerEvent()
			this.eventBus.emit(EventBusEventName.FirstRender)
		})
	}

	private init() {
		this.crateDataShape()
	}

	private draw() {
		this.stage.size(this.containerRectInfo.width, this.containerRectInfo.height)
		this.data.forEach(node => {
			const shape = this.node2ShapeInstanceWeakMap.get(node)
			if (shape) {
				shape.render(this.stageGroup)
			}
		})
	}

	private render() {
		this.stage.addTo(this.container)
	}

	private crateDataShape() {
		this.data.forEach(node => {
			if (!this.node2ShapeInstanceWeakMap.has(node)) {
				let shape = null
				if (node.type === ShapeType.Rect) {
					shape = new ImageMarkRect(node as RectData)
				}
				if (node.type === ShapeType.Image) {
					shape = new ImageMarkImage(node as ImageData)
				}
				if (shape) {
					this.node2ShapeInstanceWeakMap.set(node, shape)
				}
			}
		})
	}

	private drawImage(ev: Event) {
		let target = ev.target as HTMLImageElement
		let imgWidth = target.naturalWidth
		let imgHeight = target.naturalHeight
		let containerWidth = this.containerRectInfo.width
		let containerHeight = this.containerRectInfo.height
		let { padding = 0, box } = this.options?.scaleToCenter ?? {}
		if (this.options?.scaleToCenter) {
			let paddingWidth = containerWidth * padding
			let paddingHeight = containerHeight * padding

			let maxWidth = containerWidth - paddingWidth * 2
			let maxHeight = containerHeight - paddingHeight * 2
			if (box) {//如果有box，就按照box的长宽比例展示图片
				let boxWidth = box.width
				let boxHeight = box.height
				let boxFitScale = maxWidth / maxHeight > boxWidth / boxHeight ? maxHeight / boxHeight : maxWidth / boxWidth // 长边尽量展示出来
				this.stageGroup.transform({
					scale: boxFitScale,
					translate: [(containerWidth - boxWidth * boxFitScale) / 2 - box.x * boxFitScale, (containerHeight - boxHeight * boxFitScale) / 2 - box.y * boxFitScale]
				})

			} else {//就是按照图片的长宽比例展示图片
				let widthRate = maxWidth / imgWidth
				let heightRate = maxHeight / imgHeight
				let imageFitScale = maxWidth / maxHeight > imgWidth / imgHeight ? heightRate : widthRate // 长边尽量展示出来
				this.stageGroup.transform({
					scale: imageFitScale,
					translate: [(containerWidth - imgWidth * imageFitScale) / 2, (containerHeight - imgHeight * imageFitScale) / 2]
				})
			}
		}
		this.lastTransform = this.stageGroup.transform()
		this.image.size(target.naturalWidth, target.naturalHeight)
		this.image.addTo(this.stageGroup)
	}

	private addDefaultAction() {
		this.addStageMouseScale()
		this.addStageLmbDownMoveing()
	}

	private removeDefaultAction() {
		this.removeStageMouseScale()
		this.removeStageLmbDownMoveing()
	}

	private onContainerWheel(e: Event) {
		e.preventDefault()

	}

	addContainerEvent() {
		this.container.addEventListener('wheel', this.onContainerWheel.bind(this))
		return this
	}

	removeContainerEvent() {
		this.container.removeEventListener('wheel', this.onContainerWheel)
		return this
	}


	private onComtainerLmbDownMoveingMouseDownEvent(e: Event) {
		let ev = e as MouseEvent
		if (ev.button === 0) {
			this.startSuccessiveMove([ev.offsetX, ev.offsetY])
		}
	}

	private onComtainerLmbDownMoveingMouseMoveEvent = throttle((e: Event) => {
		let ev = e as ContainerMouseEvent
		if (ev.button === 0 && this.status.moving && this.movingStartPoint) {
			this.moveSuccessive(this.getEventOffset(this.documentMouseEvent2EnhanceEvent(ev)))
		}
	}, 16, {
		leading: true,
		trailing: true
	})

	private onComtainerLmbDownMoveingMouseUpEvent(e: Event) {
		let ev = e as MouseEvent
		if (ev.button === 0 && this.status.moving && this.movingStartPoint) {
			this.endSuccessiveMove()
		}
	}

	addStageLmbDownMoveing() {
		this.onComtainerLmbDownMoveingMouseDownEvent = this.onComtainerLmbDownMoveingMouseDownEvent.bind(this)
		this.onComtainerLmbDownMoveingMouseUpEvent = this.onComtainerLmbDownMoveingMouseUpEvent.bind(this)

		this.container.addEventListener('mousedown', this.onComtainerLmbDownMoveingMouseDownEvent)
		document.addEventListener('mousemove', this.onComtainerLmbDownMoveingMouseMoveEvent)
		document.addEventListener('mouseup', this.onComtainerLmbDownMoveingMouseUpEvent)
		return this
	}

	removeStageLmbDownMoveing() {
		this.container.removeEventListener('mousedown', this.onComtainerLmbDownMoveingMouseDownEvent)
		document.removeEventListener('mousemove', this.onComtainerLmbDownMoveingMouseMoveEvent)
		document.removeEventListener('mouseup', this.onComtainerLmbDownMoveingMouseUpEvent)
		return this
	}

	private onComtainerMouseWheelEvent(ev: Event) {
		let e = ev as WheelEvent
		let enhanceEvt = this.containerMouseEvent2EnhanceEvent(e)
		this.scale(e.deltaY < 0 ? 1 : -1, [enhanceEvt.imageClientX, enhanceEvt.imageClientY], 'image')
	}

	addStageMouseScale() {
		this.onComtainerMouseWheelEvent = this.onComtainerMouseWheelEvent.bind(this)
		this.stage.on('wheel', this.onComtainerMouseWheelEvent)
		return this
	}
	removeStageMouseScale() {
		this.stage.off('wheel', this.onComtainerMouseWheelEvent)
		return this
	}

	moveSuccessive(point: ArrayPoint) {
		if (!this.status.moving || this.status.scaling) return
		if (!this.movingStartPoint) return
		let offsetPoint: ArrayPoint = [point[0] - this.movingStartPoint[0], point[1] - this.movingStartPoint[1]]
		//还原到move之前的状态
		this.stageGroup.transform(this.lastTransform)
		//移动
		this.stageGroup.transform({
			translate: offsetPoint
		}, true)
		return this
	}

	endSuccessiveMove() {
		this.status.moving = false
		this.movingStartPoint = null
		this.lastTransform = this.stageGroup.transform()
		return this
	}
	startSuccessiveMove(point: ArrayPoint) {
		this.status.moving = true
		this.movingStartPoint = point
		return this
	}

	move(point: ArrayPoint) {
		if (this.status.scaling || this.status.moving) return
		this.status.moving = true

		this.stageGroup.transform({
			translate: point
		}, true)
		this.lastTransform = this.stageGroup.transform()
		this.status.moving = false
		return this
	}



	scale(direction: 1 | -1, point: ArrayPoint | 'left-top' | 'center', reletiveTo: 'container' | 'image' = 'container') {
		if (this.status.scaling || this.status.moving) return
		if (point === 'left-top') {
			point = [0, 0]
		}
		if (point === 'center') {
			point = [this.imageDom.naturalWidth / 2, this.imageDom.naturalHeight / 2]
		}
		let origin = point

		const zoomIntensity = 0.1
		let zoom = Math.exp(direction * zoomIntensity)


		if (zoom * this.lastTransform.scaleX! < this.minScale || zoom * this.lastTransform.scaleX! > this.maxScale) {
			console.warn(`scale out of ${this.minScale} - ${this.maxScale} range`)
			return
		}
		this.status.scaling = true

		if (reletiveTo === 'container') {
			origin = this.containerPoint2ImagePoint(point)
		}
		this.stageGroup.transform({
			origin,
			scale: zoom,
		}, true)
		this.lastTransform = this.stageGroup.transform()
		this.status.scaling = false
		return this
	}

	private documentMouseEvent2EnhanceEvent(event: MouseEvent): ContainerMouseEvent {
		this.containerRectInfo = getContainerInfo(this.container)
		const cloneEvent = event as ContainerMouseEvent
		cloneEvent._offsetX = event.clientX - this.containerRectInfo.x
		cloneEvent._offsetY = event.clientY - this.containerRectInfo.y
		return this.containerMouseEvent2EnhanceEvent(cloneEvent)
	}

	private getEventOffset(event: ContainerMouseEvent): ArrayPoint {
		return [event._offsetX || event.offsetX, event._offsetY || event.offsetY]
	}

	private containerMouseEvent2EnhanceEvent(event: MouseEvent): ContainerMouseEvent {
		const cloneEvent = event as ContainerMouseEvent
		const newPoint = this.containerPoint2ImagePoint(this.getEventOffset(cloneEvent))
		cloneEvent.imageClientX = newPoint[0]
		cloneEvent.imageClientY = newPoint[1]
		return cloneEvent
	}

	private containerPoint2ImagePoint(point: ArrayPoint): ArrayPoint {
		let newX = (point[0] - this.lastTransform.translateX!) / this.lastTransform.scaleX!
		let newY = (point[1] - this.lastTransform.translateY!) / this.lastTransform.scaleY!
		return [newX, newY]
	}

	setMinScale(minScale: number) {
		this.minScale = minScale
		return this
	}

	setMaxScale(maxScale: number) {
		this.maxScale = maxScale
		return this
	}

	on(...rest: any) {
		this.eventBus.on.apply(this.eventBus, rest)
		return this
	}

}

