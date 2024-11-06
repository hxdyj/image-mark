import { G, Image, MatrixAlias, MatrixExtract, Shape, SVG, Svg } from "@svgdotjs/svg.js";
import { getContainerInfo, getElement } from "./utils/dom";
import { debounce, defaultsDeep, difference, throttle } from "lodash-es";
import EventEmitter from "eventemitter3";
import { getRectWeltContainerEdgeNameList, sortEdgeNames } from "./utils/cartesianCoordinateSystem";
import { Plugin } from "./plugins";
import { EventBindingThis } from "./event";
import { EventBusEventName } from "./event/const";
import { CssNameKey } from "./const/const";
import { uid } from 'uid'
export type TransformStep = [MatrixAlias, boolean]

export const POSITION_LIST = ['left-top', 'right-top', 'left-bottom', 'right-bottom', 'top', 'bottom', 'left', 'right', 'center'] as const
export type Position = typeof POSITION_LIST[number]
export type OutOfData = [boolean, number] // [是否超出,距离(正数为超出,零和负数为未超出)]
export type ArrayPoint = [number, number]
export type ArrayWH = ArrayPoint
export type ContainerType = string | HTMLElement;
export type BoundingBox = {
	x: number
	y: number
	width: number
	height: number
}
export type EnhanceBoundingBox = BoundingBox & {
	endX: number
	endY: number
}

export type EdgeName = 'left' | 'right' | 'top' | 'bottom'

export type DirectionOutOfInfo = {
	[key in EdgeName]: OutOfData
}

export type InitialScaleSize = 'fit' | 'original' | 'width' | 'height' | 'cover'
export type ImageMarkOptions = {
	el: ContainerType
	src: string
	initScaleConfig?: ({
		to?: 'image'
	} | {
		to: 'box'
		box: BoundingBox
	}) & {
		startPosition?: 'center' | 'left-top'
		size?: InitialScaleSize
		/**
		 * 留白
		 *  */
		padding?: number
		paddingUnit?: 'px' | '%'
	}
	moveConfig?: {
	},
	enableImageOutOfContainer?: boolean
	pluginOptions?: {
		[key: string]: any // [插件名称]：[插件配置]
	}
}

export class ImageMarkManager {
	imageMarkEleInstanceWeakMap: WeakMap<HTMLElement, ImageMark> = new WeakMap()
	getWeakMap() {
		return this.imageMarkEleInstanceWeakMap
	}
}

const imageMarkManager = new ImageMarkManager()

export class ImageMark extends EventBindingThis {
	id: string;
	container: HTMLElement;
	containerRectInfo: ReturnType<typeof getContainerInfo>;
	stage: Svg;
	stageGroup: G;
	image: Image
	imageDom: HTMLImageElement
	lastTransform: MatrixExtract = {}
	plugin: {
		[key: string]: Plugin
	} = {}
	status = {
		scaling: false,
		moving: false
	}
	minScale = 0.1
	maxScale = 10
	movingStartPoint: ArrayPoint | null = null
	eventBus = new EventEmitter()
	createTime: number

	constructor(public options: ImageMarkOptions) {
		super()
		this.id = uid(6)
		this.container = getElement(this.options.el)

		if (imageMarkManager.getWeakMap().has(this.container)) {
			const oldInstance = imageMarkManager.getWeakMap().get(this.container)
			oldInstance?.destroy()
		}

		imageMarkManager.getWeakMap().set(this.container, this)

		if (!this.container) {
			throw new Error('Container not found')
		}
		this.createTime = Date.now()
		this.container.style.overflow = 'hidden'

		this.containerRectInfo = getContainerInfo(this.container)

		console.log('init containerRectInfo', this.containerRectInfo)

		this.options.initScaleConfig = defaultsDeep(this.options.initScaleConfig, {
			to: 'image',
			size: 'fit',
			padding: 0.1
		})

		this.options.moveConfig = defaultsDeep(this.options.moveConfig, {})

		this.options.enableImageOutOfContainer = this.options.enableImageOutOfContainer ?? true

		this.stage = SVG()

		this.stage.css({
			background: '#c9cdd4'
		})
		this.stage.size(this.containerRectInfo.width, this.containerRectInfo.height)

		this.stageGroup = new G()
		this.image = new Image()
		this.imageDom = document.createElement('img')
		this.initBindAllEventsThis()
		ImageMark.pluginList.forEach(plugin => {
			this.initPlugin(plugin)
		})
		this.init()
	}

	protected initBindAllEventsThis() {
		this.bindEventThis([
			'onContainerWheel',
			'onComtainerLmbDownMoveingMouseDownEvent',
			'onComtainerLmbDownMoveingMouseUpEvent',
			'onComtainerMouseWheelEvent',

			'onContainerDragEnterEvent',
			'onContainerDragLeaveEvent',
			'onContainerDragOverEvent',
			'onContainerDropEvent'
		])
		this.addDefaultAction()
		this.addContainerEvent()
	}

