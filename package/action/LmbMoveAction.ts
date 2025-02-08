import { G, MatrixExtract, Point, Shape } from "@svgdotjs/svg.js";
import ImageMark, { ArrayPoint } from "..";
import { Action } from "./action";
import { getDefaultTransform, ImageMarkShape } from "../shape/Shape";
import { uid } from "uid";
import { cloneDeep } from "lodash-es";


export type LmbMoveActionOptions = {
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
		this.uid = shape.uid + '_' + uid(6)
		const __args = {
			uid: this.uid
		}
		this.bindEventThis(['onMouseDown', 'onDoucmentMouseMoving', 'onDocumentMouseUp'], {
			onDoucmentMouseMoving: __args,
			onDocumentMouseUp: __args
		})
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

	getEnableMove() {
		const shapePlugin = this.getShapePlugin()
		return this.moveable && !shapePlugin?.disableActionList.has(LmbMoveAction.actionName)
	}


	destroy(): void {
		super.destroy()
		this.unbindEvent()
	}

	protected onMouseDown(event: Event) {
		if (this.imageMark.status.drawing) return
		if (!this.getEnableMove()) return
		let evt = event as MouseEvent
		if (evt.button !== 0) return
		event.stopPropagation()
		event.preventDefault()
		this.status.mouseDown = true
		this.startPoint = this.imageMark.stageGroup.point(evt.clientX, evt.clientY)
		this.startTransform = this.shape.shapeInstance.transform()
		this.options?.onStart?.(this.imageMark, this.shape, evt)
	}

	protected onDoucmentMouseMoving(event: MouseEvent) {
		const { uid } = Reflect.get(event, '__args') || {}
		if (uid !== this.uid) return
		if (event.button !== 0) return
		if (!this.status.mouseDown || !this.startTransform || !this.startPoint) return
		event.stopPropagation()
		event.preventDefault()
		let cloneShape = new G()
		cloneShape.transform(this.startTransform)
		const cloneMovePoint = this.imageMark.stageGroup.point(event.clientX, event.clientY)
		let cloneDiffPoint: ArrayPoint = [cloneMovePoint.x - this.startPoint.x, cloneMovePoint.y - this.startPoint.y]
		cloneShape.transform({
			translate: cloneDiffPoint
		}, true)

		const nextTransform = cloneShape.transform()
		const limitFlag = this.options?.limit?.(this.imageMark, this.shape, nextTransform) || [0, 0]

		this.shape.shapeInstance.transform(this.startTransform)

		const movePoint = this.imageMark.stageGroup.point(event.clientX, event.clientY)

		let diffPoint: ArrayPoint = [movePoint.x - this.startPoint.x + limitFlag[0], movePoint.y - this.startPoint.y + limitFlag[1]]

		this.shape.shapeInstance.transform({
			translate: diffPoint
		}, true)

		this.options?.onMove?.(this.imageMark, this.shape, event)
		return diffPoint
	}

	protected onDocumentMouseUp(event: MouseEvent) {
		const { uid } = Reflect.get(event, '__args') || {}

		if (uid !== this.uid) return
		if (event.button !== 0 || !this.status.mouseDown) return
		event.stopPropagation()
		event.preventDefault()
		this.onDoucmentMouseMoving(event)
		this.status.mouseDown = false
		this.startPoint = null

		const currentMatrix = Object.assign(getDefaultTransform(), this.shape.shapeInstance.transform())

		this.shape.data.transform = {
			matrix: {
				a: currentMatrix.a!,
				b: currentMatrix.b!,
				c: currentMatrix.c!,
				d: currentMatrix.d!,
				e: currentMatrix.e!,
				f: currentMatrix.f!
			}
		}
		this.shape.updateData(this.shape.data)
		this.startTransform = null

		this.options?.onEnd?.(this.imageMark, this.shape, event)
	}

}
