import { G, MatrixExtract, Point, Shape } from "@svgdotjs/svg.js";
import ImageMark, { ArrayPoint } from "..";
import { Action } from ".";
import { ImageMarkShape } from "../shape/Shape";


export type LmbMoveActionOptions = {
	onStart?: (imageMark: ImageMark, shape: ImageMarkShape, event: MouseEvent) => void
	onMove?: (imageMark: ImageMark, shape: ImageMarkShape, event: MouseEvent) => void
	onEnd?: (imageMark: ImageMark, shape: ImageMarkShape, event: MouseEvent) => void
	limit?: (imageMark: ImageMark, shape: ImageMarkShape, nextTransform: MatrixExtract) => boolean
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

	constructor(protected imageMark: ImageMark, protected shape: ImageMarkShape, protected options?: LmbMoveActionOptions) {
		super(imageMark, shape, options)
		this.bindEventThis(['onMouseDown', 'onDoucmentMouseMoving', 'onDocumentMouseUp'])
		this.bindEvents()
	}

	protected bindEvents() {
		this.shape.shapeInstance.on('mousedown', this.onMouseDown)
		document.addEventListener('mousemove', this.onDoucmentMouseMoving)
		document.addEventListener('mouseup', this.onDocumentMouseUp)

	}
	protected unbindEvent() {
		this.shape.shapeInstance.off('mousedown', this.onMouseDown)
		document.removeEventListener('mousemove', this.onDoucmentMouseMoving)
		document.removeEventListener('mouseup', this.onDocumentMouseUp)
	}

	public disableMove() {
		this.moveable = false
	}
	public enableMove() {
		this.moveable = true
	}

	protected onMouseDown(event: Event) {
		if (!this.moveable) return
		let evt = event as MouseEvent
		if (evt.button !== 0) return
		event.stopPropagation()
		event.preventDefault()
		this.status.mouseDown = true
		this.startPoint = this.shape.shapeInstance.point(evt.clientX, evt.clientY)
		this.startTransform = this.shape.shapeInstance.transform()
		this.options?.onStart?.(this.imageMark, this.shape, evt)
	}

	protected onDoucmentMouseMoving(event: MouseEvent) {
		if (event.button !== 0) return
		if (!this.status.mouseDown || !this.startTransform || !this.startPoint) return
		event.stopPropagation()
		event.preventDefault()
		let cloneShape = new G()
		cloneShape.transform(this.shape.shapeInstance.transform())
		this.imageMark.stageGroup.add(cloneShape)
		const cloneMovePoint = cloneShape.point(event.clientX, event.clientY)
		cloneShape.remove()
		let cloneDiffPoint: ArrayPoint = [cloneMovePoint.x - this.startPoint.x, cloneMovePoint.y - this.startPoint.y]
		cloneShape.transform({
			translate: cloneDiffPoint
		}, true)

		const nextTransform = cloneShape.transform()

		let limitFlag = this.options?.limit?.(this.imageMark, this.shape, nextTransform) ?? false
		if (limitFlag) return

		this.shape.shapeInstance.transform(this.startTransform)
		const movePoint = this.shape.shapeInstance.point(event.clientX, event.clientY)
		let diffPoint: ArrayPoint = [movePoint.x - this.startPoint.x, movePoint.y - this.startPoint.y]
		this.shape.shapeInstance.transform({
			translate: diffPoint
		}, true)

		this.options?.onMove?.(this.imageMark, this.shape, event)
		return diffPoint
	}

	protected onDocumentMouseUp(event: MouseEvent) {
		if (event.button !== 0 || !this.status.mouseDown) return
		event.stopPropagation()
		event.preventDefault()
		this.onDoucmentMouseMoving(event)
		this.status.mouseDown = false
		this.startPoint = null
		this.startTransform = null
		this.options?.onEnd?.(this.imageMark, this.shape, event)
	}
}