	protected init(action?: 'resize' | 'rerender') {
		this.eventBus.emit(EventBusEventName.init, this)
		this.image.load(this.options.src, (ev: any) => {
			this.imageDom = ev.target as HTMLImageElement
			this.stageGroup.addTo(this.stage)

			let drawSize: Parameters<typeof this.drawImage>[1] = 'initial'

			if (action === 'rerender' || action == 'resize' && this.options.enableImageOutOfContainer) {
				drawSize = 'reserve'
			}


			if (action === 'resize' && Date.now() - this.createTime <= 340) {
				drawSize = 'initial'
			}

			this.drawImage(ev, drawSize)
			this.render()
			if (!action) {
				this.eventBus.emit(EventBusEventName.first_render, this)
			}

			if (action) {
				this.eventBus.emit(action == 'resize' ? EventBusEventName.resize : EventBusEventName.rerender, this)
			}
			this.draw()
		})
	}

	protected initVariable() {
		this.containerRectInfo = getContainerInfo(this.container)
		this.stage.size(this.containerRectInfo.width, this.containerRectInfo.height)
		this.stageGroup.remove()
		this.stageGroup = new G()
		this.image = new Image()
		this.imageDom = document.createElement('img')
	}

	resize() {
		this.containerRectInfo = getContainerInfo(this.container)
		console.log('resize containerRectInfo', this.containerRectInfo)
		this.stage.size(this.containerRectInfo.width, this.containerRectInfo.height)
		this.initVariable()
		this.init('resize')
	}

	rerender() {
		this.initVariable()
		this.init('rerender')
	}

	destroy() {
		this.removeContainerEvent()
		this.removeDefaultAction()
		Object.values(this.plugin).forEach(plugin => {
			plugin.destroy()
		})
		this.stage.remove()
		imageMarkManager.getWeakMap().delete(this.container)
	}

	protected draw() {
		this.eventBus.emit(EventBusEventName.draw, this)
	}

	protected removeContainerRenderItems() {
		const list = this.container.querySelectorAll(`.${CssNameKey.image_mark_render_item}`)
		list.forEach(item => item.remove())
	}

	protected render() {
		this.removeContainerRenderItems()
		this.stage.addClass(CssNameKey.image_mark_render_item)
		this.stage.addTo(this.container)
	}

