import ImageMark from "..";
import { Action } from "./action";
import { ImageMarkShape } from "../shape/Shape";
import { uid } from "uid";
import { Rect, StrokeData } from "@svgdotjs/svg.js";
import { EventBusEventName } from "../event/const";
import { defaultsDeep } from "lodash-es";


export type SelectionDrawFunc = (selection: SelectionAction) => void

export type SelectionActionAttr = {
	stroke?: StrokeData
	fill?: string
	padding?: number
}

export type SelectionActionOptions = {
	initDrawFunc?: SelectionDrawFunc
	setAttr?: (action: SelectionAction) => SelectionActionAttr
}

export class SelectionAction extends Action {
	static actionName = "selection"
	protected uid: string
	selected: boolean = false
	attr: SelectionActionAttr = {
		stroke: {
			color: '#F53F3F',
		},
		fill: 'none',
		padding: 20,
	}
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
		this.attr = defaultsDeep(this.options?.setAttr?.(this) || {}, this.attr)
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
		this.shape.draw()
	}

	enableSelection() {
		this.shape.addDrawFunc(this.draw)
		this.selected = true
		this.shape.draw()
	}


	private draw() {
		const mainShape = this.shape.getMainShape()
		const bbox = mainShape.bbox()

		const selectionShape = this.getSelectionShape() || new Rect()
		selectionShape.id(this.getSelectionId())
		const padding = this.attr.padding ?? 20
		selectionShape.move(bbox.x - padding, bbox.y - padding)
		selectionShape.size(bbox.width + padding * 2, bbox.height + padding * 2)
		selectionShape.stroke(defaultsDeep(this.attr.stroke, this.shape.attr?.stroke || {})).fill(this.attr.fill || 'none')

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
