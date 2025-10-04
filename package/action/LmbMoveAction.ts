import { G, MatrixExtract, Point, Shape } from "@svgdotjs/svg.js";
import ImageMark, { ArrayPoint } from "../index";
import { Action } from "./action";
import { ImageMarkShape } from "../shape/Shape";
import { uid } from "uid";
import { EventBusEventName } from '../event/const';

export type LmbMoveActionOptions = {
	moveable?: boolean
	onStart?: (imageMark: ImageMark, shape: ImageMarkShape, event: MouseEvent) => void
	onMove?: (imageMark: ImageMark, shape: ImageMarkShape, event: MouseEvent) => void
	onEnd?: (imageMark: ImageMark, shape: ImageMarkShape, event: MouseEvent) => void
	limit?: (imageMark: ImageMark, shape: ImageMarkShape, nextTransform: MatrixExtract) => ArrayPoint
}

export class LmbMoveAction extends Action {
	static actionName = "lmbMove"
	protected moveable = true
	protected status: {
		mouseDown: boolean
	} = {
			mouseDown: false,
		}

	protected startPoint: Point | null = null
	protected startTransform: MatrixExtract | null = null
	protected uid: string

	constructor(protected imageMark: ImageMark, protected shape: ImageMarkShape, protected options?: LmbMoveActionOptions) {
		super(imageMark, shape, options)
		this.uid = shape.data.uuid + '_' + uid(6)
		const finalOptions = this.getOptions<LmbMoveActionOptions>()
		this.moveable = finalOptions.moveable ?? true
		this.bindEventThis(['onMouseDown'])
		this.bindEvents()
		if (this.moveable) {
			this.addClassName()
		} else {
			this.removeClassName()
		}
	}

	getLmbMoveActionOptions() {
		return this.getOptions<LmbMoveActionOptions>()
	}

	protected bindEvents() {
		this.shape.shapeInstance.on('mousedown', this.onMouseDown)

	}
	protected unbindEvent() {
		this.shape.shapeInstance.off('mousedown', this.onMouseDown)
	}

	addClassName() {
		this.shape.shapeInstance.addClass('shape-enable-move')
	}

	removeClassName() {
		this.shape.shapeInstance.removeClass('shape-enable-move')
	}

	public disableMove() {
		this.moveable = false
		this.removeClassName()
	}
	public enableMove() {
		this.moveable = true
		this.addClassName()
	}

	getEnableMove() {
		const shapePlugin = this.imageMark?.getShapePlugin()
		return this.moveable && !shapePlugin?.disableActionList.has(LmbMoveAction.actionName)
	}


	destroy(): void {
		super.destroy()
		this.unbindEvent()
	}

	protected onMouseDown(event: Event) {
		if (!this.getEnableMove() || this.imageMark?.options.readonly) {
			this.imageMark.onContainerLmbDownMoveingMouseDownEvent(event)
			return
		}
		this.imageMark?.getShapePlugin()?.setHoldShape(this.shape)
		if (this.imageMark.status.shape_drawing) return
		let evt = event as MouseEvent
		if (evt.button !== 0) return
		evt.stopPropagation()
		this.status.mouseDown = true
		this.shape.startModifyData()
		this.imageMark.status.shape_moving = this.shape
		this.startPoint = this.imageMark.stageGroup.point(evt.clientX, evt.clientY)
		this.startTransform = this.shape.shapeInstance.transform()
		this.getLmbMoveActionOptions()?.onStart?.(this.imageMark, this.shape, evt)
		this.imageMark.eventBus.emit(EventBusEventName.shape_start_move, this.shape, this.imageMark)
	}

	onContainerMouseMove(event: MouseEvent) {
		if (event.button !== 0) return
		if (!this.status.mouseDown || !this.startTransform || !this.startPoint) return
		let cloneShape = new G()
		cloneShape.transform(this.startTransform)
		const cloneMovePoint = this.imageMark.stageGroup.point(event.clientX, event.clientY)
		let cloneDiffPoint: ArrayPoint = [cloneMovePoint.x - this.startPoint.x, cloneMovePoint.y - this.startPoint.y]
		cloneShape.transform({
			translate: cloneDiffPoint
		}, true)

		const nextTransform = cloneShape.transform()
		const enableMoveShapeOutOfImg = this.imageMark.options.action?.enableMoveShapeOutOfImg

		const actionOptions = this.getLmbMoveActionOptions()

		if (!enableMoveShapeOutOfImg && !actionOptions?.limit) {
			actionOptions.limit = (imageMark, shape, nextTransform) => {
				const { x, y, width, height } = shape.getMainShape().bbox()
				let { translateX = 0, translateY = 0 } = nextTransform
				translateX += x
				translateY += y

				let { naturalHeight, naturalWidth } = imageMark.imageDom
				let isOutOfBounds = false
				const fixTranslate: ArrayPoint = [0, 0]
				if (translateX < 0) {
					isOutOfBounds = true
					fixTranslate[0] = -translateX
				}

				if (translateX > (naturalWidth - width)) {

					isOutOfBounds = true
					fixTranslate[0] = naturalWidth - width - translateX
				}

				if (translateY < 0) {

					isOutOfBounds = true
					fixTranslate[1] = -translateY
				}

				if (translateY > (naturalHeight - height)) {

					isOutOfBounds = true
					fixTranslate[1] = naturalHeight - height - translateY
				}
				return fixTranslate
			}
		}

		const limitFlag = actionOptions?.limit?.(this.imageMark, this.shape, nextTransform) || [0, 0]

		this.shape.shapeInstance.transform(this.startTransform)

		const movePoint = this.imageMark.stageGroup.point(event.clientX, event.clientY)

		let diffPoint: ArrayPoint = [movePoint.x - this.startPoint.x + limitFlag[0], movePoint.y - this.startPoint.y + limitFlag[1]]

		this.shape.shapeInstance.transform({
			translate: diffPoint
		}, true)

		this.getLmbMoveActionOptions()?.onMove?.(this.imageMark, this.shape, event)
		return diffPoint
	}

	onDocumentMouseMove(event: MouseEvent): void {
		this.onContainerMouseMove(event)
	}


	onDocumentMouseUp(event: MouseEvent) {
		if (event.button !== 0 || !this.status.mouseDown) return
		event.stopPropagation()
		event.preventDefault()
		this.onContainerMouseMove(event)
		this.status.mouseDown = false
		this.startPoint = null
		this.imageMark.status.shape_moving = null
		const { e = 0, f = 0 } = this.shape.shapeInstance.transform()
		if (e === 0 && f === 0) return
		this.shape.translate?.(e, f)
		this.shape.updateData(this.shape.data)
		this.startTransform = null

		this.getLmbMoveActionOptions()?.onEnd?.(this.imageMark, this.shape, event)
		this.imageMark.getShapePlugin()?.setHoldShape(null)
		this.imageMark.eventBus.emit(EventBusEventName.shape_end_move, this.shape, [e, f], this.imageMark)
	}

}