	protected getInitialScaleAndTranslate(options: ImageMarkOptions['initScaleConfig']) {

		let imgWidth = this.imageDom.naturalWidth
		let imgHeight = this.imageDom.naturalHeight


		let containerWidth = this.containerRectInfo.width
		let containerHeight = this.containerRectInfo.height
		let { padding = 0, size = 'fit', to = 'image', startPosition = 'center', paddingUnit = '%' } = options!
		if (!this.options.enableImageOutOfContainer) {
			padding = 0
			size = 'cover'
		}
		let box: BoundingBox | null = null
		if (options!.to === 'box') {
			box = options?.box || null
		}

		let paddingWidth = padding
		let paddingHeight = padding

		if (paddingUnit === '%') {
			paddingWidth = containerWidth * padding
			paddingHeight = containerHeight * padding
		}

		let maxWidth = containerWidth - paddingWidth * 2
		let maxHeight = containerHeight - paddingHeight * 2

		let initialScale = 1
		let translateOffset: ArrayPoint = [0, 0]
		type Deal = {
			[key in InitialScaleSize]: () => void
		}
		if (to == 'box' && box) {//如果有box，就按照box的长宽比例展示图片
			let boxWidth = box.width
			let boxHeight = box.height
			let deal: Deal = {
				fit: () => {
					let boxFitScale = maxWidth / maxHeight > boxWidth / boxHeight ? maxHeight / boxHeight : maxWidth / boxWidth // 长边尽量展示出来
					initialScale = boxFitScale
					if (startPosition === 'center') {
						translateOffset = [(containerWidth - boxWidth * boxFitScale) / 2 - box.x * boxFitScale, (containerHeight - boxHeight * boxFitScale) / 2 - box.y * boxFitScale]
					}
				},
				original: () => {
					if (startPosition === 'left-top') {
						translateOffset = [-box.x + paddingWidth, -box.y + paddingHeight]
					}
					if (startPosition === 'center') {
						translateOffset = [(containerWidth - boxWidth) / 2 - box.x + paddingWidth, (containerHeight - boxHeight) / 2 - box.y + paddingHeight]
					}
				},
				cover: () => {
					let boxCoverScale = maxWidth / maxHeight < boxWidth / boxHeight ? maxHeight / boxHeight : maxWidth / boxWidth // 短边尽量展示出来
					initialScale = boxCoverScale
					if (startPosition === 'left-top') {
						translateOffset = [-box.x * boxCoverScale + paddingWidth, -box.y * boxCoverScale + paddingHeight]
					}
					if (startPosition === 'center') {
						translateOffset = [(containerWidth - boxWidth * boxCoverScale) / 2 - box.x * boxCoverScale + paddingWidth, (containerHeight - boxHeight * boxCoverScale) / 2 - box.y * boxCoverScale + paddingHeight]
					}
				},
				width: () => {
					initialScale = maxWidth / boxWidth
					if (startPosition === 'left-top') {
						translateOffset = [paddingWidth - box.x * initialScale, - box.y * initialScale + paddingHeight]
					}
					if (startPosition === 'center') {
						translateOffset = [(containerWidth - boxWidth * initialScale) / 2 - box.x * initialScale, (containerHeight - boxHeight * initialScale) / 2 - box.y * initialScale]
					}
				},
				height: () => {
					initialScale = maxHeight / boxHeight
					if (startPosition === 'left-top') {
						translateOffset = [- box.x * initialScale + paddingWidth, - box.y * initialScale + paddingHeight]
					}
					if (startPosition === 'center') {
						translateOffset = [(containerWidth - boxWidth * initialScale) / 2 - box.x * initialScale, (containerHeight - boxHeight * initialScale) / 2 - box.y * initialScale]
					}
				}
			}
			deal[size]()

		} else if (to == 'image') {//就是按照图片的长宽比例展示图片
			let widthRate = maxWidth / imgWidth
			let heightRate = maxHeight / imgHeight

			let deal: Deal = {
				fit: () => {
					let imageFitScale = maxWidth / maxHeight > imgWidth / imgHeight ? heightRate : widthRate // 长边尽量展示出来
					initialScale = imageFitScale
					if (startPosition === 'center') {
						translateOffset = [(containerWidth - imgWidth * imageFitScale) / 2, (containerHeight - imgHeight * imageFitScale) / 2]
					}
				},
				original: () => {
					if (startPosition === 'left-top') {
						translateOffset = [paddingWidth, paddingHeight]
					}
					if (startPosition === 'center') {
						translateOffset = [(containerWidth - imgWidth) / 2 + paddingWidth, (containerHeight - imgHeight) / 2 + paddingHeight]
					}
				},
				cover: () => {
					let imageCoverScale = maxWidth / maxHeight < imgWidth / imgHeight ? heightRate : widthRate // 短边尽量展示出来
					initialScale = imageCoverScale
					if (startPosition === 'left-top') {
						translateOffset = [paddingWidth, paddingHeight]
					}
					if (startPosition === 'center') {
						translateOffset = [(containerWidth - imgWidth * initialScale) / 2 + paddingWidth, (containerHeight - imgHeight * initialScale) / 2 + paddingHeight]
					}
				},
				width: () => {
					initialScale = maxWidth / imgWidth
					if (startPosition === 'left-top') {
						translateOffset = [paddingWidth, paddingHeight]
					}
					if (startPosition === 'center') {
						translateOffset = [(containerWidth - imgWidth * initialScale) / 2, (containerHeight - imgHeight * initialScale) / 2]
					}
				},
				height: () => {
					initialScale = maxHeight / imgHeight
					if (startPosition === 'left-top') {
						translateOffset = [paddingWidth, paddingHeight]
					}
					if (startPosition === 'center') {
						translateOffset = [(containerWidth - imgWidth * initialScale) / 2, (containerHeight - imgHeight * initialScale) / 2]
					}
				}
			}
			deal[size]()
		}
		return {
			scale: initialScale,
			translate: translateOffset
		}
	}


	protected checkMinScaleValidate() {
		if (!this.options.enableImageOutOfContainer) {
			const { scale: minScale } = this.getInitialScaleAndTranslate({ 'size': 'cover' })
			let { scaleX: currentScaleX = 1 } = this.stageGroup.transform()
			if (currentScaleX < minScale) {
				this.minScale = minScale
				if (this.maxScale < minScale) {
					this.maxScale = minScale
				}
				return false
			}
		}
		return true
	}

	protected checkInitOutOfContainerAndReset() {
		if (!this.checkMinScaleValidate()) {
			this.checkScaleLimitImageInContainer([0, 0])
		}
	}

	protected drawImage(ev: Event, size: 'initial' | 'reserve' = 'initial') {
		let target = ev.target as HTMLImageElement
		if (size == 'reserve') {
			this.stageGroup.transform(this.lastTransform, false)
		}

		if (size == 'initial') {
			const initTrasform = this.getInitialScaleAndTranslate(this.options.initScaleConfig)
			this.stageGroup.transform(initTrasform, false)
			console.log('drawImage initial', initTrasform)
		}

		this.lastTransform = this.stageGroup.transform()

		this.checkInitOutOfContainerAndReset()

		this.image.size(this.imageDom.naturalWidth, this.imageDom.naturalHeight)
		this.image.addTo(this.stageGroup)
	}

	protected addDefaultAction() {
		this.addStageMouseScale()
		this.addStageLmbDownMoveing()
	}

