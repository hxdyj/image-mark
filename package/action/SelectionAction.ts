import ImageMark from "..";
import { Action } from ".";
import { ImageMarkShape } from "../shape/Shape";
import { uid } from "uid";
import { Rect } from "@svgdotjs/svg.js";
import { EventBusEventName } from "../event/const";


export type SelectionDrawFunc = (selection: SelectionAction) => void
export type SelectionActionOptions = {
	initDrawFunc?: SelectionDrawFunc
}

export class SelectionAction extends Action {
	static actionName = "selection"
	protected uid: string
	selected: boolean = false

	constructor(protected imageMark: ImageMark, protected shape: ImageMarkShape, protected options?: SelectionActionOptions) {
		super(imageMark, shape, options)
		this.uid = shape.uid + '_' + uid(6)
		const __args = {
			uid: this.uid
		}
		this.bindEventThis(['onMouseDown', 'onMouseUp', 'draw'], {
			onMouseDown: __args,
			onMouseUp: __args
		})
		this.bindEvents()
	}

	protected bindEvents() {
		this.shape.shapeInstance.on('mousedown', this.onMouseDown)
		this.shape.shapeInstance.on('mouseup', this.onMouseUp)

	}
	protected unbindEvent() {
		this.shape.shapeInstance.off('mousedown', this.onMouseDown)
		this.shape.shapeInstance.off('mouseup', this.onMouseUp)
	}

	getSelectionShape(): Rect | undefined {
		return this.shape.shapeInstance.find(`#${this.getSelectionId()}`)[0] as Rect | undefined
	}

	getSelectionId() {
		return `selection_${this.uid}`
	}

	disableSelection() {
		this.getSelectionShape()?.remove()
		this.shape.removeDrawFunc(this.draw)
		this.selected = false
	}

	enableSelection() {
		this.shape.addDrawFunc(this.draw)
		this.selected = true
	}


	private draw() {
		const mainShape = this.shape.getMainShape()
		const bbox = mainShape.bbox()

		const selectionShape = this.getSelectionShape() || new Rect()
		selectionShape.id(this.getSelectionId())
		const padding = 20
		selectionShape.move(bbox.x - padding, bbox.y - padding)
		selectionShape.size(bbox.width + padding * 2, bbox.height + padding * 2)
		selectionShape.stroke({
			color: '#F53F3F',
			width: 10,
		}).fill('none')

		selectionShape.addTo(this.shape.shapeInstance)

		this.options?.initDrawFunc?.(this)
	}


	destroy(): void {
		super.destroy()
		this.unbindEvent()
	}

	private downTime: number | null = null

	protected onMouseDown(event: Event) {
		if (this.imageMark.status.drawing) return
		let evt = event as MouseEvent
		if (evt.button !== 0) return
		evt.stopPropagation()
		evt.preventDefault()
		this.downTime = Date.now()
	}

	protected onMouseUp(event: Event) {
		let evt = event as MouseEvent
		const { uid } = Reflect.get(evt, '__args') || {}
		if (uid !== this.uid) return
		if (evt.button !== 0) return
		if (!this.downTime) return

		if ((Date.now() - this.downTime) < 150) {
			this.imageMark.eventBus.emit(EventBusEventName.selection_action_click, this.shape)
		}

		this.downTime = null
	}
}
