import ImageMark from "..";
import { Action } from "./action";
import { ImageMarkShape } from "../shape/Shape";
import { uid } from "uid";
import { Rect, StrokeData } from "@svgdotjs/svg.js";
import { EventBusEventName } from "../event/const";
import { defaultsDeep } from "lodash-es";
import Color from "color";


export type SelectionDrawFunc = (selection: SelectionAction) => void

export type SelectionActionAttr = {
	stroke?: StrokeData
	fill?: string
	padding?: number
	whileSelectedEditShape?: boolean
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
			// color: '#F53F3F',
		},
		fill: 'none',
		padding: 20,
		whileSelectedEditShape: true
	}
	constructor(protected imageMark: ImageMark, protected shape: ImageMarkShape, protected options?: SelectionActionOptions) {
		super(imageMark, shape, options)
		this.uid = shape.data.uuid + '_' + uid(6)
		this.bindEventThis(['onMouseDown', 'onMouseUp', 'draw'])
		this.bindEvents()
		this.attr = defaultsDeep(this.getSelectionActionOptions()?.setAttr?.(this) || {}, this.attr)
	}

	protected bindEvents() {
		this.shape.shapeInstance.on('mousedown', this.onMouseDown)
		this.shape.shapeInstance.on('mouseup', this.onMouseUp)

	}
	protected unbindEvent() {
		this.shape.shapeInstance.off('mousedown', this.onMouseDown)
		this.shape.shapeInstance.off('mouseup', this.onMouseUp)
	}

	getSelectionActionOptions() {
		return this.getOptions<SelectionActionOptions>()
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
		this.attr?.whileSelectedEditShape && this.shape.edit(false, false)
		this.shape.draw()
	}

	enableSelection() {
		this.shape.addDrawFunc(this.draw)
		this.selected = true
		this.attr?.whileSelectedEditShape && this.shape.edit(true, false)
		this.shape.draw()
	}

	onReadonlyChange(readonly: boolean) {
		if (!readonly && this.attr?.whileSelectedEditShape && this.selected) {
			this.shape.edit(true, true)
		}
	}

	draw() {
		const mainShape = this.shape.getMainShape()
		const bbox = mainShape.bbox()

		const selectionShape = this.getSelectionShape() || new Rect()
		selectionShape.id(this.getSelectionId())
		const padding = this.attr.padding ?? 20
		selectionShape.move(bbox.x - padding, bbox.y - padding)
		selectionShape.size(bbox.width + padding * 2, bbox.height + padding * 2)

		const mainStrokeColor = this.shape.getMainShape().node.getAttribute('stroke') || this.shape.attr?.stroke?.color
		const stroke = defaultsDeep(this.attr.stroke, {
			...this.shape.attr?.stroke,
			color: Color(mainStrokeColor).rotate(-180).toString()
		}) as StrokeData

		selectionShape.stroke(stroke).fill(this.attr.fill || 'none')

		selectionShape.addTo(this.shape.shapeInstance, 0)

		this.getSelectionActionOptions()?.initDrawFunc?.(this)
	}


	destroy(): void {
		super.destroy()
		this.unbindEvent()
	}

	private downTime: number | null = null


	getEnableSelection() {
		const shapePlugin = this.imageMark?.getShapePlugin()
		return !shapePlugin?.disableActionList.has(SelectionAction.actionName)
	}


	protected onMouseDown(event: Event) {
		if (!this.getEnableSelection()) {
			this.imageMark.onContainerLmbDownMoveingMouseDownEvent(event)
			return
		}
		if (this.imageMark.status.drawing) return
		let evt = event as MouseEvent
		if (evt.button !== 0) return
		evt.stopPropagation()
		evt.preventDefault()
		this.downTime = Date.now()
	}

	protected onMouseUp(event: Event) {
		let evt = event as MouseEvent
		if (evt.button !== 0) return
		if (!this.downTime) return

		if ((Date.now() - this.downTime) < 150) {
			this.imageMark.eventBus.emit(EventBusEventName.selection_action_click, this.shape)
		}

		this.downTime = null
	}
}