	protected removeDefaultAction() {
		this.removeStageMouseScale()
		this.removeStageLmbDownMoveing()
	}

	protected onContainerWheel(e: Event) {
		e.preventDefault()
	}

	protected onContainerDragLeaveEvent(e: DragEvent) {
		this.eventBus.emit(EventBusEventName.container_drag_leave, e, this)
	}
	protected onContainerDropEvent(e: DragEvent) {
		this.eventBus.emit(EventBusEventName.container_drop, e, this)
		e.preventDefault()
	}

	protected onContainerDragEnterEvent(e: DragEvent) {
		this.eventBus.emit(EventBusEventName.container_drag_enter, e, this)
		e.preventDefault()
	}


	protected onContainerDragOverEvent(e: DragEvent) {
		this.eventBus.emit(EventBusEventName.container_drag_over, e, this)
		e.preventDefault()
	}

	protected containerResizeObserverCallback: ResizeObserverCallback = debounce((entries: any) => {
		console.count('resize observer callback')
		if (entries[0]?.target === this.container) {
			this.resize()
			console.log('containerResizeObserverCallback', Date())
		}
	}, 300)

	protected containerResizeObserver = new ResizeObserver(this.containerResizeObserverCallback)

	addContainerEvent() {
		this.container.addEventListener('wheel', this.onContainerWheel)
		this.container.addEventListener('dragenter', this.onContainerDragEnterEvent)
		this.container.addEventListener('dragover', this.onContainerDragOverEvent)
		this.container.addEventListener('dragleave', this.onContainerDragLeaveEvent)
		this.container.addEventListener('drop', this.onContainerDropEvent)

		this.containerResizeObserver.observe(this.container)

		return this
	}

	removeContainerEvent() {
		this.container.removeEventListener('wheel', this.onContainerWheel)
		this.container.removeEventListener('dragenter', this.onContainerDragEnterEvent)
		this.container.removeEventListener('dragover', this.onContainerDragOverEvent)
		this.container.removeEventListener('dragleave', this.onContainerDragLeaveEvent)
		this.container.removeEventListener('drop', this.onContainerDropEvent)

		this.containerResizeObserver.disconnect()

		return this
	}


	protected onComtainerLmbDownMoveingMouseDownEvent(e: Event) {
		e.preventDefault()
		let ev = e as MouseEvent
		if (ev.button === 0) {
			this.startSuccessiveMove([ev.offsetX, ev.offsetY])
		}
	}

	protected onComtainerLmbDownMoveingMouseMoveEvent = throttle((e: Event) => {
		let ev = e as MouseEvent
		if (ev.button === 0 && this.status.moving && this.movingStartPoint) {
			const { x, y } = this.stage.point(ev.clientX, ev.clientY)
			this.moveSuccessive([x, y])
		}
	}, 16, {
		leading: true,
		trailing: true
	})

	protected onComtainerLmbDownMoveingMouseUpEvent(e: Event) {
		let ev = e as MouseEvent
		if (ev.button === 0 && this.status.moving && this.movingStartPoint) {
			this.endSuccessiveMove()
		}
	}

	addStageLmbDownMoveing() {
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

	protected onComtainerMouseWheelEvent(ev: Event) {
		let e = ev as WheelEvent
		const imagePoint = this.image.point(e.clientX, e.clientY)
		this.scale(e.deltaY < 0 ? 1 : -1, [imagePoint.x, imagePoint.y], 'image')
	}

	addStageMouseScale() {
		this.stage.on('wheel', this.onComtainerMouseWheelEvent)
		return this
	}

	removeStageMouseScale() {
		this.stage.off('wheel', this.onComtainerMouseWheelEvent)
		return this
	}

	protected limitMovePoint(movePoint: ArrayPoint): ArrayPoint {
		if (this.options.enableImageOutOfContainer) return [0, 0]
		let currentTransform = this.stageGroup.transform()

		let fixPoint: ArrayPoint = [0, 0]

		let cloneGroup = this.cloneGroup(currentTransform)

		cloneGroup.transform({
			translate: movePoint
		}, true)

		let nextStepTransform = cloneGroup.transform()

		let { directionOutOfInfo } = this.isOutofContainer(nextStepTransform)

		if (movePoint[0] > 0 && directionOutOfInfo.left[0]) {
			fixPoint[0] = -directionOutOfInfo.left[1]
		}

		if (movePoint[0] < 0 && directionOutOfInfo.right[0]) {
			fixPoint[0] = - directionOutOfInfo.right[1]
		}

		if (movePoint[1] > 0 && directionOutOfInfo.top[0]) {
			fixPoint[1] = -directionOutOfInfo.top[1]
		}

		if (movePoint[1] < 0 && directionOutOfInfo.bottom[0]) {
			fixPoint[1] = - directionOutOfInfo.bottom[1]
		}

		return fixPoint
	}

	protected fixPoint(point: ArrayPoint, fixPoint: ArrayPoint): ArrayPoint {
		return [point[0] + fixPoint[0], point[1] + fixPoint[1]]
	}

	moveTo(position: Position) {
		const { scaleX = 1, translateX = 0, translateY = 0 } = this.lastTransform
		const { width, height } = this.containerRectInfo
		const { naturalWidth, naturalHeight } = this.imageDom
		const viewWidth = naturalWidth * scaleX
		const viewHeight = naturalHeight * scaleX
		const x = width - viewWidth
		const y = height - viewHeight


		if (position == 'left') {
			const { translateX = 0, translateY = 0 } = this.lastTransform
			this.stageGroup.translate(-translateX, -translateY + y / 2)
		}

		if (position == 'left-top') {
			const { translateX = 0, translateY = 0 } = this.lastTransform
			this.stageGroup.translate(-translateX, -translateY)
		}

		if (position == 'left-bottom') {
			const { translateX = 0, translateY = 0 } = this.lastTransform
			this.stageGroup.translate(-translateX, -translateY + y)
		}

		if (position == 'right') {
			const { translateX = 0, translateY = 0 } = this.lastTransform
			this.stageGroup.translate(-translateX + x, -translateY + y / 2)
		}

		if (position == 'right-top') {
			this.stageGroup.translate(-translateX + x, -translateY)
		}

		if (position == 'right-bottom') {
			this.stageGroup.translate(-translateX + x, -translateY + y)
		}

		if (position == 'top') {
			this.stageGroup.translate(-translateX + x / 2, -translateY)
		}

		if (position == 'bottom') {
			this.stageGroup.translate(-translateX + x / 2, -translateY + y)
		}
		if (position == 'center') {
			const center = [width / 2, height / 2]
			const viewCenter = [viewWidth / 2, viewHeight / 2]

			let newPosition = [center[0] - viewCenter[0], center[1] - viewCenter[1]]

			this.stageGroup.translate(-translateX + newPosition[0], -translateY + newPosition[1])
		}

		this.lastTransform = this.stageGroup.transform()
	}

	move(point: ArrayPoint) {
		if (this.status.scaling || this.status.moving) return
		point = this.fixPoint(point, this.limitMovePoint(point))
		this.status.moving = true

		this.stageGroup.transform({
			translate: point
		}, true)
		this.lastTransform = this.stageGroup.transform()
		this.status.moving = false
		return this
	}

	moveSuccessive(point: ArrayPoint) {
		if (!this.status.moving || this.status.scaling) return
		if (!this.movingStartPoint) return
		let offsetPoint: ArrayPoint = [point[0] - this.movingStartPoint[0], point[1] - this.movingStartPoint[1]]
		let currentTransform = this.stageGroup.transform()
		let diffPoint: ArrayPoint = [((this.lastTransform.translateX || 0) + offsetPoint[0]) - (currentTransform.translateX || 0), ((this.lastTransform.translateY || 0) + offsetPoint[1]) - (currentTransform.translateY || 0)]
		offsetPoint = this.fixPoint(offsetPoint, this.limitMovePoint(diffPoint))
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

	protected checkScaleLimitImageInContainer(point: ArrayPoint, callback?: (nextGroup: G) => void) {
		let cloneGroup = this.cloneGroup()
		callback?.(cloneGroup)
		let nextStepTransform = cloneGroup.transform()

		const scaleLimitResult = this.getScaleLimitImageInContainerInfo(point, this.lastTransform, nextStepTransform)

		if (scaleLimitResult === false) {
			console.warn('scale out of container')
			return this
		}

		if (scaleLimitResult) {
			this.status.scaling = true
			scaleLimitResult.forEach(item => {
				this.stageGroup.transform(...item)
			})
			this.lastTransform = this.stageGroup.transform()
			this.status.scaling = false
			return this
		}

		return null
	}

	scale(direction: 1 | -1, point: ArrayPoint | 'left-top' | 'center', reletiveTo: 'container' | 'image' = 'container', newScale?: number) {
		if (this.status.scaling || this.status.moving) return
		if (point === 'left-top') {
			point = [0, 0]
		}
		if (point === 'center') {
			point = [this.imageDom.naturalWidth / 2, this.imageDom.naturalHeight / 2]
			if (reletiveTo === 'container') {
				point = [this.containerRectInfo.width / 2, this.containerRectInfo.height / 2]
			}

		}
		let origin = point

		const zoomIntensity = 0.1
		let zoom = Math.exp(direction * zoomIntensity)

		let currentScale = this.lastTransform.scaleX || 1
		let afterScale = newScale !== undefined ? newScale : this.lastTransform.scaleX! * zoom


		if (reletiveTo === 'container') {
			origin = this.containerPoint2ImagePoint(point)
		}

		function transformScale(shape: Shape) {
			if (newScale !== undefined) {
				shape.transform({
					origin,
					scale: newScale / currentScale,
				}, true)
			} else {
				shape.transform({
					origin,
					scale: zoom,
				}, true)
			}
		}

		if (direction == -1 && !this.options.enableImageOutOfContainer) {
			const { scale } = this.getInitialScaleAndTranslate({
				size: 'cover'
			})
			if ((this.lastTransform.scaleX || 1) === scale) {
				const { isOutOf } = this.isOutofContainer(this.lastTransform)
				if (isOutOf) {
					let { translate } = this.getInitialScaleAndTranslate(this.options.initScaleConfig)
					this.stageGroup.transform({
						translate: [-(this.lastTransform.translateX || 0), -(this.lastTransform.translateY || 0)]
					}, true)
					this.stageGroup.transform({
						translate
					}, true)
					this.lastTransform = this.stageGroup.transform()
				}
				return this
			}

			const flag = this.checkScaleLimitImageInContainer(point, (cloneGroup) => {
				transformScale(cloneGroup)
			})

			if (flag) return this
		}


		if ((afterScale < this.minScale || afterScale > this.maxScale) && !(currentScale > this.maxScale && afterScale < currentScale || currentScale < this.minScale && afterScale > currentScale)) {
			console.warn(`scale out of ${this.minScale} - ${this.maxScale} range`)
			return
		}



		this.status.scaling = true

		transformScale(this.stageGroup)
		this.lastTransform = this.stageGroup.transform()
		this.status.scaling = false
		this.eventBus.emit(EventBusEventName.scale, this.lastTransform.scaleX, this)
		return this
	}

	protected containerPoint2ImagePoint(point: ArrayPoint): ArrayPoint {
		let newX = (point[0] - this.lastTransform.translateX!) / this.lastTransform.scaleX!
		let newY = (point[1] - this.lastTransform.translateY!) / this.lastTransform.scaleY!
		return [newX, newY]
	}

	setMinScale(minScale: number | InitialScaleSize) {
		if (!this.options.enableImageOutOfContainer) return this

		let minScaleValue: number = this.minScale
		if (typeof minScale === 'string') {
			minScaleValue = this.getInitialScaleAndTranslate({ size: minScale }).scale
		} else {
			minScaleValue = minScale
		}

		if (minScaleValue > this.maxScale) {
			console.error('minScale should be less than maxScale')
			return this
		}
		this.minScale = minScaleValue
		return this
	}

	setMaxScale(maxScale: number | InitialScaleSize) {
		let maxScaleValue: number = this.maxScale

		if (typeof maxScale === 'string') {
			maxScaleValue = this.getInitialScaleAndTranslate({ size: maxScale }).scale
		} else {
			maxScaleValue = maxScale
		}

		if (maxScaleValue < this.minScale) {
			console.error('maxScale should be greater than minScale')
			return this
		}

		this.maxScale = maxScaleValue
		return this
	}

	on(...rest: any) {
		this.eventBus.on.apply(this.eventBus, rest)
		return this
	}

	off(...rest: any) {
		this.eventBus.off.apply(this.eventBus, rest)
		return this
	}

	scaleTo(options: ImageMarkOptions['initScaleConfig'], point: ArrayPoint | 'left-top' | 'center', reletiveTo: 'container' | 'image' = 'container') {
		const { scale } = this.getInitialScaleAndTranslate(options)
		this.scale(-1, point, reletiveTo, scale)
	}

	setEnableImageOutOfContainer(enable: boolean) {
		if (this.options.moveConfig) {
			this.options.enableImageOutOfContainer = enable
			if (!enable) {
				this.checkInitOutOfContainerAndReset()
			}
		}
		return this
	}


	protected cloneGroup(transform?: MatrixExtract): G {
		const cloneGroup = new G()
		cloneGroup.transform(transform || this.lastTransform)
		return cloneGroup
	}


	protected getImageBoundingBoxByTransform(transform: MatrixExtract): EnhanceBoundingBox {
		const { naturalWidth, naturalHeight } = this.imageDom
		const { translateX = 0, translateY = 0, scaleX = 1, scaleY = 1 } = transform
		const width = naturalWidth * scaleX
		const height = naturalHeight * scaleY
		return {
			x: translateX,
			y: translateY,
			endX: translateX + width,
			endY: translateY + height,
			width,
			height,
		}
	}
	protected getScaleLimitImageInContainerInfo(scaleOrigin: ArrayPoint, currentTransform: MatrixExtract, nextStepTransform: MatrixExtract): Array<[MatrixAlias, boolean]> | null | false {
		let { isOutOf, directionOutOfInfo } = this.isOutofContainer(nextStepTransform)
		if (isOutOf) {
			let { scaleX: currentScaleX = 1 } = currentTransform
			let { scaleX: nextScaleX = 1 } = nextStepTransform
			let newScale = nextScaleX / currentScaleX

			let { scale: minScale, translate: initialTranslate } = this.getInitialScaleAndTranslate({ size: 'cover' })
			if (currentScaleX < minScale) {
				// console.log("SCALE LIMIT", 1, currentScaleX, minScale);
				// this.scaleTo({ size: 'cover' }, 'center')
				return [[{ translate: [-(this.lastTransform.translateX || 0), - (this.lastTransform.translateY || 0)] }, true], [{ scale: newScale }, true], [{ translate: initialTranslate }, true]]

			} else if (currentScaleX > minScale) {
				let { width: containerWidth, height: containerHeight } = this.containerRectInfo
				let { naturalWidth, naturalHeight } = this.imageDom
				let { left, top, right, bottom } = directionOutOfInfo

				const currentImageBoundingBox = this.getImageBoundingBoxByTransform(currentTransform)
				const weltList = getRectWeltContainerEdgeNameList(currentImageBoundingBox, {
					x: 0,
					y: 0,
					width: containerWidth,
					height: containerHeight
				})
				const outOfContainerEdgeList = this.getOutOfContainerEdgeList(directionOutOfInfo)

				if (weltList.length == 0) {//没有贴合的
					/**
					 * 分以下几种情况：
					 *  1. 有一边超出   这种情况 先将scale，然后move到这个边
					 *  2. 有两边超出	  这种情况 先scale将  然后move到顶点
					 *  */

					// console.log("SCALE LIMIT", 0, scaleOrigin, currentTransform, nextStepTransform, directionOutOfInfo);

					// console.log("SCALE LIMIT", 2, JSON.stringify(outOfContainerEdgeList));

					// 1. 有一边超出
					if (outOfContainerEdgeList.length == 1) {
						let outEdgeName = outOfContainerEdgeList[0]
						if (outEdgeName == 'left' || outEdgeName == 'right') {
							let translateX = 0
							if (outEdgeName == 'left') {
								translateX = -left[1]
							} else {
								translateX = -right[1]
							}

							let moveAction: TransformStep = [{ translateX }, true]
							let scaleAction: TransformStep = [{ origin: scaleOrigin, scale: newScale }, true]
							// console.log("SCALE LIMIT", 3, JSON.stringify(moveAction), JSON.stringify(scaleAction));

							return [scaleAction, moveAction]
						}

						if (outEdgeName == 'top' || outEdgeName == 'bottom') {
							let translateY = 0
							if (outEdgeName == 'top') {
								translateY = -top[1]
							} else {
								translateY = -bottom[1]
							}
							let moveAction: TransformStep = [{ translateY }, true]
							let scaleAction: TransformStep = [{ origin: scaleOrigin, scale: newScale }, true]
							// console.log("SCALE LIMIT", 4, JSON.stringify(moveAction), JSON.stringify(scaleAction));
							return [scaleAction, moveAction]
						}
					}

					// 2. 有两边超出
					if (outOfContainerEdgeList.length == 2) {
						let pointName = sortEdgeNames(outOfContainerEdgeList).join('-')
						let newTranslate = [0, 0]
						let newOrigin = scaleOrigin
						if (pointName == 'left-top') {
							newTranslate = [-left[1], -top[1]]
							// console.log("SCALE LIMIT", 5);

						}

						if (pointName == 'left-bottom') {
							newTranslate = [-left[1], -bottom[1]]
							// console.log("SCALE LIMIT", 6);

						}

						if (pointName == 'right-top') {
							newTranslate = [-right[1], -top[1]]
							// console.log("SCALE LIMIT", 7);

						}

						if (pointName == 'right-bottom') {
							newTranslate = [-right[1], -bottom[1]]
							// console.log("SCALE LIMIT", 8);
						}


						let moveAction: TransformStep = [{ translateX: newTranslate[0], translateY: newTranslate[1] }, true]
						let scaleAction: TransformStep = [{ origin: newOrigin, scale: newScale }, true]
						// console.log("SCALE LIMIT", 9, JSON.stringify(moveAction), JSON.stringify(scaleAction));
						return [scaleAction, moveAction]
					}

				} else {//有贴合的
					/**
					 * 分以下几种情况：
					 *  1. 有一边贴合   这种情况 先scale，然后move到out的边
					 *  2. 有两边贴合	  这种情况 直接在贴合的顶点scale
					 *  */

					if (weltList.length == 1) {
						let weltPointName = weltList[0]
						const outOfEdgeName = difference(outOfContainerEdgeList, weltList)[0]
						// console.log("SCALE LIMIT", 24, weltList, outOfContainerEdgeList)
						// if (!outOfEdgeName) return false

						let newOrigin = scaleOrigin
						let newTranslate = [0, 0]
						if (weltPointName == 'left') {
							newOrigin[0] = 0
							// console.log("SCALE LIMIT", 10);

						} else if (weltPointName == 'right') {
							newOrigin[0] = naturalWidth
							// console.log("SCALE LIMIT", 11);

						} else if (weltPointName == 'top') {
							newOrigin[1] = 0
							// console.log("SCALE LIMIT", 12);

						} else if (weltPointName == 'bottom') {
							newOrigin[1] = naturalHeight
							// console.log("SCALE LIMIT", 13);

						}

						if (outOfEdgeName == 'left') {
							newTranslate[0] = -left[1]
							// console.log("SCALE LIMIT", 14);

						} else if (outOfEdgeName == 'right') {
							newTranslate[0] = -right[1]
							// console.log("SCALE LIMIT", 15);

						} else if (outOfEdgeName == 'top') {
							newTranslate[1] = -top[1]
							// console.log("SCALE LIMIT", 16);

						} else if (outOfEdgeName == 'bottom') {
							newTranslate[1] = -bottom[1]
							// console.log("SCALE LIMIT", 17);

						}
						let moveAction: TransformStep = [{ translateX: newTranslate[0], translateY: newTranslate[1] }, true]
						let scaleAction: TransformStep = [{ origin: newOrigin, scale: newScale }, true]
						// console.log("SCALE LIMIT", 18, JSON.stringify(moveAction), JSON.stringify(scaleAction));
						return [scaleAction, moveAction]
					}

					if (weltList.length == 2) {
						let weltPointName = sortEdgeNames(weltList).join('-')
						if (weltPointName == 'left-top') {
							// console.log("SCALE LIMIT", 19);

							return [[{ origin: [0, 0], scale: newScale }, true]]
						}

						if (weltPointName == 'left-bottom') {
							// console.log("SCALE LIMIT", 20);
							return [[{ origin: [0, naturalHeight], scale: newScale }, true]]
						}

						if (weltPointName == 'right-top') {
							// console.log("SCALE LIMIT", 21);

							return [[{ origin: [naturalWidth, 0], scale: newScale }, true]]
						}

						if (weltPointName == 'right-bottom') {
							// console.log("SCALE LIMIT", 22);
							return [[{ origin: [naturalWidth, naturalHeight], scale: newScale }, true]]
						}
					}
					// console.log("SCALE LIMIT", 23)
					return false
				}

			} else {
				return null
			}
		}
		return null
	}

	protected getOutOfContainerEdgeList(directionOutOfInfo: DirectionOutOfInfo) {
		let list: EdgeName[] = []
		Object.entries(directionOutOfInfo).forEach(([direction, [isOutOf, distance]]) => {
			if (isOutOf) {
				list.push(direction as EdgeName)
			}
		})
		return list
	}

	protected isOutofContainer(nextStepTransform: MatrixExtract): { isOutOf: boolean, directionOutOfInfo: DirectionOutOfInfo } {
		let { x: nextStepX, y: nextStepY, endX: nextStepEndX, endY: nextStepEndY } = this.getImageBoundingBoxByTransform(nextStepTransform)
		let { width: containerWidth, height: containerHeight } = this.containerRectInfo

		let directionOutOfInfo: DirectionOutOfInfo = {
			left: [false, nextStepX],
			top: [false, nextStepY],
			right: [false, nextStepEndX - containerWidth],
			bottom: [false, nextStepEndY - containerHeight],
		}

		let flag = false

		if (nextStepX > 0) {
			flag = true
			directionOutOfInfo.left[0] = true
		}

		if (nextStepY > 0) {
			flag = true
			directionOutOfInfo.top[0] = true
		}

		if (nextStepEndX < containerWidth) {
			flag = true
			directionOutOfInfo.right[0] = true
		}

		if (nextStepEndY < containerHeight) {
			flag = true
			directionOutOfInfo.bottom[0] = true
		}

		return {
			isOutOf: flag,
			directionOutOfInfo
		}
	}

	// 添加插件
	addPlugin(plugin: typeof Plugin) {
		let hasPlugin = ImageMark.hasPlugin(plugin)
		if (hasPlugin) {
			ImageMark.usePlugin(plugin)
			this.initPlugin(plugin)
		}
	}

	// 移除插件
	removePlugin(plugin: typeof Plugin) {
		let hasPlugin = ImageMark.hasPlugin(plugin)
		if (hasPlugin) {
			ImageMark.pluginList.splice(ImageMark.pluginList.indexOf(plugin), 1)

			let pluginInstance = this.plugin[plugin.pluginName]
			if (pluginInstance) {
				pluginInstance?.beforePluginRemove()
				delete this.plugin[plugin.pluginName]
			}
		}
	}

	// 实例化插件
	initPlugin(plugin: typeof Plugin) {
		this.plugin[plugin.pluginName] = new plugin(this)
	}

	static pluginList: Array<typeof Plugin> = []

	static usePlugin(plugin: typeof Plugin) {
		if (ImageMark.hasPlugin(plugin)) return ImageMark
		ImageMark.pluginList.push(plugin)
		return ImageMark
	}
	static hasPlugin(plugin: typeof Plugin) {
		return ImageMark.pluginList.find(item => item === plugin)
	}


}


export type FunctionKeys<T> = {
	[K in keyof T]: T[K] extends Function ? K : never
}


export default ImageMark
